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
	isEqual,
	debounce,
	pushToAndClause,
	checkValueChange,
	checkPropChange,
	checkSomePropChange
} from "@appbaseio/reactivecore/lib/utils/helper";

import types from "@appbaseio/reactivecore/lib/utils/types";
import Title from "../../styles/Title";
import Input, { input, suggestions } from "../../styles/Input";

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

	componentDidMount() {
		this.props.addComponent(this.props.componentId);
		this.props.addComponent(this.internalComponent);

		if (this.props.highlight) {
			const queryOptions = this.highlightQuery(this.props);
			this.props.setQueryOptions(this.props.componentId, queryOptions);
		}
		this.setReact(this.props);

		if (this.props.defaultSelected) {
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

		checkPropChange(
			this.props.defaultSelected,
			nextProps.defaultSelected,
			() => this.setValue(nextProps.defaultSelected, true, nextProps)
		);
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
	}

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
	}

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
		if (this.props.onSuggestions) {
			return this.props.onSuggestions(suggestions);
		}

		const fields = Array.isArray(this.props.dataField) ? this.props.dataField : [this.props.dataField];
		let suggestionsList = [];
		let labelsList = [];
		const currentValue = this.state.currentValue.toLowerCase();

		suggestions.forEach(item => {
			fields.forEach(field => {
				const label = item._source[field];
				const val = label.toLowerCase();

				if (val.includes(currentValue) && !labelsList.includes(val)) {
					const option = {
						label,
						value: label
					};
					labelsList = [...labelsList, val];
					suggestionsList = [...suggestionsList, option];
				}
			});
		});

		return suggestionsList;
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

	updateQuery = (component, value, props) => {
		const query = props.customQuery || this.defaultQuery;
		let callback = null;
		if (component === props.componentId && props.onQueryChange) {
			callback = props.onQueryChange;
		}
		props.updateQuery(component, query(value, props), value, props.filterLabel, callback);
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

	// delays the hiding of suggestions on click to allow suggestion selection
	handleBlur = (event) => {
		setTimeout(() => {
			this.setState({
				isOpen: false
			});
		}, 200);
		if (this.props.onBlur) {
			this.props.onBlur(event);
		}
	};

	handleKeyDown = (event) => {
		if (event.key === "Enter") {
			event.target.blur();
			this.handleBlur();
			this.setValue(event.target.value, true);
		}
		if (this.props.onKeyDown) {
			this.props.onKeyDown(event);
		}
	};

	onInputChange = (e, v) => {
		this.setValue(e.target.value);
	};

	onSuggestionSelected = (suggestion, event) => {
		this.setValue(suggestion.value, true);
		if (this.props.onBlur) {
			this.props.onBlur(event);
		}
	};

	render() {
		const suggestionsList = this.state.currentValue === "" || this.state.currentValue === null
			? this.props.defaultSuggestions && this.props.defaultSuggestions.length
				? this.props.defaultSuggestions
				: []
			: this.state.suggestions;

		return (
			<div>
				{
					this.props.title
						? (<Title>{this.props.title}</Title>)
						: null
				}
				{
					this.props.autoSuggest
						? (<Downshift
							onChange={this.onSuggestionSelected}
							onOuterClick={this.handleOuterClick}
							render={({
								getInputProps,
								getItemProps,
								isOpen,
								inputValue,
								selectedItem,
								highlightedIndex
							}) => (
								<div>
									<Input {...getInputProps({
										placeholder: this.props.placeholder,
										value: this.state.currentValue === null ? "" : this.state.currentValue,
										onChange: this.onInputChange,
										onBlur: this.handleBlur,
										onFocus: this.handleFocus,
										onKeyPress: this.props.onKeyPress,
										onKeyDown: this.handleKeyDown,
										onKeyUp: this.props.onKeyUp
									})} />
									{
										this.state.isOpen && suggestionsList.length
											? (<div className={suggestions}>
												<ul>
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
						: (<Input
							placeholder={this.props.placeholder}
							value={this.state.currentValue ? this.state.currentValue : ""}
							onChange={(e) => this.setValue(e.target.value)}
							onBlur={this.props.onBlur}
							onFocus={this.props.onFocus}
							onKeyPress={this.props.onKeyPress}
							onKeyDown={this.props.onKeyDown}
							onKeyUp={this.props.onKeyUp}
							autoFocus={this.props.autoFocus}
						/>)
				}
			</div>
		);
	}
}

DataSearch.propTypes = {
	componentId: types.componentId,
	title: types.title,
	addComponent: types.addComponent,
	highlight: types.highlight,
	setQueryOptions: types.setQueryOptions,
	defaultSelected: types.string,
	dataField: types.dataFieldArray,
	highlightField: types.highlightField,
	react: types.react,
	suggestions: types.suggestions,
	defaultSuggestions: types.suggestions,
	removeComponent: types.removeComponent,
	fieldWeights: types.fieldWeights,
	queryFormat: types.queryFormatSearch,
	fuzziness: types.fuzziness,
	autoSuggest: types.autoSuggest,
	beforeValueChange: types.beforeValueChange,
	onValueChange: types.beforeValueChange,
	customQuery: types.customQuery,
	onQueryChange: types.onQueryChange,
	onSuggestions: types.onSuggestions,
	updateQuery: types.updateQuery,
	placeholder: types.placeholder,
	onBlur: types.onBlur,
	onFocus: types.onFocus,
	onKeyPress: types.onKeyPress,
	onKeyDown: types.onKeyDown,
	onKeyUp: types.onKeyUp,
	autoFocus: types.autoFocus
}

DataSearch.defaultProps = {
	placeholder: "Search",
	autoSuggest: true,
	queryFormat: "or"
}

const mapStateToProps = (state, props) => ({
	suggestions: state.hits[props.componentId] && state.hits[props.componentId].hits
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: (component, query, value, filterLabel, onQueryChange) => dispatch(
		updateQuery(component, query, value, filterLabel, onQueryChange)
	),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props))
});

export default connect(mapStateToProps, mapDispatchtoProps)(DataSearch);
