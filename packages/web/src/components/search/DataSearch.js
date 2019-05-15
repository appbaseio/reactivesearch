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
	setComponentProps,
	updateComponentProps,
} from '@appbaseio/reactivecore/lib/actions';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {
	debounce,
	pushToAndClause,
	checkValueChange,
	checkPropChange,
	checkSomePropChange,
	getClassName,
	getOptionsFromQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';

import types from '@appbaseio/reactivecore/lib/utils/types';
import getSuggestions from '@appbaseio/reactivecore/lib/utils/suggestions';
import causes from '@appbaseio/reactivecore/lib/utils/causes';
import Title from '../../styles/Title';
import Input, { suggestionsContainer, suggestions } from '../../styles/Input';
import SearchSvg from '../shared/SearchSvg';
import CancelSvg from '../shared/CancelSvg';
import InputIcon from '../../styles/InputIcon';
import Container from '../../styles/Container';
import {
	connect,
	isFunction,
	getComponent,
	hasCustomRenderer,
	isIdentical,
	getValidPropsKeys,
} from '../../utils';
import SuggestionItem from './addons/SuggestionItem';
import SuggestionWrapper from './addons/SuggestionWrapper';

class DataSearch extends Component {
	constructor(props) {
		super(props);
		const currentValue = props.selectedValue || props.value || props.defaultValue || '';

		this.state = {
			currentValue,
			suggestions: [],
			isOpen: false,
		};
		this.internalComponent = `${props.componentId}__internal`;
		this.locked = false;
		this.queryOptions = {
			size: 20,
		};

		props.addComponent(props.componentId);
		props.addComponent(this.internalComponent);
		props.setComponentProps(props.componentId, {
			...props,
			componentType: componentTypes.dataSearch,
		});
		props.setQueryListener(props.componentId, props.onQueryChange, props.onError);

		if (props.highlight) {
			const queryOptions = DataSearch.highlightQuery(props) || {};
			queryOptions.size = 20;
			this.queryOptions = queryOptions;
			props.setQueryOptions(props.componentId, queryOptions);
		} else {
			props.setQueryOptions(props.componentId, this.queryOptions);
		}

		this.setReact(props);
		const hasMounted = false;
		const cause = null;

		if (currentValue) {
			this.setValue(currentValue, true, props, cause, hasMounted);
		}
	}

	componentDidUpdate(prevProps) {
		checkSomePropChange(this.props, prevProps, getValidPropsKeys(this.props), () => {
			this.props.updateComponentProps(this.props.componentId, this.props);
		});
		checkSomePropChange(
			this.props,
			prevProps,
			['highlight', 'dataField', 'highlightField'],
			() => {
				const queryOptions = DataSearch.highlightQuery(this.props) || {};
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
			['fieldWeights', 'fuzziness', 'queryFormat', 'dataField', 'nestedField'],
			() => {
				this.updateQuery(this.state.currentValue, this.props);
			},
		);

		if (this.props.value !== prevProps.value) {
			this.setValue(this.props.value, true, this.props);
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
				this.setValue(this.props.selectedValue || '', true, this.props);
			} else if (onChange) {
				// value prop exists
				onChange(this.props.selectedValue || '');
			} else {
				// value prop exists and onChange is not defined:
				// we need to put the current value back into the store
				// if the clear action was triggered by interacting with
				// selected-filters component
				this.setValue(this.state.currentValue, true, this.props);
			}
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
			},
		};
	};

	static defaultQuery = (value, props) => {
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
					should: DataSearch.shouldQuery(value, fields, props),
					minimum_should_match: '1',
				},
			};
		}

		if (value === '') {
			finalQuery = {
				match_all: {},
			};
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

	onSuggestions = (results) => {
		const { parseSuggestion } = this.props;

		const fields = Array.isArray(this.props.dataField)
			? this.props.dataField
			: [this.props.dataField];

		const parsedSuggestions = getSuggestions(
			fields,
			results,
			this.state.currentValue.toLowerCase(),
		);

		if (parseSuggestion) {
			return parsedSuggestions.map(suggestion => parseSuggestion(suggestion));
		}

		return parsedSuggestions;
	};

	setValue = (value, isDefaultValue = false, props = this.props, cause, hasMounted = true) => {
		// ignore state updates when component is locked
		if (props.beforeValueChange && this.locked) {
			return;
		}

		this.locked = true;
		const performUpdate = () => {
			if (hasMounted) {
				this.setState(
					{
						currentValue: value,
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
									this.updateQuery(value, props);
								} else {
									this.setValue('', true);
								}
							} else {
								this.updateQuery(value, props);
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
				if (this.props.autosuggest) {
					this.updateDefaultQuery(value, props);
				}
				this.updateQuery(value, props);
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

	updateDefaultQuery = (value, props) => {
		const { defaultQuery } = props;
		let defaultQueryOptions;
		let query = DataSearch.defaultQuery(value, props);
		if (defaultQuery) {
			const defaultQueryTobeSet = defaultQuery(value, props) || {};
			if (defaultQueryTobeSet.query) {
				({ query } = defaultQueryTobeSet);
			}
			defaultQueryOptions = getOptionsFromQuery(defaultQueryTobeSet);
		}
		props.setQueryOptions(this.internalComponent, {
			...this.queryOptions,
			...defaultQueryOptions,
		});
		props.updateQuery({
			componentId: this.internalComponent,
			query,
			value,
		});
	};

	updateQuery = (value, props) => {
		const {
			customQuery, filterLabel, showFilter, URLParams,
		} = props;

		let customQueryOptions;
		let query = DataSearch.defaultQuery(value, props);
		if (customQuery) {
			const customQueryTobeSet = customQuery(value, props) || {};
			const queryTobeSet = customQueryTobeSet.query;
			if (queryTobeSet) {
				query = [queryTobeSet];
			}
			customQueryOptions = getOptionsFromQuery(customQueryTobeSet);
		}

		// query options should be applied to the source component,
		// not on internal component, hence using `this.props.componentId` here
		props.setQueryOptions(props.componentId, {
			...this.queryOptions,
			...customQueryOptions,
		});
		props.updateQuery({
			componentId: props.componentId,
			query,
			value,
			label: filterLabel,
			showFilter,
			URLParams,
			componentType: componentTypes.dataSearch,
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
		// if a suggestion was selected, delegate the handling
		// to suggestion handler
		if (event.key === 'Enter' && highlightedIndex === null) {
			this.setValue(event.target.value, true);
			this.onValueSelected(event.target.value, causes.ENTER_PRESS);
		}
		if (this.props.onKeyDown) {
			this.props.onKeyDown(event);
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
			onChange(inputValue);
		}
	};

	onSuggestionSelected = (suggestion) => {
		const { value, onChange } = this.props;
		if (value === undefined) {
			this.setValue(suggestion.value, true, this.props, causes.SUGGESTION_SELECT);
		} else if (onChange) {
			onChange(suggestion.value);
		}

		// onValueSelected is user interaction driven:
		// it should be triggered irrespective of controlled (or)
		// uncontrolled component behavior
		this.onValueSelected(suggestion.value, causes.SUGGESTION_SELECT, suggestion.source);
	};

	onValueSelected = (currentValue = this.state.currentValue, ...cause) => {
		const { onValueSelected } = this.props;
		if (onValueSelected) {
			onValueSelected(currentValue, ...cause);
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
			this.setValue(currentValue, true);
		}
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
			error,
			renderError,
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
			rawData: this.props.suggestions || [],
			value: currentValue,
		};
		return getComponent(data, this.props);
	};

	get parsedSuggestions() {
		let suggestionsList = [];
		const { currentValue } = this.state;
		const { defaultSuggestions } = this.props;
		if (!currentValue && defaultSuggestions && defaultSuggestions.length) {
			suggestionsList = defaultSuggestions;
		} else if (currentValue) {
			suggestionsList = this.state.suggestions;
		}
		return suggestionsList;
	}

	get hasCustomRenderer() {
		return hasCustomRenderer(this.props);
	}

	render() {
		const { currentValue } = this.state;
		const suggestionsList = this.parsedSuggestions;
		const { theme, themePreset } = this.props;
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
									id={`${this.props.componentId}-input`}
									showIcon={this.props.showIcon}
									showClear={this.props.showClear}
									iconPosition={this.props.iconPosition}
									innerRef={(c) => {
										this._inputRef = c;
									}}
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
								{this.hasCustomRenderer
									&& this.getComponent({
										getInputProps,
										getItemProps,
										isOpen,
										highlightedIndex,
										...rest,
									})}
								{this.renderLoader()}
								{this.renderError()}
								{!this.hasCustomRenderer && isOpen && suggestionsList.length ? (
									<ul
										className={`${suggestions(
											themePreset,
											theme,
										)} ${getClassName(this.props.innerClass, 'list')}`}
									>
										{suggestionsList.slice(0, 10).map((item, index) => (
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
												<SuggestionItem
													currentValue={currentValue}
													suggestion={item}
												/>
											</li>
										))}
									</ul>
								) : (
									this.renderNoSuggestion(suggestionsList)
								)}
							</div>
						)}
						{...this.props.downShiftProps}
					/>
				) : (
					<div className={suggestionsContainer}>
						<Input
							className={getClassName(this.props.innerClass, 'input') || null}
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
							showClear={this.props.showClear}
							themePreset={themePreset}
						/>
						{this.renderIcons()}
					</div>
				)}
			</Container>
		);
	}
}

DataSearch.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	options: types.options,
	selectedValue: types.selectedValue,
	suggestions: types.suggestions,
	setComponentProps: types.funcRequired,
	updateComponentProps: types.funcRequired,
	// component props
	autoFocus: types.bool,
	autosuggest: types.bool,
	beforeValueChange: types.func,
	className: types.string,
	clearIcon: types.children,
	componentId: types.stringRequired,
	customHighlight: types.func,
	customQuery: types.func,
	defaultQuery: types.func,
	dataField: types.dataFieldArray,
	debounce: types.number,
	defaultValue: types.string,
	value: types.string,
	defaultSuggestions: types.suggestions,
	downShiftProps: types.props,
	// eslint-disable-next-line
	children: types.func,
	error: types.title,
	fieldWeights: types.fieldWeights,
	filterLabel: types.string,
	fuzziness: types.fuzziness,
	highlight: types.bool,
	highlightField: types.stringOrArray,
	icon: types.children,
	iconPosition: types.iconPosition,
	innerClass: types.style,
	isLoading: types.bool,
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
	render: types.func,
	renderError: types.title,
	parseSuggestion: types.func,
	renderNoSuggestion: types.title,
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

DataSearch.defaultProps = {
	autosuggest: true,
	className: null,
	debounce: 0,
	downShiftProps: {},
	iconPosition: 'left',
	placeholder: 'Search',
	queryFormat: 'or',
	showFilter: true,
	showIcon: true,
	style: {},
	URLParams: false,
	showClear: false,
	strictSelection: false,
};

const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	suggestions: state.hits[props.componentId] && state.hits[props.componentId].hits,
	themePreset: state.config.themePreset,
	isLoading: state.isLoading[props.componentId] || false,
	error: state.error[props.componentId],
});

const mapDispatchtoProps = dispatch => ({
	setComponentProps: (component, options) => dispatch(setComponentProps(component, options)),
	updateComponentProps: (component, options) =>
		dispatch(updateComponentProps(component, options)),
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(withTheme(props => <DataSearch ref={props.myForwardedRef} {...props} />));

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, DataSearch);

ForwardRefComponent.name = 'DataSearch';
export default ForwardRefComponent;
