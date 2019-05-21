import { Actions, helper, suggestions as getSuggestions, causes } from '@appbaseio/reactivecore';
import VueTypes from 'vue-types';
import { connect, isFunction } from '../../utils/index';
import Title from '../../styles/Title';
import Input, { suggestionsContainer, suggestions } from '../../styles/Input';
import InputIcon from '../../styles/InputIcon';
import Downshift from '../basic/DownShift.jsx';
import Container from '../../styles/Container';
import types from '../../utils/vueTypes';
import SuggestionWrapper from './addons/SuggestionWrapper.jsx';
import SearchSvg from '../shared/SearchSvg';
import CancelSvg from '../shared/CancelSvg';

const {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
	setQueryListener,
} = Actions;
const { debounce, pushToAndClause, checkValueChange, getClassName, getOptionsFromQuery } = helper;

const DataSearch = {
	name: 'DataSearch',
	data() {
		const props = this.$props;
		this.__state = {
			currentValue: '',
			isOpen: false,
			normalizedSuggestions: [],
		};
		this.internalComponent = `${props.componentId}__internal`;
		this.locked = false;
		return this.__state;
	},
	created() {
		this.currentValue = this.selectedValue || '';
		this.handleTextChange = debounce(value => {
			if (this.$props.autosuggest) {
				this.updateQueryHandler(this.internalComponent, value, this.$props);
			} else {
				this.updateQueryHandler(this.$props.componentId, value, this.$props);
			}
		}, this.$props.debounce);
		const onQueryChange = (...args) => {
			this.$emit('queryChange', ...args);
		};
		this.setQueryListener(this.$props.componentId, onQueryChange, e => {
			this.$emit('error', e);
		});
	},
	computed: {
		suggestionsList() {
			let suggestionsList = [];
			if (
				!this.$data.currentValue
				&& this.$props.defaultSuggestions
				&& this.$props.defaultSuggestions.length
			) {
				suggestionsList = this.$props.defaultSuggestions;
			} else if (this.$data.currentValue) {
				suggestionsList = this.normalizedSuggestions;
			}
			return suggestionsList;
		},
	},
	props: {
		options: types.options,
		autoFocus: types.bool,
		autosuggest: VueTypes.bool.def(true),
		beforeValueChange: types.func,
		className: VueTypes.string.def(''),
		clearIcon: types.children,
		componentId: types.stringRequired,
		customHighlight: types.func,
		customQuery: types.func,
		dataField: types.dataFieldArray,
		debounce: VueTypes.number.def(0),
		defaultSelected: types.string,
		defaultSuggestions: types.suggestions,
		fieldWeights: types.fieldWeights,
		filterLabel: types.string,
		fuzziness: types.fuzziness,
		highlight: types.bool,
		highlightField: types.stringOrArray,
		icon: types.children,
		iconPosition: VueTypes.oneOf(['left', 'right']).def('left'),
		innerClass: types.style,
		innerRef: types.func,
		renderAllSuggestions: types.func,
		renderSuggestion: types.func,
		renderNoSuggestion: types.title,
		renderError: types.title,
		placeholder: VueTypes.string.def('Search'),
		queryFormat: VueTypes.oneOf(['and', 'or']).def('or'),
		react: types.react,
		showClear: VueTypes.bool.def(true),
		showFilter: VueTypes.bool.def(true),
		showIcon: VueTypes.bool.def(true),
		title: types.title,
		theme: types.style,
		URLParams: VueTypes.bool.def(false),
		strictSelection: VueTypes.bool.def(false),
		nestedField: types.string,
	},
	beforeMount() {
		this.addComponent(this.$props.componentId, 'DATASEARCH');
		this.addComponent(this.internalComponent);

		if (this.$props.highlight) {
			const queryOptions = DataSearch.highlightQuery(this.$props) || {};
			queryOptions.size = 20;
			this.setQueryOptions(this.$props.componentId, queryOptions);
		} else {
			this.setQueryOptions(this.$props.componentId, {
				size: 20,
			});
		}

		this.setReact(this.$props);

		if (this.selectedValue) {
			this.setValue(this.selectedValue, true);
		} else if (this.$props.defaultSelected) {
			this.setValue(this.$props.defaultSelected, true);
		}
	},
	beforeDestroy() {
		this.removeComponent(this.$props.componentId);
		this.removeComponent(this.internalComponent);
	},
	watch: {
		highlight() {
			this.updateQueryOptions();
		},
		dataField() {
			this.updateQueryOptions();
			this.updateQueryHandler(this.$props.componentId, this.$data.currentValue, this.$props);
		},
		highlightField() {
			this.updateQueryOptions();
		},
		react() {
			this.setReact(this.$props);
		},
		fieldWeights() {
			this.updateQueryHandler(this.$props.componentId, this.$data.currentValue, this.$props);
		},
		fuzziness() {
			this.updateQueryHandler(this.$props.componentId, this.$data.currentValue, this.$props);
		},
		queryFormat() {
			this.updateQueryHandler(this.$props.componentId, this.$data.currentValue, this.$props);
		},
		defaultSelected(newVal) {
			this.setValue(newVal, true, this.$props);
		},
		suggestions(newVal) {
			if (Array.isArray(newVal) && this.$data.currentValue.trim().length) {
				// shallow check allows us to set suggestions even if the next set
				// of suggestions are same as the current one
				this.$emit('suggestions', newVal);
				this.normalizedSuggestions = this.onSuggestions(newVal);
			}
		},
		selectedValue(newVal, oldVal) {
			if (oldVal !== newVal && this.$data.currentValue !== newVal) {
				this.setValue(newVal || '', true, this.$props);
			}
		},
	},
	methods: {
		updateQueryOptions() {
			const queryOptions = DataSearch.highlightQuery(this.$props) || {};
			queryOptions.size = 20;
			this.setQueryOptions(this.$props.componentId, queryOptions);
		},
		setReact(props) {
			const { react } = this.$props;

			if (react) {
				const newReact = pushToAndClause(react, this.internalComponent);
				this.watchComponent(props.componentId, newReact);
			} else {
				this.watchComponent(props.componentId, {
					and: this.internalComponent,
				});
			}
		},
		onSuggestions(results) {
			const { renderSuggestion } = this.$props;
			const fields = Array.isArray(this.$props.dataField)
				? this.$props.dataField
				: [this.$props.dataField];

			const parsedSuggestions = getSuggestions(
				fields,
				results,
				this.$data.currentValue.toLowerCase(),
			);

			if (renderSuggestion) {
				return parsedSuggestions.map(suggestion => renderSuggestion(suggestion));
			}

			return parsedSuggestions;
		},
		setValue(value, isDefaultValue = false, props = this.$props, cause) {
			// ignore state updates when component is locked
			if (props.beforeValueChange && this.locked) {
				return;
			}

			this.locked = true;

			const performUpdate = () => {
				this.currentValue = value;
				this.normalizedSuggestions = [];
				if (isDefaultValue) {
					if (this.$props.autosuggest) {
						this.isOpen = false;
						this.updateQueryHandler(this.internalComponent, value, props);
					} // in case of strict selection only SUGGESTION_SELECT should be able
					// to set the query otherwise the value should reset

					if (props.strictSelection) {
						if (cause === causes.SUGGESTION_SELECT || value === '') {
							this.updateQueryHandler(props.componentId, value, props);
						} else {
							this.setValue('', true);
						}
					} else {
						this.updateQueryHandler(props.componentId, value, props);
					}
				} else {
					// debounce for handling text while typing
					this.handleTextChange(value);
				}

				this.locked = false;
				this.$emit('valueChange', value);
			};

			checkValueChange(props.componentId, value, props.beforeValueChange, performUpdate);
		},

		updateQueryHandler(componentId, value, props) {
			const { customQuery, filterLabel, showFilter, URLParams } = props;

			let customQueryOptions;
			const defaultQueryTobeSet = DataSearch.defaultQuery(value, props);
			let query = defaultQueryTobeSet;
			if (customQuery) {
				const customQueryTobeSet = customQuery(value, props);
				const queryTobeSet = customQueryTobeSet.query;
				if (queryTobeSet) {
					query = [queryTobeSet];
				}
				customQueryOptions = getOptionsFromQuery(customQueryTobeSet);
			}

			this.setQueryOptions(componentId, {
				...this.queryOptions,
				...customQueryOptions,
			});
			this.updateQuery({
				componentId,
				query,
				value,
				label: filterLabel,
				showFilter,
				URLParams,
				componentType: 'DATASEARCH',
			});
		},
		// need to review
		handleFocus(event) {
			this.isOpen = true;

			if (this.$props.onFocus) {
				this.$emit('focus', event);
			}
		},

		clearValue() {
			this.setValue('', true);
			this.onValueSelectedHandler(null, causes.CLEAR_VALUE);
		},

		handleKeyDown(event, highlightedIndex) {
			// if a suggestion was selected, delegate the handling to suggestion handler
			if (event.key === 'Enter' && highlightedIndex === null) {
				this.setValue(event.target.value, true);
				this.onValueSelectedHandler(event.target.value, causes.ENTER_PRESS);
			}
			// Need to review
			if (this.$props.onKeyDown) {
				this.$emit('keyDown', event);
			}
		},

		onInputChange(e) {
			const { value } = e.target;

			if (!this.$data.isOpen) {
				this.isOpen = true;
			}

			this.setValue(value);
		},

		onSuggestionSelected(suggestion) {
			this.setValue(suggestion.value, true, this.$props, causes.SUGGESTION_SELECT);
			this.onValueSelectedHandler(
				suggestion.value,
				causes.SUGGESTION_SELECT,
				suggestion.source,
			);
		},

		onValueSelectedHandler(currentValue = this.$data.currentValue, ...cause) {
			this.$emit('valueSelected', currentValue, ...cause);
		},

		handleStateChange(changes) {
			const { isOpen } = changes;
			this.isOpen = isOpen;
		},

		getBackgroundColor(highlightedIndex, index) {
			const isDark = this.themePreset === 'dark';

			if (isDark) {
				return highlightedIndex === index ? '#555' : '#424242';
			}

			return highlightedIndex === index ? '#eee' : '#fff';
		},

		renderIcon() {
			if (this.$props.showIcon) {
				return this.$props.icon || <SearchSvg />;
			}

			return null;
		},

		renderErrorComponent() {
			const renderError = this.$scopedSlots.renderError || this.$props.renderError;
			if (this.error && renderError && this.$data.currentValue && !this.isLoading) {
				return (
					<SuggestionWrapper
						innerClass={this.$props.innerClass}
						innerClassName="error"
						theme={this.theme}
						themePreset={this.themePreset}
					>
						{isFunction(renderError) ? renderError(this.error) : renderError}
					</SuggestionWrapper>
				);
			}
			return null;
		},

		renderCancelIcon() {
			if (this.$props.showClear) {
				return this.$props.clearIcon || <CancelSvg />;
			}

			return null;
		},
		renderNoSuggestions(finalSuggestionsList = []) {
			const { theme, innerClass } = this.$props;
			const renderNoSuggestion
				= this.$scopedSlots.renderNoSuggestion || this.$props.renderNoSuggestion;
			const renderError = this.$scopedSlots.renderError || this.$props.renderError;
			const { isOpen, currentValue } = this.$data;
			if (
				renderNoSuggestion
				&& isOpen
				&& !finalSuggestionsList.length
				&& !this.isLoading
				&& currentValue
				&& !(renderError && this.error)
			) {
				return (
					<SuggestionWrapper
						innerClass={innerClass}
						themePreset={this.themePreset}
						theme={theme}
						innerClassName="noSuggestion"
						scopedSlots={{
							default: () =>
								typeof renderNoSuggestion === 'function'
									? renderNoSuggestion(currentValue)
									: renderNoSuggestion,
						}}
					/>
				);
			}
			return null;
		},

		renderIcons() {
			return (
				<div>
					{this.$data.currentValue && this.$props.showClear && (
						<InputIcon
							onClick={this.clearValue}
							iconPosition="right"
							clearIcon={this.$props.iconPosition === 'right'}
						>
							{this.renderCancelIcon()}
						</InputIcon>
					)}
					<InputIcon iconPosition={this.$props.iconPosition}>
						{this.renderIcon()}
					</InputIcon>
				</div>
			);
		},
	},
	render() {
		const { theme } = this.$props;
		const renderAllSuggestions
			= this.$scopedSlots.renderAllSuggestions || this.$props.renderAllSuggestions;
		return (
			<Container class={this.$props.className}>
				{this.$props.title && (
					<Title class={getClassName(this.$props.innerClass, 'title') || ''}>
						{this.$props.title}
					</Title>
				)}
				{this.$props.defaultSuggestions || this.$props.autosuggest ? (
					<Downshift
						id={`${this.$props.componentId}-downshift`}
						handleChange={this.onSuggestionSelected}
						handleMouseup={this.handleStateChange}
						isOpen={this.$data.isOpen}
						scopedSlots={{
							default: ({
								getInputEvents,
								getInputProps,

								getItemProps,
								getItemEvents,

								isOpen,
								highlightedIndex,
							}) => (
								<div class={suggestionsContainer}>
									<Input
										id={`${this.$props.componentId}-input`}
										showIcon={this.$props.showIcon}
										showClear={this.$props.showClear}
										iconPosition={this.$props.iconPosition}
										innerRef={this.$props.innerRef}
										class={getClassName(this.$props.innerClass, 'input')}
										placeholder={this.$props.placeholder}
										{...{
											on: getInputEvents({
												onInput: this.onInputChange,
												onBlur: e => {
													this.$emit('blur', e);
												},
												onFocus: this.handleFocus,
												onKeyPress: e => {
													this.$emit('keyPress', e);
												},
												onKeyDown: e =>
													this.handleKeyDown(e, highlightedIndex),
												onKeyUp: e => {
													this.$emit('keyUp', e);
												},
											}),
										}}
										{...{
											domProps: getInputProps({
												value:
													this.$data.currentValue === null
														? ''
														: this.$data.currentValue,
											}),
										}}
										themePreset={this.themePreset}
									/>
									{this.renderIcons()}
									{renderAllSuggestions
										&& renderAllSuggestions({
											currentValue: this.$data.currentValue,
											isOpen,
											getItemProps,
											highlightedIndex,
											suggestions: this.props.suggestions,
											parsedSuggestions: this.suggestionsList,
										})}
									{this.renderErrorComponent()}
									{!renderAllSuggestions
									&& isOpen
									&& this.suggestionsList.length ? (
											<ul
												class={`${suggestions(
													this.themePreset,
													theme,
												)} ${getClassName(this.$props.innerClass, 'list')}`}
											>
												{this.suggestionsList
													.slice(0, 10)
													.map((item, index) => (
														<li
															{...{
																domProps: getItemProps({ item }),
															}}
															{...{
																on: getItemEvents({
																	item,
																}),
															}}
															key={`${index + 1}-${item.value}`}
															style={{
																backgroundColor: this.getBackgroundColor(
																	highlightedIndex,
																	index,
																),
															}}
														>
															{typeof item.label === 'string' ? (
																<div
																	class="trim"
																	domPropsInnerHTML={item.label}
																/>
															) : (
																item.label
															)}
														</li>
													))}
											</ul>
										) : (
											this.renderNoSuggestions(this.suggestionsList)
										)}{' '}
								</div>
							),
						}}
					/>
				) : (
					<div class={suggestionsContainer}>
						<Input
							class={getClassName(this.$props.innerClass, 'input') || ''}
							placeholder={this.$props.placeholder}
							{...{
								on: {
									blur: e => {
										this.$emit('blur', e);
									},
									keypress: e => {
										this.$emit('keyPress', e);
									},
									input: this.onInputChange,
									focus: e => {
										this.$emit('focus', e);
									},
									keydown: e => {
										this.$emit('keyDown', e);
									},
									keyup: e => {
										this.$emit('keyUp', e);
									},
								},
							}}
							{...{
								domProps: {
									autofocus: this.$props.autoFocus,
									value: this.$data.currentValue ? this.$data.currentValue : '',
								},
							}}
							iconPosition={this.$props.iconPosition}
							showIcon={this.$props.showIcon}
							showClear={this.$props.showClear}
							innerRef={this.$props.innerRef}
							themePreset={this.themePreset}
						/>
						{this.renderIcons()}
					</div>
				)}
			</Container>
		);
	},
};

DataSearch.defaultQuery = (value, props) => {
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
		return {
			query: {
				nested: {
					path: props.nestedField,
					query: finalQuery,
				},
			},
		};
	}

	return finalQuery;
};
DataSearch.shouldQuery = (value, dataFields, props) => {
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
DataSearch.highlightQuery = props => {
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
		highlightField.forEach(item => {
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

const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	suggestions: state.hits[props.componentId] && state.hits[props.componentId].hits,
	isLoading: state.isLoading[props.componentId],
	themePreset: state.config.themePreset,
	error: state.error[props.componentId],
});
const mapDispatchtoProps = {
	addComponent,
	removeComponent,
	setQueryOptions,
	updateQuery,
	watchComponent,
	setQueryListener,
};
const DSConnected = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(DataSearch);

DataSearch.install = function(Vue) {
	Vue.component(DataSearch.name, DSConnected);
};
export default DataSearch;
