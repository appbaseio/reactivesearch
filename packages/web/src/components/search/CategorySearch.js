import React, { Component } from 'react';
import Downshift from 'downshift';
import { withTheme } from 'emotion-theming';
import hoistNonReactStatics from 'hoist-non-react-statics';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
	setQueryListener,
	setComponentProps,
	updateComponentProps,
} from '@appbaseio/reactivecore/lib/actions';
import {
	debounce,
	pushToAndClause,
	checkValueChange,
	checkPropChange,
	checkSomePropChange,
	getOptionsFromQuery,
	getClassName,
	getSearchState,
	isEqual,
} from '@appbaseio/reactivecore/lib/utils/helper';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';

import types from '@appbaseio/reactivecore/lib/utils/types';
import getSuggestions from '@appbaseio/reactivecore/lib/utils/suggestions';
import causes from '@appbaseio/reactivecore/lib/utils/causes';
import Title from '../../styles/Title';
import Input, { suggestionsContainer, suggestions } from '../../styles/Input';
import CancelSvg from '../shared/CancelSvg';
import SearchSvg from '../shared/SearchSvg';
import InputIcon from '../../styles/InputIcon';
import Container from '../../styles/Container';
import Mic from './addons/Mic';
import {
	connect,
	isFunction, getComponent, hasCustomRenderer, isIdentical, getValidPropsKeys,
	ReactReduxContext,
	withClickIds,
	handleCaretPosition,
} from '../../utils';
import SuggestionItem from './addons/SuggestionItem';
import SuggestionWrapper from './addons/SuggestionWrapper';

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

		const value = props.value || props.defaultValue || {};
		// eslint-disable-next-line
		let { term: currentValue = '', category: currentCategory = null } = value;
		// add preference to selected-X value from URL/SSR
		currentValue = props.selectedValue || currentValue;
		currentCategory = props.selectedCategory || currentCategory;

		this.state = {
			currentValue,
			currentCategory,
			suggestions: [],
			isOpen: false,
		};
		/**
		 * To regulate the query execution based on the input handler,
		 * the component query will only get executed when it sets to `true`.
		 * */
		this.isPending = false;

		this.internalComponent = `${props.componentId}__internal`;
		this.locked = false;
		this.queryOptions = {
			size: 20,
		};

		props.addComponent(props.componentId);
		props.addComponent(this.internalComponent);
		props.setComponentProps(props.componentId, {
			...props,
			componentType: componentTypes.categorySearch,
		});
		props.setQueryListener(props.componentId, props.onQueryChange, null);

		if (props.highlight) {
			const queryOptions = CategorySearch.highlightQuery(props) || {};
			queryOptions.size = 20;
			this.queryOptions = queryOptions;
			props.setQueryOptions(props.componentId, queryOptions);
		} else {
			props.setQueryOptions(props.componentId, this.queryOptions);
		}

		this.setReact(props);

		const aggsQuery = this.getAggsQuery(props.categoryField);
		props.setQueryOptions(this.internalComponent, aggsQuery, false);
		const hasMounted = false;
		const cause = null;

		if (currentValue) {
			const calcValue = {
				term: currentValue,
				category: currentCategory,
			};
			if (props.onChange) {
				props.onChange(calcValue, () => this.triggerQuery(calcValue));
			}
			this.setValue(currentValue, true, props, currentCategory, cause, hasMounted);
		}
	}

	static contextType = ReactReduxContext;

	componentDidUpdate(prevProps) {
		checkSomePropChange(this.props, prevProps, getValidPropsKeys(this.props), () => {
			this.props.updateComponentProps(this.props.componentId, this.props);
		});
		checkSomePropChange(
			this.props,
			prevProps,
			['highlight', 'dataField', 'highlightField'],
			() => {
				const queryOptions = CategorySearch.highlightQuery(this.props) || {};
				queryOptions.size = 20;
				this.queryOptions = queryOptions;
				this.props.setQueryOptions(this.props.componentId, queryOptions);
			},
		);

		// Treat defaultQuery and customQuery as reactive props
		if (!isIdentical(this.props.defaultQuery, prevProps.defaultQuery)) {
			this.updateDefaultQuery(this.state.currentValue, this.props);
			this.updateQuery(this.state.currentValue, this.props);
		}

		if (!isIdentical(this.props.customQuery, prevProps.customQuery)) {
			this.updateQuery(this.state.currentValue, this.props);
		}

		checkPropChange(this.props.react, prevProps.react, () => this.setReact(this.props));

		if (Array.isArray(this.props.suggestions) && this.state.currentValue.trim().length) {
			// shallow check allows us to set suggestions even if the next set
			// of suggestions are same as the current one

			if (this.props.suggestions !== prevProps.suggestions) {
				if (this.props.onSuggestions) {
					this.props.onSuggestions(this.props.suggestions);
				}
				// eslint-disable-next-line
				this.setState({
					suggestions: this.onSuggestions(this.props.suggestions),
				});
			}
		}

		checkSomePropChange(
			this.props,
			prevProps,
			[
				'fieldWeights',
				'fuzziness',
				'queryFormat',
				'dataField',
				'categoryField',
				'nestedField',
				'searchOperators',
			],
			() => {
				this.updateQuery(this.state.currentValue, this.props);
			},
		);

		if (!isEqual(this.props.value, prevProps.value)) {
			const { term: currentValue, category: currentCategory = null } = this.props.value;
			this.setValue(currentValue, true, this.props, currentCategory);
		} else if (
			// since, selectedValue will be updated when currentValue changes,
			// we must only check for the changes introduced by
			// clear action from SelectedFilters component in which case,
			// the currentValue will never match the updated selectedValue
			this.props.selectedValue !== prevProps.selectedValue
			&& this.state.currentValue !== this.props.selectedValue
		) {
			const { value, onChange } = this.props;
			if (value === undefined) {
				this.setValue(
					this.props.selectedValue || '',
					true,
					this.props,
					this.props.selectedCategory,
				);
			} else if (onChange) {
				const currentValue = {
					term: this.props.selectedValue || '',
					category: this.props.selectedCategory || null,
				};
				// value prop exists
				onChange(currentValue, () => this.triggerQuery(currentValue));
			} else {
				// value prop exists and onChange is not defined:
				// we need to put the current value back into the store
				// if the clear action was triggered by interacting with
				// selected-filters component
				this.isPending = false;
				this.setValue(
					this.state.currentValue,
					true,
					this.props,
					this.state.currentCategory,
				);
			}
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
			props.watchComponent(props.componentId, {
				and: this.internalComponent,
			});
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
		const highlightField = props.highlightField ? props.highlightField : props.dataField;

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
				...props.highlightField && { require_field_match: false },
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
			if (props.searchOperators) {
				finalQuery = {
					simple_query_string: CategorySearch.shouldQuery(value, fields, props),
				};
			} else {
				finalQuery = {
					bool: {
						should: CategorySearch.shouldQuery(value, fields, props),
						minimum_should_match: '1',
					},
				};
			}

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
			finalQuery = null;
		}

		if (finalQuery && props.nestedField) {
			finalQuery = {
				nested: {
					path: props.nestedField,
					query: finalQuery,
				},
			};
		}

		return finalQuery;
	};

	static shouldQuery = (value, dataFields, props) => {
		const fields = dataFields.map(
			(field, index) =>
				`${field}${
					Array.isArray(props.fieldWeights) && props.fieldWeights[index]
						? `^${props.fieldWeights[index]}`
						: ''
				}`,
		);

		if (props.searchOperators) {
			return {
				query: value,
				fields,
				default_operator: props.queryFormat,
			};
		}

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
		const { parseSuggestion } = this.props;
		const fields = Array.isArray(this.props.dataField)
			? this.props.dataField
			: [this.props.dataField];

		const parsedSuggestions = getSuggestions(
			fields,
			searchSuggestions,
			this.state.currentValue.toLowerCase(),
		);
		if (parseSuggestion) {
			return parsedSuggestions.map(suggestion => parseSuggestion(suggestion));
		}
		return parsedSuggestions;
	};

	setValue = (
		value,
		isDefaultValue = false,
		props = this.props,
		category,
		cause,
		hasMounted = true,
	) => {
		// ignore state updates when component is locked
		if (props.beforeValueChange && this.locked) {
			return;
		}

		this.locked = true;
		const performUpdate = () => {
			if (hasMounted) {
				this.setState(
					{
						currentValue: value || '',
						currentCategory: category || null,
						suggestions: [],
					},
					() => {
						if (isDefaultValue) {
							if (this.props.autosuggest) {
								this.setState({
									isOpen: false,
								});
								this.updateDefaultQuery(value, props);
							}
							// in case of strict selection only SUGGESTION_SELECT should be able
							// to set the query otherwise the value should reset
							if (props.strictSelection) {
								if (cause === causes.SUGGESTION_SELECT || value === '') {
									this.updateQuery(value, props, category);
								} else {
									this.setValue('', true);
								}
							} else {
								this.updateQuery(value, props, category);
							}
						} else {
							// debounce for handling text while typing
							this.handleTextChange(value);
						}
						this.locked = false;
						if (props.onValueChange) props.onValueChange(value);
					},
				);
			} else {
				this.updateDefaultQuery(value, props);
				this.updateQuery(value, props, category);
				this.locked = false;
				if (props.onValueChange) props.onValueChange(value);
			}
		};
		checkValueChange(props.componentId, value, props.beforeValueChange, performUpdate);
	};

	handleTextChange = debounce((value) => {
		if (this.props.autosuggest) {
			this.updateDefaultQuery(value, this.props);
		} else {
			this.updateQuery(value, this.props);
		}
	}, this.props.debounce);

	updateDefaultQuery = (value, props, category = this.state.currentCategory) => {
		const { defaultQuery } = props;
		let defaultQueryOptions;
		let query = CategorySearch.defaultQuery(value, props, category);
		if (defaultQuery) {
			const defaultQueryTobeSet = defaultQuery(value, props, category) || {};
			if (defaultQueryTobeSet.query) {
				({ query } = defaultQueryTobeSet);
			}
			defaultQueryOptions = getOptionsFromQuery(defaultQueryTobeSet);
		}
		props.setQueryOptions(this.internalComponent, {
			...this.queryOptions,
			...this.getAggsQuery(props.categoryField), // default aggs query options
			...defaultQueryOptions,
		});
		props.updateQuery({
			componentId: this.internalComponent,
			query,
			value,
			category,
		});
	};

	updateQuery = (value, props, category = this.state.currentCategory) => {
		const {
			customQuery, filterLabel, showFilter, URLParams,
		} = props;

		let customQueryOptions;
		let query = CategorySearch.defaultQuery(value, props, category);
		if (customQuery) {
			const customQueryTobeSet = customQuery(value, props, category) || {};
			if (customQueryTobeSet.query) {
				({ query } = customQueryTobeSet);
			}
			customQueryOptions = getOptionsFromQuery(customQueryTobeSet);
		}

		// query options should be applied to the source component,
		// not on internal component, hence using `this.props.componentId` here
		props.setQueryOptions(props.componentId, {
			...this.queryOptions,
			...customQueryOptions,
		});
		if (!this.isPending) {
			props.updateQuery({
				componentId: props.componentId,
				query,
				value,
				label: filterLabel,
				showFilter,
				URLParams,
				componentType: componentTypes.categorySearch,
				category,
			});
		}
	};

	handleFocus = (event) => {
		this.setState({
			isOpen: true,
		});
		if (this.props.onFocus) {
			this.props.onFocus(event, this.triggerQuery);
		}
	};

	clearValue = () => {
		this.isPending = false;
		this.setValue('', true);
		this.onValueSelected(null, causes.CLEAR_VALUE, null);
	};

	handleKeyDown = (event, highlightedIndex) => {
		const { value, onChange } = this.props;
		if (value !== undefined && onChange) {
			this.isPending = true;
		}
		// if a suggestion was selected, delegate the handling to suggestion handler
		if (event.key === 'Enter' && highlightedIndex === null) {
			this.setValue(event.target.value, true);
			const currentValue = {
				term: event.target.value,
				category: null,
			};
			this.onValueSelected(currentValue, causes.ENTER_PRESS);
		}
		if (this.props.onKeyDown) {
			this.props.onKeyDown(event, this.triggerQuery);
		}
	};

	onInputChange = (e) => {
		const { value: inputValue } = e.target;
		if (!this.state.isOpen) {
			this.setState({
				isOpen: true,
			});
		}

		const { value, onChange } = this.props;
		if (value === undefined) {
			this.setValue(inputValue);
		} else if (onChange) {
			this.isPending = true;
			const currentValue = {
				term: inputValue,
				// category: null,
			};
			// handle caret position in controlled components
			handleCaretPosition(e);
			onChange(currentValue, () => this.triggerQuery(currentValue), e);
		} else {
			this.setValue(inputValue);
		}
	};

	triggerQuery = (value) => {
		const { term: currentValue, category: currentCategory = null } = value;
		this.isPending = false;
		this.setValue(currentValue, true, this.props, currentCategory);
	}

	onSuggestionSelected = (suggestion) => {
		const { value, onChange } = this.props;
		const currentValue = {
			term: suggestion.value,
			category: suggestion.category || null,
		};
		this.setState({
			isOpen: false,
		});
		if (value === undefined) {
			this.setValue(
				currentValue.term,
				true,
				this.props,
				currentValue.category,
				causes.SUGGESTION_SELECT,
			);
		} else if (onChange) {
			this.isPending = false;
			onChange(currentValue, () => this.triggerQuery(currentValue));
		}
		// Record analytics for selected suggestions
		this.triggerClickAnalytics(suggestion._click_id);
		// onValueSelected is user interaction driven:
		// it should be triggered irrespective of controlled (or)
		// uncontrolled component behavior
		this.onValueSelected(currentValue, causes.SUGGESTION_SELECT, suggestion.source);
	};

	onValueSelected = (selectedValue, cause, source) => {
		const { onValueSelected } = this.props;
		if (onValueSelected) {
			onValueSelected(selectedValue, cause, source);
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
			return highlightedIndex === index ? '#555' : '#424242';
		}
		return highlightedIndex === index ? '#eee' : '#fff';
	};

	handleSearchIconClick = () => {
		const { currentValue } = this.state;
		if (currentValue.trim()) {
			this.isPending = false;
			this.setValue(currentValue, true);
		}
	};

	handleVoiceResults = ({ results }) => {
		if (results
			&& results[0]
			&& results[0].isFinal
			&& results[0][0]
			&& results[0][0].transcript
			&& results[0][0].transcript.trim()
		) {
			this.isPending = false;
			this.setValue(results[0][0].transcript.trim(), true);
		}
	}

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
	};

	renderIcons = () => (
		<div>
			{this.state.currentValue && this.props.showClear && (
				<InputIcon
					onClick={this.clearValue}
					iconPosition="right"
					clearIcon={this.props.iconPosition === 'right'}
				>
					{this.renderCancelIcon()}
				</InputIcon>
			)}
			{this.props.showVoiceSearch
				&& (
					<Mic
						getInstance={this.props.getMicInstance}
						render={this.props.renderMic}
						iconPosition={this.props.iconPosition}
						onResult={this.handleVoiceResults}
						className={getClassName(this.props.innerClass, 'mic') || null}
					/>)}
			<InputIcon onClick={this.handleSearchIconClick} iconPosition={this.props.iconPosition}>
				{this.renderIcon()}
			</InputIcon>
		</div>
	);

	renderNoSuggestion = (finalSuggestionsList = []) => {
		const {
			themePreset,
			theme,
			isLoading,
			renderNoSuggestion,
			innerClass,
			renderError,
			error,
		} = this.props;
		const { isOpen, currentValue } = this.state;
		if (
			renderNoSuggestion
			&& isOpen
			&& !finalSuggestionsList.length
			&& !isLoading
			&& currentValue
			&& !(renderError && error)
		) {
			return (
				<SuggestionWrapper
					innerClass={innerClass}
					themePreset={themePreset}
					theme={theme}
					innerClassName="noSuggestion"
				>
					{typeof renderNoSuggestion === 'function'
						? renderNoSuggestion(currentValue)
						: renderNoSuggestion}
				</SuggestionWrapper>
			);
		}
		return null;
	};

	renderLoader = () => {
		const {
			loader, isLoading, themePreset, theme, innerClass,
		} = this.props;
		const { currentValue } = this.state;
		if (isLoading && loader && currentValue) {
			return (
				<SuggestionWrapper
					innerClass={innerClass}
					innerClassName="loader"
					theme={theme}
					themePreset={themePreset}
				>
					{loader}
				</SuggestionWrapper>
			);
		}
		return null;
	};

	renderError = () => {
		const {
			error, renderError, themePreset, theme, isLoading, innerClass,
		} = this.props;
		const { currentValue } = this.state;
		if (error && renderError && currentValue && !isLoading) {
			return (
				<SuggestionWrapper
					innerClass={innerClass}
					innerClassName="error"
					theme={theme}
					themePreset={themePreset}
				>
					{isFunction(renderError) ? renderError(error) : renderError}
				</SuggestionWrapper>
			);
		}
		return null;
	};

	getComponent = (downshiftProps = {}) => {
		const { error, isLoading } = this.props;
		const { currentValue } = this.state;
		const data = {
			error,
			loading: isLoading,
			downshiftProps,
			data: this.parsedSuggestions,
			value: currentValue,
			suggestions: this.state.suggestions,
			rawSuggestions: this.props.suggestions || [],
			categories: this.filteredCategories,
			rawCategories: this.props.categories,
			triggerClickAnalytics: this.triggerClickAnalytics,
		};
		return getComponent(data, this.props);
	};

	get hasCustomRenderer() {
		return hasCustomRenderer(this.props);
	}

	get filteredCategories() {
		const { categories } = this.props;
		return categories.filter(category => Boolean(category.key));
	}

	get parsedSuggestions() {
		let finalSuggestionsList = [];
		let suggestionsList = [];

		// filter out empty categories
		const filteredCategories = this.filteredCategories;

		if (
			!this.state.currentValue
			&& this.props.defaultSuggestions
			&& this.props.defaultSuggestions.length
		) {
			finalSuggestionsList = this.props.defaultSuggestions;
		} else if (this.state.currentValue) {
			suggestionsList = this.state.suggestions;
		}

		if (this.state.currentValue && this.state.suggestions.length && filteredCategories.length) {
			let categorySuggestions = [
				{
					label: `${this.state.currentValue} in all categories`,
					value: this.state.currentValue,
					category: '*',
					// no source object exists for category based suggestions
					source: null,
				},
				{
					label: `${this.state.currentValue} in ${filteredCategories[0].key}`,
					value: this.state.currentValue,
					category: filteredCategories[0].key,
					source: null,
				},
			];

			if (filteredCategories.length > 1) {
				categorySuggestions = [
					...categorySuggestions,
					{
						label: `${this.state.currentValue} in ${filteredCategories[1].key}`,
						value: this.state.currentValue,
						category: filteredCategories[1].key,
						source: null,
					},
				];
			}
			finalSuggestionsList = [...categorySuggestions, ...suggestionsList];
		}
		return withClickIds(finalSuggestionsList);
	}

	triggerClickAnalytics = (searchPosition) => {
		// click analytics would only work client side and after javascript loads
		const {
			config,
			analytics: { searchId },
			headers,
		} = this.props;
		const { url, app, credentials } = config;
		const searchState = this.context && this.context.store
			? getSearchState(this.context.store.getState(), true) : null;
		if (config.analytics && searchId) {
			fetch(`${url}/${app}/_analytics`, {
				method: 'POST',
				headers: {
					...headers,
					'Content-Type': 'application/json',
					Authorization: `Basic ${btoa(credentials)}`,
					'X-Search-Id': searchId,
					'X-Search-Click': true,
					...(searchPosition !== undefined && {
						'X-Search-ClickPosition': searchPosition + 1,
					}),
					'X-Search-Conversion': true,
					...(config.searchStateHeader && searchState && {
						'X-Search-State': JSON.stringify(searchState),
					}),
				},
			});
		}
	};

	withTriggerQuery = (func) => {
		if (func) {
			return e => func(e, () => this.triggerQuery(this.props.value));
		}
		return undefined;
	}

	render() {
		const { currentValue } = this.state;
		const { theme, themePreset } = this.props;
		const finalSuggestionsList = this.parsedSuggestions;
		return (
			<Container style={this.props.style} className={this.props.className}>
				{this.props.title && (
					<Title className={getClassName(this.props.innerClass, 'title') || null}>
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
							...rest
						}) => (
							<div className={suggestionsContainer}>
								<Input
									innerRef={(c) => {
										this._inputRef = c;
									}}
									aria-label={this.props.componentId}
									showClear={this.props.showClear}
									id={`${this.props.componentId}-input`}
									showIcon={this.props.showIcon}
									iconPosition={this.props.iconPosition}
									{...getInputProps({
										className: getClassName(this.props.innerClass, 'input'),
										placeholder: this.props.placeholder,
										value:
											this.state.currentValue === null
												? ''
												: this.state.currentValue,
										onChange: this.onInputChange,
										onBlur: this.withTriggerQuery(this.props.onBlur),
										onFocus: this.handleFocus,
										onKeyPress: this.withTriggerQuery(this.props.onKeyPress),
										onKeyDown: e => this.handleKeyDown(e, highlightedIndex),
										onKeyUp: this.withTriggerQuery(this.props.onKeyUp),
									})}
									themePreset={themePreset}
								/>
								{this.renderIcons()}
								{this.renderLoader()}
								{this.renderError()}
								{this.hasCustomRenderer
									&& this.getComponent({
										getInputProps,
										getItemProps,
										isOpen,
										highlightedIndex,
										...rest,
									})}
								{!this.hasCustomRenderer
									&& isOpen
									&& finalSuggestionsList.length ? (
										<ul
											className={`${suggestions(
												themePreset,
												theme,
											)} ${getClassName(this.props.innerClass, 'list')}`}
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
													<Text primary={!!item.category}>
														<SuggestionItem
															currentValue={currentValue}
															suggestion={item}
														/>
													</Text>
												</li>
											))}
										</ul>
									) : (
										this.renderNoSuggestion(finalSuggestionsList)
									)}
							</div>
						)}
						{...this.props.downShiftProps}
					/>
				) : (
					<div className={suggestionsContainer}>
						<Input
							innerRef={(c) => {
								this._inputRef = c;
							}}
							aria-label={this.props.componentId}
							className={getClassName(this.props.innerClass, 'input')}
							placeholder={this.props.placeholder}
							value={this.state.currentValue ? this.state.currentValue : ''}
							onChange={this.onInputChange}
							onBlur={this.withTriggerQuery(this.props.onBlur)}
							onFocus={this.withTriggerQuery(this.props.onFocus)}
							onKeyPress={this.withTriggerQuery(this.props.onKeyPress)}
							onKeyDown={this.withTriggerQuery(this.props.onKeyDown)}
							onKeyUp={this.withTriggerQuery(this.props.onKeyUp)}
							autoFocus={this.props.autoFocus}
							iconPosition={this.props.iconPosition}
							showClear={this.props.showClear}
							showIcon={this.props.showIcon}
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
	selectedCategory: types.selectedValue,
	suggestions: types.suggestions,
	setComponentProps: types.funcRequired,
	updateComponentProps: types.funcRequired,
	isLoading: types.bool,
	config: types.props,
	analytics: types.props,
	headers: types.headers,
	// eslint-disable-next-line
	error: types.any,
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
	defaultQuery: types.func,
	dataField: types.dataFieldArray,
	debounce: types.number,
	defaultValue: types.categorySearchValue,
	value: types.categorySearchValue,
	defaultSuggestions: types.suggestions,
	downShiftProps: types.props,
	fieldWeights: types.fieldWeights,
	filterLabel: types.string,
	fuzziness: types.fuzziness,
	highlight: types.bool,
	highlightField: types.stringOrArray,
	icon: types.children,
	iconPosition: types.iconPosition,
	innerClass: types.style,
	loader: types.title,
	nestedField: types.string,
	onError: types.func,
	onBlur: types.func,
	onFocus: types.func,
	onKeyDown: types.func,
	onKeyPress: types.func,
	onKeyUp: types.func,
	onQueryChange: types.func,
	onSuggestions: types.func,
	onValueChange: types.func,
	onChange: types.func,
	onValueSelected: types.func,
	placeholder: types.string,
	queryFormat: types.queryFormatSearch,
	react: types.react,
	renderError: types.title,
	parseSuggestion: types.func,
	renderNoSuggestion: types.title,
	showClear: types.bool,
	showFilter: types.bool,
	showVoiceSearch: types.bool,
	showIcon: types.bool,
	style: types.style,
	title: types.title,
	theme: types.style,
	themePreset: types.themePreset,
	URLParams: types.bool,
	strictSelection: types.bool,
	searchOperators: types.bool,
	// Mic props
	getMicInstance: types.func,
	renderMic: types.func,
};

CategorySearch.defaultProps = {
	autosuggest: true,
	className: null,
	debounce: 0,
	downShiftProps: {},
	iconPosition: 'left',
	placeholder: 'Search',
	queryFormat: 'or',
	showClear: false,
	showFilter: true,
	showIcon: true,
	style: {},
	URLParams: false,
	strictSelection: false,
	searchOperators: false,
	showVoiceSearch: false,
};

const mapStateToProps = (state, props) => ({
	categories:
		(state.aggregations[props.componentId]
			&& state.aggregations[props.componentId][props.categoryField]
			&& state.aggregations[props.componentId][props.categoryField].buckets)
		|| [],
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	selectedCategory:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].category)
		|| null,
	suggestions: (state.hits[props.componentId] && state.hits[props.componentId].hits) || [],
	themePreset: state.config.themePreset,
	isLoading: state.isLoading[props.componentId],
	error: state.error[props.componentId],
	analytics: state.analytics,
	config: state.config,
	headers: state.appbaseRef.headers,
});

const mapDispatchtoProps = dispatch => ({
	setComponentProps: (component, options) => dispatch(setComponentProps(component, options)),
	updateComponentProps: (component, options) =>
		dispatch(updateComponentProps(component, options)),
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => <CategorySearch ref={props.myForwardedRef} {...props} />);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, CategorySearch);

ForwardRefComponent.name = 'CategorySearch';
export default ForwardRefComponent;
