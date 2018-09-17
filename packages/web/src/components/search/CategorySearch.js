import React, { Component } from 'react';
import Downshift from 'downshift';
import { withTheme } from 'emotion-theming';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
	setQueryListener,
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
import causes from '@appbaseio/reactivecore/lib/utils/causes';
import Title from '../../styles/Title';
import Input, { suggestionsContainer, suggestions } from '../../styles/Input';
import CancelSvg from '../shared/CancelSvg';
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
		props.setQueryListener(props.componentId, props.onQueryChange, null);
	}

	componentWillMount() {
		this.props.addComponent(this.props.componentId, 'CATEGORYSEARCH');
		this.props.addComponent(this.internalComponent);

		if (this.props.highlight) {
			const queryOptions = CategorySearch.highlightQuery(this.props) || {};
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
				const queryOptions = CategorySearch.highlightQuery(nextProps) || {};
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

	static highlightQuery = (props) => {
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

	static defaultQuery = (value, props, category) => {
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
					should: CategorySearch.shouldQuery(value, fields, props),
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

	static shouldQuery = (value, dataFields, props) => {
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
			return searchSuggestions.map(suggestion => this.props.onSuggestion(suggestion));
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

	setValue = (value, isDefaultValue = false, props = this.props, category, cause) => {
		// ignore state updates when component is locked
		if (props.beforeValueChange && this.locked) {
			return;
		}

		this.locked = true;
		const performUpdate = () => {
			this.setState({
				currentValue: value,
				suggestions: [],
			}, () => {
				if (isDefaultValue) {
					if (this.props.autosuggest) {
						this.setState({
							isOpen: false,
						});
						this.updateQuery(this.internalComponent, value, props);
					}
					// in case of strict selection only SUGGESTION_SELECT should be able
					// to set the query otherwise the value should reset
					if (props.strictSelection) {
						if (cause === causes.SUGGESTION_SELECT || value === '') {
							this.updateQuery(props.componentId, value, props, category);
						} else {
							this.setValue('', true);
						}
					} else {
						this.updateQuery(props.componentId, value, props, category);
					}
				} else {
					// debounce for handling text while typing
					this.handleTextChange(value);
				}
				this.locked = false;
				if (props.onValueChange) props.onValueChange(value);
			});
		};
		checkValueChange(
			props.componentId,
			value,
			props.beforeValueChange,
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
		const {
			customQuery,
			defaultQuery,
			filterLabel,
			showFilter,
			URLParams,
		} = props;

		// defaultQuery from props is always appended regardless of a customQuery
		const query = customQuery || CategorySearch.defaultQuery;
		const queryObject = defaultQuery
			? {
				bool: {
					must: [
						...query(value, props, category),
						...defaultQuery(value, props, category),
					],
				},
			}
			: query(value, props, category);
		props.updateQuery({
			componentId,
			query: queryObject,
			value,
			label: filterLabel,
			showFilter,
			URLParams,
			componentType: 'CATEGORYSEARCH',
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

	clearValue = () => {
		this.setValue('', true);
		this.onValueSelected(null, causes.CLEAR_VALUE);
	};

	handleKeyDown = (event, highlightedIndex) => {
		// if a suggestion was selected, delegate the handling to suggestion handler
		if (event.key === 'Enter' && highlightedIndex === null) {
			this.setValue(event.target.value, true);
			this.onValueSelected(event.target.value, causes.ENTER_PRESS);
		}
		if (this.props.onKeyDown) {
			this.props.onKeyDown(event);
		}
	};

	onInputChange = (e) => {
		const { value } = e.target;
		if (!this.state.isOpen) {
			this.setState({
				isOpen: true,
			});
		}
		this.setValue(value);
	};

	onSuggestionSelected = (suggestion) => {
		this.setValue(
			suggestion.value,
			true,
			this.props,
			suggestion.category,
			causes.SUGGESTION_SELECT,
		);
		this.onValueSelected(
			suggestion.value,
			suggestion.category,
			causes.SUGGESTION_SELECT,
			suggestion.source,
		);
	};

	onValueSelected = (currentValue = this.state.currentValue, category = null, ...cause) => {
		const { onValueSelected } = this.props;
		if (onValueSelected) {
			onValueSelected(currentValue, category, ...cause);
		}
	}

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

	renderCancelIcon = () => {
		if (this.props.showClear) {
			return this.props.clearIcon || <CancelSvg />;
		}
		return null;
	}

	renderIcons = () => (
		<div>
			{
				this.state.currentValue && this.props.showClear
				&& (
					<InputIcon
						onClick={this.clearValue}
						iconPosition="right"
						clearIcon={this.props.iconPosition === 'right'}
					>
						{this.renderCancelIcon()}
					</InputIcon>
				)
			}
			<InputIcon iconPosition={this.props.iconPosition}>{this.renderIcon()}</InputIcon>
		</div>
	);

	render() {
		let suggestionsList = [];
		let finalSuggestionsList = [];
		const {
			theme,
			themePreset,
			renderSuggestions,
			categories,	// defaults to empty array
		} = this.props;
		const filteredCategories = categories
			.filter(category => Boolean(category.key));	// filter out empty categories

		if (
			!this.state.currentValue
			&& this.props.defaultSuggestions
			&& this.props.defaultSuggestions.length
		) {
			finalSuggestionsList = this.props.defaultSuggestions;
		} else if (this.state.currentValue) {
			suggestionsList = this.state.suggestions;
		}

		if (
			this.state.currentValue
			&& this.state.suggestions.length
			&& filteredCategories.length
		) {
			let categorySuggestions = [
				{
					label: `${this.state.currentValue} in all categories`,
					value: this.state.currentValue,
					category: '*',
					// no source object exists for category based suggestions
					source: null,
				},
				{
					label: `${this.state.currentValue} in ${
						filteredCategories[0].key
					}`,
					value: this.state.currentValue,
					category: filteredCategories[0].key,
					source: null,
				},
			];

			if (filteredCategories.length > 1) {
				categorySuggestions = [
					...categorySuggestions,
					{
						label: `${this.state.currentValue} in ${
							filteredCategories[1].key
						}`,
						value: this.state.currentValue,
						category: filteredCategories[1].key,
						source: null,
					},
				];
			}
			finalSuggestionsList = [...categorySuggestions, ...suggestionsList];
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
				{this.props.defaultSuggestions || this.props.autosuggest ? (
					<Downshift
						id={`${this.props.componentId}-downshift`}
						onChange={this.onSuggestionSelected}
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
									showClear={this.props.showClear}
									id={`${this.props.componentId}-input`}
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
										onKeyDown: e => this.handleKeyDown(e, highlightedIndex),
										onKeyUp: this.props.onKeyUp,
									})}
									themePreset={themePreset}
								/>
								{this.renderIcons()}
								{renderSuggestions
									&& renderSuggestions({
										currentValue: this.state.currentValue,
										isOpen,
										getItemProps,
										highlightedIndex,
										suggestions: this.props.suggestions,
										categories: filteredCategories,
										parsedSuggestions: suggestionsList,
									})}
								{!renderSuggestions && isOpen && finalSuggestionsList.length ? (
									<ul
										className={`${suggestions(themePreset, theme)} ${getClassName(this.props.innerClass, 'list')}`}
									>
										{finalSuggestionsList.slice(0, 10).map((item, index) => (
											<li
												{...getItemProps({ item })}
												key={`${index + 1}-${item.value}`}
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
							showClear={this.props.showClear}
							showIcon={this.props.showIcon}
							innerRef={this.props.innerRef}
							themePreset={themePreset}
						/>
						{this.renderIcons()}
					</div>
				)}
			</Container>
		);
	}
}

CategorySearch.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
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
	clearIcon: types.children,
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
	onValueSelected: types.func,
	placeholder: types.string,
	queryFormat: types.queryFormatSearch,
	react: types.react,
	showClear: types.bool,
	showFilter: types.bool,
	showIcon: types.bool,
	style: types.style,
	title: types.title,
	theme: types.style,
	themePreset: types.themePreset,
	URLParams: types.bool,
	strictSelection: types.bool,
};

CategorySearch.defaultProps = {
	autosuggest: true,
	className: null,
	debounce: 0,
	iconPosition: 'left',
	placeholder: 'Search',
	queryFormat: 'or',
	showClear: false,
	showFilter: true,
	showIcon: true,
	style: {},
	URLParams: false,
	strictSelection: false,
};

const mapStateToProps = (state, props) => ({
	categories: (
		state.aggregations[props.componentId]
		&& state.aggregations[props.componentId][props.categoryField]
		&& state.aggregations[props.componentId][props.categoryField].buckets
	) || [],
	selectedValue: (state.selectedValues[props.componentId]
		&& state.selectedValues[props.componentId].value) || null,
	suggestions: (state.hits[props.componentId] && state.hits[props.componentId].hits) || [],
	themePreset: state.config.themePreset,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: (component, name) => dispatch(addComponent(component, name)),
	removeComponent: component => dispatch(removeComponent(component)),
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
});

export default connect(
	mapStateToProps,
	mapDispatchtoProps,
)(withTheme(CategorySearch));
