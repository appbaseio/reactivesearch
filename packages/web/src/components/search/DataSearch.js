import React, { Component } from "react";
import { connect } from "react-redux";
import Downshift from "downshift";

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions
} from "@appbaseio/reactivecore/lib/actions";
import {
	debounce,
	pushToAndClause,
	checkValueChange,
	checkPropChange,
	checkSomePropChange,
	getClassName
} from "@appbaseio/reactivecore/lib/utils/helper";

import types from "@appbaseio/reactivecore/lib/utils/types";
import Title from "../../styles/Title";
import Input, { suggestionsContainer, suggestions } from "../../styles/Input";
import SearchSvg from "../shared/SearchSvg";
import Flex from "../../styles/Flex";

import { getSuggestions } from "../../utils";

class DataSearch extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: "",
			suggestions: [],
			isOpen: false
		};
		this.internalComponent = props.componentId + "__internal";
	}

	componentWillMount() {
		this.props.addComponent(this.props.componentId);
		this.props.addComponent(this.internalComponent);

		if (this.props.highlight) {
			const queryOptions = this.highlightQuery(this.props);
			this.props.setQueryOptions(this.props.componentId, queryOptions);
		}
		this.setReact(this.props);

		if (this.props.selectedValue) {
			this.setValue(this.props.selectedValue, true);
		} else if (this.props.defaultSelected) {
			this.setValue(this.props.defaultSelected, true);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkSomePropChange(
			this.props,
			nextProps,
			["highlight", "dataField", "highlightField"],
			() => {
				const queryOptions = this.highlightQuery(nextProps);
				this.props.setQueryOptions(nextProps.componentId, queryOptions);
			}
		);

		checkPropChange(
			this.props.react,
			nextProps.react,
			() => this.setReact(nextProps)
		);

		if (Array.isArray(nextProps.suggestions) && this.state.currentValue.trim().length) {
			checkPropChange(
				this.props.suggestions,
				nextProps.suggestions,
				() => {
					this.setState({
						suggestions: this.onSuggestions(nextProps.suggestions)
					});
				}
			);
		}

		checkSomePropChange(
			this.props,
			nextProps,
			["fieldWeights", "fuzziness", "queryFormat"],
			() => {
				this.updateQuery(nextProps.componentId, this.state.currentValue, nextProps)
			}
		);

		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.setValue(nextProps.defaultSelected, true, nextProps);
		} else if (
			this.props.selectedValue !== nextProps.selectedValue &&
			this.state.currentValue !== nextProps.selectedValue
		) {
			// check for selected value prop change or selectedValue will never match currentValue
			this.setValue(nextProps.selectedValue || "", true, nextProps);
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
		this.props.removeComponent(this.internalComponent);
	}

	setReact = (props) => {
		const { react } = props;
		if (react) {
			const newReact = pushToAndClause(react, this.internalComponent);
			props.watchComponent(props.componentId, newReact);
		} else {
			props.watchComponent(props.componentId, { and: this.internalComponent });
		}
	};

	highlightQuery = (props) => {
		if (!props.highlight) {
			return null;
		}
		const fields = {};
		const highlightField = props.highlightField ? props.highlightField : props.dataField;

		if (typeof highlightField === "string") {
			fields[highlightField] = {};
		} else if (Array.isArray(highlightField)) {
			highlightField.forEach((item) => {
				fields[item] = {};
			});
		}

		return {
			highlight: {
				pre_tags: ["<mark>"],
				post_tags: ["</mark>"],
				fields
			}
		};
	};

	defaultQuery = (value, props) => {
		let finalQuery = null,
			fields;
		if (value) {
			if (Array.isArray(props.dataField)) {
				fields = props.dataField;
			} else {
				fields = [props.dataField];
			}
			finalQuery = {
				bool: {
					should: this.shouldQuery(value, fields, props),
					minimum_should_match: "1"
				}
			};
		}

		if (value === "") {
			finalQuery = {
				"match_all": {}
			}
		}

		return finalQuery;
	};

	shouldQuery = (value, dataFields, props) => {
		const fields = dataFields.map(
			(field, index) => `${field}${(Array.isArray(props.fieldWeights) && props.fieldWeights[index]) ? ("^" + props.fieldWeights[index]) : ""}`
		);

		if (props.queryFormat === "and") {
			return [
				{
					multi_match: {
						query: value,
						fields,
						type: "cross_fields",
						operator: "and",
						fuzziness: props.fuzziness ? props.fuzziness : 0
					}
				},
				{
					multi_match: {
						query: value,
						fields,
						type: "phrase_prefix",
						operator: "and"
					}
				}
			];
		}

		return [
			{
				multi_match: {
					query: value,
					fields,
					type: "best_fields",
					operator: "or",
					fuzziness: props.fuzziness ? props.fuzziness : 0
				}
			},
			{
				multi_match: {
					query: value,
					fields,
					type: "phrase_prefix",
					operator: "or"
				}
			}
		];
	};

	onSuggestions = (suggestions) => {
		if (this.props.onSuggestion) {
			return suggestions.map(suggestion => this.props.onSuggestion(suggestion));
		}

		const fields = Array.isArray(this.props.dataField) ? this.props.dataField : [this.props.dataField];

		return getSuggestions(
			fields,
			suggestions,
			this.state.currentValue.toLowerCase()
		);
	};

	setValue = (value, isDefaultValue = false, props = this.props) => {
		const performUpdate = () => {
			this.setState({
				currentValue: value
			});
			if (isDefaultValue) {
				if (this.props.autoSuggest) {
					this.setState({
						isOpen: false
					});
					this.updateQuery(this.internalComponent, value, props);
				}
				this.updateQuery(props.componentId, value, props);
			} else {
				// debounce for handling text while typing
				this.handleTextChange(value);
			}
		}
		checkValueChange(
			props.componentId,
			value,
			props.beforeValueChange,
			props.onValueChange,
			performUpdate
		);
	};

	handleTextChange = debounce((value) => {
		if (this.props.autoSuggest) {
			this.updateQuery(this.internalComponent, value, this.props);
		} else {
			this.updateQuery(this.props.componentId, value, this.props);
		}
	}, 300);

	updateQuery = (componentId, value, props) => {
		const query = props.customQuery || this.defaultQuery;
		let onQueryChange = null;
		if (componentId === props.componentId && props.onQueryChange) {
			onQueryChange = props.onQueryChange;
		}
		props.updateQuery({
			componentId,
			query: query(value, props),
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			onQueryChange,
			URLParams: props.URLParams
		});
	};

	handleFocus = (event) => {
		this.setState({
			isOpen: true
		});
		if (this.props.onFocus) {
			this.props.onFocus(event);
		}
	};

	// only works if there's a change in downshift's value
	handleOuterClick = () => {
		this.setValue(this.state.currentValue, true)
	};

	handleKeyDown = (event) => {
		if (event.key === "Enter") {
			event.target.blur();
			this.setValue(event.target.value, true);
		}
		if (this.props.onKeyDown) {
			this.props.onKeyDown(event);
		}
	};

	onInputChange = (e) => {
		this.setState({
			suggestions: []
		});
		this.setValue(e.target.value);
	};

	onSuggestionSelected = (suggestion, event) => {
		this.setValue(suggestion.value, true);
		if (this.props.onBlur) {
			this.props.onBlur(event);
		}
	};

	handleStateChange = (changes) => {
		const { isOpen, type } = changes;
		if (type === Downshift.stateChangeTypes.mouseUp) {
			this.setState({
				isOpen
			});
		}
	};

	renderIcon = () => {
		if (this.props.showIcon) {
			return this.props.icon || <SearchSvg />;
		}
		return null;
	}

	render() {
		const suggestionsList = this.state.currentValue === "" || this.state.currentValue === null
			? this.props.defaultSuggestions && this.props.defaultSuggestions.length
				? this.props.defaultSuggestions
				: []
			: this.state.suggestions;

		return (
			<div style={this.props.style} className={this.props.className}>
				{this.props.title && <Title className={getClassName(this.props.innerClass, "title") || null}>{this.props.title}</Title>}
				{
					this.props.autoSuggest
						? (<Downshift
							onChange={this.onSuggestionSelected}
							onOuterClick={this.handleOuterClick}
							onStateChange={this.handleStateChange}
							isOpen={this.state.isOpen}
							itemToString={i => i}
							render={({
								getInputProps,
								getItemProps,
								isOpen,
								highlightedIndex
							}) => (
								<div className={suggestionsContainer}>
									<Flex showBorder={this.props.showIcon} iconPosition={this.props.iconPosition}>
										<Input showIcon={this.props.showIcon} {...getInputProps({
											className: getClassName(this.props.innerClass, "input"),
											placeholder: this.props.placeholder,
											value: this.state.currentValue === null ? "" : this.state.currentValue,
											onChange: this.onInputChange,
											onBlur: this.props.onBlur,
											onFocus: this.handleFocus,
											onKeyPress: this.props.onKeyPress,
											onKeyDown: this.handleKeyDown,
											onKeyUp: this.props.onKeyUp
										})} />
										{this.renderIcon()}
									</Flex>
									{
										isOpen && suggestionsList.length
											? (<div className={suggestions}>
												<ul className={getClassName(this.props.innerClass, "list") || null}>
													{
														suggestionsList
															.map((item, index) => (
																<li
																	{...getItemProps({ item })}
																	key={item.label}
																	style={{
																		backgroundColor: highlightedIndex === index ? "#eee" : "#fff"
																	}}
																>
																	{item.label}
																</li>
															))
													}
												</ul>
											</div>)
											: null
									}
								</div>
							)}
						/>)
						: (
							<Flex showBorder={this.props.showIcon} iconPosition={this.props.iconPosition}>
								<Input
									className={getClassName(this.props.innerClass, "input") || null}
									placeholder={this.props.placeholder}
									value={this.state.currentValue ? this.state.currentValue : ""}
									onChange={this.onInputChange}
									onBlur={this.props.onBlur}
									onFocus={this.props.onFocus}
									onKeyPress={this.props.onKeyPress}
									onKeyDown={this.props.onKeyDown}
									onKeyUp={this.props.onKeyUp}
									autoFocus={this.props.autoFocus}
									showIcon={this.props.showIcon}
								/>
								{this.renderIcon()}
							</Flex>
						)
				}
			</div>
		);
	}
}

DataSearch.propTypes = {
	componentId: types.stringRequired,
	title: types.title,
	addComponent: types.funcRequired,
	highlight: types.bool,
	setQueryOptions: types.funcRequired,
	defaultSelected: types.string,
	dataField: types.dataFieldArray,
	highlightField: types.highlightField,
	react: types.react,
	suggestions: types.suggestions,
	defaultSuggestions: types.suggestions,
	removeComponent: types.funcRequired,
	fieldWeights: types.fieldWeights,
	queryFormat: types.queryFormatSearch,
	fuzziness: types.fuzziness,
	autoSuggest: types.bool,
	beforeValueChange: types.func,
	onValueChange: types.func,
	customQuery: types.func,
	onQueryChange: types.func,
	onSuggestion: types.func,
	updateQuery: types.funcRequired,
	placeholder: types.string,
	onBlur: types.func,
	onFocus: types.func,
	onKeyPress: types.func,
	onKeyDown: types.func,
	onKeyUp: types.func,
	autoFocus: types.bool,
	selectedValue: types.selectedValue,
	URLParams: types.boolRequired,
	showFilter: types.bool,
	filterLabel: types.string,
	style: types.style,
	className: types.string,
	innerClass: types.style,
	showIcon: types.bool,
	iconPosition: types.iconPosition,
	icon: types.children
}

DataSearch.defaultProps = {
	placeholder: "Search",
	autoSuggest: true,
	queryFormat: "or",
	URLParams: false,
	showFilter: true,
	style: {},
	className: null,
	showIcon: true,
	iconPosition: "right"
}

const mapStateToProps = (state, props) => ({
	suggestions: state.hits[props.componentId] && state.hits[props.componentId].hits,
	selectedValue: state.selectedValues[props.componentId] && state.selectedValues[props.componentId].value || null
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: updateQueryObject => dispatch(
		updateQuery(updateQueryObject)
	),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props))
});

export default connect(mapStateToProps, mapDispatchtoProps)(DataSearch);
