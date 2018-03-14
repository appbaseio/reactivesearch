import React, { Component } from 'react';
import Downshift from 'downshift';
import { withTheme } from 'emotion-theming';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
} from '@appbaseio/reactivecore/lib/actions';
import {
	debounce,
	pushToAndClause,
	checkValueChange,
	checkPropChange,
	checkSomePropChange,
	getClassName,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';
import getSuggestions from '@appbaseio/reactivecore/lib/utils/suggestions';
import Title from '../../styles/Title';
import Input, { suggestionsContainer, suggestions } from '../../styles/Input';
import SearchSvg from '../shared/SearchSvg';
import InputIcon from '../../styles/InputIcon';
import Container from '../../styles/Container';
import { connect } from '../../utils';

const Text = withTheme(props => (
	<span
		className="trim"
		style={{
			color: props.primary ? props.theme.colors.primaryColor : props.theme.colors.textColor,
		}}
	>
		{props.children}
	</span>
));

class CategorySearch extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: '',
			suggestions: [],
			isOpen: false,
		};
		this.internalComponent = `${props.componentId}__internal`;
		this.locked = false;
	}

	componentWillMount() {
		this.props.addComponent(this.props.componentId);
		this.props.addComponent(this.internalComponent);

		if (this.props.highlight) {
			const queryOptions = this.highlightQuery(this.props);
			queryOptions.size = 20;
			this.props.setQueryOptions(this.props.componentId, queryOptions);
		} else {
			this.props.setQueryOptions(this.props.componentId, {
				size: 20,
			});
		}
		this.setReact(this.props);

		const aggsQuery = this.getAggsQuery(this.props.categoryField);
		this.props.setQueryOptions(this.internalComponent, aggsQuery, false);

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
			['highlight', 'dataField', 'highlightField'],
			() => {
				const queryOptions = this.highlightQuery(nextProps);
				queryOptions.size = 20;
				this.props.setQueryOptions(nextProps.componentId, queryOptions);
			},
		);

		checkPropChange(this.props.react, nextProps.react, () =>
			this.setReact(nextProps));

		if (
			Array.isArray(nextProps.suggestions)
			&& this.state.currentValue.trim().length
		) {
			// shallow check allows us to set suggestions even if the next set
			// of suggestions are same as the current one
			if (this.props.suggestions !== nextProps.suggestions) {
				this.setState({
					suggestions: this.onSuggestions(nextProps.suggestions),
				});
			}
		}

		checkSomePropChange(
			this.props,
			nextProps,
			['fieldWeights', 'fuzziness', 'queryFormat', 'dataField', 'categoryField'],
			() => {
				this.updateQuery(
					nextProps.componentId,
					this.state.currentValue,
					nextProps,
				);
			},
		);

		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.setValue(nextProps.defaultSelected, true, nextProps);
		} else if (
			// since, selectedValue will be updated when currentValue changes,
			// we must only check for the changes introduced by
			// clear action from SelectedFilters component in which case,
			// the currentValue will never match the updated selectedValue
			this.props.selectedValue !== nextProps.selectedValue
			&& this.state.currentValue !== nextProps.selectedValue
		) {
			this.setValue(nextProps.selectedValue || '', true, nextProps);
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
		this.props.removeComponent(this.internalComponent);
	}

	getAggsQuery = field => ({
		aggs: {
			[field]: {
				terms: {
					field,
				},
			},
		},
	});

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
		if (props.customHighlight) {
			return props.customHighlight(props);
		}
		if (!props.highlight) {
			return null;
		}
		const fields = {};
		const highlightField = props.highlightField
			? props.highlightField
			: props.dataField;

		if (typeof highlightField === 'string') {
			fields[highlightField] = {};
		} else if (Array.isArray(highlightField)) {
			highlightField.forEach((item) => {
				fields[item] = {};
			});
		}

		return {
			highlight: {
				pre_tags: ['<mark>'],
				post_tags: ['</mark>'],
				fields,
			},
		};
	};

	defaultQuery = (value, category, props) => {
		let finalQuery = null;
		let fields;

		if (value) {
			if (Array.isArray(props.dataField)) {
				fields = props.dataField;
			} else {
				fields = [props.dataField];
			}
			finalQuery = {
				bool: {
					should: this.shouldQuery(value, fields, props),
					minimum_should_match: '1',
				},
			};

			if (category && category !== '*') {
				finalQuery = [
					finalQuery,
					{
						term: {
							[props.categoryField]: category,
						},
					},
				];
			}
		}

		if (value === '') {
			finalQuery = {
				match_all: {},
			};
		}

		return finalQuery;
	};

	shouldQuery = (value, dataFields, props) => {
		const fields = dataFields.map((field, index) =>
			`${field}${
				Array.isArray(props.fieldWeights) && props.fieldWeights[index]
					? `^${props.fieldWeights[index]}`
					: ''
			}`);

		if (props.queryFormat === 'and') {
			return [
				{
					multi_match: {
						query: value,
						fields,
						type: 'cross_fields',
						operator: 'and',
					},
				},
				{
					multi_match: {
						query: value,
						fields,
						type: 'phrase_prefix',
						operator: 'and',
					},
				},
			];
		}

		return [
			{
				multi_match: {
					query: value,
					fields,
					type: 'best_fields',
					operator: 'or',
					fuzziness: props.fuzziness ? props.fuzziness : 0,
				},
			},
			{
				multi_match: {
					query: value,
					fields,
					type: 'phrase_prefix',
					operator: 'or',
				},
			},
		];
	};

	onSuggestions = (searchSuggestions) => {
		if (this.props.onSuggestion) {
			return this.props.onSuggestion(searchSuggestions);
		}

		const fields = Array.isArray(this.props.dataField)
			? this.props.dataField
			: [this.props.dataField];

		return getSuggestions(
			fields,
			searchSuggestions,
			this.state.currentValue.toLowerCase(),
		);
	};

	setValue = (value, isDefaultValue = false, props = this.props, category) => {
		// ignore state updates when component is locked
		if (props.beforeValueChange && this.locked) {
			return;
		}

		this.locked = true;
		const performUpdate = () => {
			this.setState({
				currentValue: value,
			}, () => {
				if (isDefaultValue) {
					if (this.props.autosuggest) {
						this.setState({
							isOpen: false,
						});
						this.updateQuery(this.internalComponent, value, props);
					}
					this.updateQuery(props.componentId, value, props, category);
				} else {
					// debounce for handling text while typing
					this.handleTextChange(value);
				}
				this.locked = false;
			});
		};
		checkValueChange(
			props.componentId,
			value,
			props.beforeValueChange,
			props.onValueChange,
			performUpdate,
		);
	};

	handleTextChange = debounce((value) => {
		if (this.props.autosuggest) {
			this.updateQuery(this.internalComponent, value, this.props);
		} else {
			this.updateQuery(this.props.componentId, value, this.props);
		}
	}, this.props.debounce);

	updateQuery = (componentId, value, props, category) => {
		const query = props.customQuery || this.defaultQuery;
		let onQueryChange = null;
		if (componentId === props.componentId && props.onQueryChange) {
			onQueryChange = props.onQueryChange;
		}
		props.updateQuery({
			componentId,
			query: query(value, category, props),
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			onQueryChange,
			URLParams: props.URLParams,
		});
	};

	handleFocus = (event) => {
		this.setState({
			isOpen: true,
		});
		if (this.props.onFocus) {
			this.props.onFocus(event);
		}
	};

	// only works if there's a change in downshift's value
	handleOuterClick = () => {
		this.setValue(this.state.currentValue, true);
	};

	handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			event.target.blur();
			this.setValue(event.target.value, true);
		}
		if (this.props.onKeyDown) {
			this.props.onKeyDown(event);
		}
	};

	onInputChange = (e) => {
		const { value } = e.target;
		if (value.trim() !== this.state.currentValue.trim()) {
			this.setState({
				suggestions: [],
			}, () => {
				this.setValue(value);
			});
		} else {
			this.setValue(value);
		}
	};

	onSuggestionSelected = (suggestion, event) => {
		this.setValue(suggestion.value, true, this.props, suggestion.category);
		if (this.props.onBlur) {
			this.props.onBlur(event);
		}
	};

	handleStateChange = (changes) => {
		const { isOpen, type } = changes;
		if (type === Downshift.stateChangeTypes.mouseUp) {
			this.setState({
				isOpen,
			});
		}
	};

	getBackgroundColor = (highlightedIndex, index) => {
		const isDark = this.props.themePreset === 'dark';
		if (isDark) {
			return highlightedIndex === index
				? '#555' : '#424242';
		}
		return highlightedIndex === index
			? '#eee' : '#fff';
	};

	renderIcon = () => {
		if (this.props.showIcon) {
			return this.props.icon || <SearchSvg />;
		}
		return null;
	};

	render() {
		let suggestionsList = [];
		const { theme, themePreset } = this.props;

		if (
			!this.state.currentValue
			&& this.props.defaultSuggestions
			&& this.props.defaultSuggestions.length
		) {
			suggestionsList = this.props.defaultSuggestions;
		} else if (this.state.currentValue) {
			suggestionsList = this.state.suggestions;
		}

		if (
			this.state.currentValue
			&& this.state.suggestions.length
			&& this.props.categories
			&& this.props.categories.length
		) {
			let categorySuggestions = [
				{
					label: `${this.state.currentValue} in all categories`,
					value: this.state.currentValue,
					category: '*',
				},
				{
					label: `${this.state.currentValue} in ${
						this.props.categories[0].key
					}`,
					value: this.state.currentValue,
					category: this.props.categories[0].key,
				},
			];

			if (this.props.categories.length > 1) {
				categorySuggestions = [
					...categorySuggestions,
					{
						label: `${this.state.currentValue} in ${
							this.props.categories[1].key
						}`,
						value: this.state.currentValue,
						category: this.props.categories[1].key,
					},
				];
			}
			suggestionsList = [...categorySuggestions, ...suggestionsList];
		}

		return (
			<Container style={this.props.style} className={this.props.className}>
				{this.props.title && (
					<Title
						className={getClassName(this.props.innerClass, 'title') || null}
					>
						{this.props.title}
					</Title>
				)}
				{this.props.autosuggest ? (
					<Downshift
						onChange={this.onSuggestionSelected}
						onOuterClick={this.handleOuterClick}
						onStateChange={this.handleStateChange}
						isOpen={this.state.isOpen}
						itemToString={i => i}
						render={({
							getInputProps,
							getItemProps,
							isOpen,
							highlightedIndex,
						}) => (
							<div className={suggestionsContainer}>
								<Input
									showIcon={this.props.showIcon}
									iconPosition={this.props.iconPosition}
									innerRef={this.props.innerRef}
									{...getInputProps({
										className: getClassName(this.props.innerClass, 'input'),
										placeholder: this.props.placeholder,
										value:
											this.state.currentValue === null
												? ''
												: this.state.currentValue,
										onChange: this.onInputChange,
										onBlur: this.props.onBlur,
										onFocus: this.handleFocus,
										onKeyPress: this.props.onKeyPress,
										onKeyDown: this.handleKeyDown,
										onKeyUp: this.props.onKeyUp,
									})}
									themePreset={themePreset}
								/>
								<InputIcon iconPosition={this.props.iconPosition}>
									{this.renderIcon()}
								</InputIcon>
								{isOpen && suggestionsList.length ? (
									<ul
										className={`${suggestions(themePreset, theme)} ${getClassName(this.props.innerClass, 'list')}`}
									>
										{suggestionsList.slice(0, 10).map((item, index) => (
											<li
												{...getItemProps({ item })}
												key={item.label}
												style={{
													backgroundColor: this.getBackgroundColor(
														highlightedIndex,
														index,
													),
												}}
											>
												<Text primary={!!item.category}>{item.label}</Text>
											</li>
										))}
									</ul>
								) : null}
							</div>
						)}
					/>
				) : (
					<div className={suggestionsContainer}>
						<Input
							className={getClassName(this.props.innerClass, 'input')}
							placeholder={this.props.placeholder}
							value={this.state.currentValue ? this.state.currentValue : ''}
							onChange={this.onInputChange}
							onBlur={this.props.onBlur}
							onFocus={this.props.onFocus}
							onKeyPress={this.props.onKeyPress}
							onKeyDown={this.props.onKeyDown}
							onKeyUp={this.props.onKeyUp}
							autoFocus={this.props.autoFocus}
							iconPosition={this.props.iconPosition}
							showIcon={this.props.showIcon}
							innerRef={this.props.innerRef}
							themePreset={themePreset}
						/>
						<InputIcon iconPosition={this.props.iconPosition}>
							{this.renderIcon()}
						</InputIcon>
					</div>
				)}
			</Container>
		);
	}
}

CategorySearch.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	options: types.options,
	categories: types.data,
	selectedValue: types.selectedValue,
	suggestions: types.suggestions,
	// component props
	autoFocus: types.bool,
	autosuggest: types.bool,
	beforeValueChange: types.func,
	categoryField: types.string,
	className: types.string,
	componentId: types.stringRequired,
	customHighlight: types.func,
	customQuery: types.func,
	dataField: types.dataFieldArray,
	debounce: types.number,
	defaultSelected: types.string,
	defaultSuggestions: types.suggestions,
	fieldWeights: types.fieldWeights,
	filterLabel: types.string,
	fuzziness: types.fuzziness,
	highlight: types.bool,
	highlightField: types.stringOrArray,
	icon: types.children,
	iconPosition: types.iconPosition,
	innerClass: types.style,
	innerRef: types.func,
	onBlur: types.func,
	onFocus: types.func,
	onKeyDown: types.func,
	onKeyPress: types.func,
	onKeyUp: types.func,
	onQueryChange: types.func,
	onSuggestion: types.func,
	onValueChange: types.func,
	placeholder: types.string,
	queryFormat: types.queryFormatSearch,
	react: types.react,
	showFilter: types.bool,
	showIcon: types.bool,
	style: types.style,
	title: types.title,
	theme: types.style,
	themePreset: types.themePreset,
	URLParams: types.boolRequired,
};

CategorySearch.defaultProps = {
	autosuggest: true,
	className: null,
	debounce: 0,
	iconPosition: 'left',
	placeholder: 'Search',
	queryFormat: 'or',
	showFilter: true,
	showIcon: true,
	style: {},
	URLParams: false,
};

const mapStateToProps = (state, props) => ({
	categories: (
		state.aggregations[props.componentId]
		&& state.aggregations[props.componentId][props.categoryField]
		&& state.aggregations[props.componentId][props.categoryField].buckets
	) || [],
	selectedValue:
	(state.selectedValues[props.componentId]
		&& state.selectedValues[props.componentId].value)
		|| null,
	suggestions:
			(state.hits[props.componentId] && state.hits[props.componentId].hits) || [],
	themePreset: state.config.themePreset,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
});

export default connect(
	mapStateToProps,
	mapDispatchtoProps,
)(withTheme(CategorySearch));
