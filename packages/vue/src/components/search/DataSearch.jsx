import {
	Actions,
	helper,
	suggestions as getSuggestions,
	causes,
} from '@appbaseio/reactivecore';
import VueTypes from 'vue-types';
import { connect, } from '../../utils/index';
import Title from '../../styles/Title';
import Input, {
	suggestionsContainer /* suggestions */,
} from '../../styles/Input';
import InputIcon from '../../styles/InputIcon';
import Container from '../../styles/Container';
import types from '../../utils/vueTypes';
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
const { debounce, pushToAndClause, checkValueChange, getClassName, } = helper;

const DataSearch = {
	name: 'DataSearch',
	data() {
		const props = this.$props;
		this.__state = {
			currentValue: '',
			isOpen: false,
		};
		this.internalComponent = `${props.componentId}__internal`;
		this.locked = false;
		return this.__state;
	},
	created() {
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
		this.setQueryListener(this.$props.componentId, onQueryChange, null);
	},
	props: {
		options: types.options,
		autoFocus: types.bool,
		// autosuggest: VueTypes.bool.def(false),
		beforeValueChange: types.func,
		className: VueTypes.string.def(''),
		clearIcon: types.children,
		componentId: types.stringRequired,
		customHighlight: types.func,
		customQuery: types.func,
		dataField: types.dataFieldArray,
		debounce: VueTypes.number.def(0),
		defaultSelected: types.string,
		// defaultSuggestions: types.suggestions,
		fieldWeights: types.fieldWeights,
		filterLabel: types.string,
		fuzziness: types.fuzziness,
		highlight: types.bool,
		highlightField: types.stringOrArray,
		icon: types.children,
		iconPosition: VueTypes.oneOf(['left', 'right',]).def('left'),
		innerClass: types.style,
		innerRef: types.func,
		// onSuggestion: types.func, // add event handler
		// onValueSelected: types.func, // add event handler
		placeholder: VueTypes.string.def('Search'),
		queryFormat: VueTypes.oneOf(['and', 'or',]).def('or'),
		react: types.react,
		// renderSuggestions: types.func,
		showClear: VueTypes.bool.def(true),
		showFilter: VueTypes.bool.def(true),
		showIcon: VueTypes.bool.def(true),
		title: types.title,
		theme: types.style,
		URLParams: VueTypes.bool.def(false),
		strictSelection: VueTypes.bool.def(false),
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
			this.updateQueryHandler(
				this.$props.componentId,
				this.$data.currentValue,
				this.$props
			);
		},
		highlightField() {
			this.updateQueryOptions();
		},
		react() {
			this.setReact(this.$props);
		},
		fieldWeights() {
			this.updateQueryHandler(
				this.$props.componentId,
				this.$data.currentValue,
				this.$props
			);
		},
		fuzziness() {
			this.updateQueryHandler(
				this.$props.componentId,
				this.$data.currentValue,
				this.$props
			);
		},
		queryFormat() {
			this.updateQueryHandler(
				this.$props.componentId,
				this.$data.currentValue,
				this.$props
			);
		},
		defaultSelected(newVal) {
			this.setValue(newVal, true, this.$props);
		},
		// TODO
		// suggestions(newVal) {
		//     if (Array.isArray(newVal) && this.$data.currentValue.trim().length) {
		//       // shallow check allows us to set suggestions even if the next set
		//       // of suggestions are same as the current one
		//         this.suggestions = this.onSuggestions(newVal);
		//     }
		// },
		selectedValue(newVal) {
			if (
				this.$attrs.selectedValue !== newVal
				&& this.$data.currentValue !== newVal
			) {
				this.setValue(newVal || '', true, this.$props);
			}
		},
	},
	methods: {
		updateQueryOptions() {
			const queryOptions = DataSearch.highlightQuery(this.$props) || {};
			queryOptions.size = 20;
			this.$attrs.setQueryOptions(this.$props.componentId, queryOptions);
		},
		setReact(props) {
			const { react, } = this.$props;

			if (react) {
				const newReact = pushToAndClause(react, this.internalComponent);
				this.watchComponent(props.componentId, newReact);
			} else {
				this.watchComponent(props.componentId, {
					and: this.internalComponent,
				});
			}
		},
		// need to review
		onSuggestions(results) {
			if (this.$props.onSuggestion) {
				return results.map(suggestion => this.$props.onSuggestion(suggestion));
			}

			const fields = Array.isArray(this.$props.dataField)
				? this.$props.dataField
				: [this.$props.dataField,];
			return getSuggestions(
				fields,
				results,
				this.$data.currentValue.toLowerCase()
			);
		},
		setValue(value, isDefaultValue = false, props = this.$props, cause) {
			// ignore state updates when component is locked
			if (props.beforeValueChange && this.locked) {
				return;
			}

			this.locked = true;

			const performUpdate = () => {
				this.currentValue = value;
				this.suggestions = [];
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

			checkValueChange(
				props.componentId,
				value,
				props.beforeValueChange,
				performUpdate
			);
		},

		updateQueryHandler(componentId, value, props) {
			const {
				customQuery,
				defaultQuery,
				filterLabel,
				showFilter,
				URLParams,
			} = props; // defaultQuery from props is always appended regardless of a customQuery

			const query = customQuery || DataSearch.defaultQuery;
			const queryObject = defaultQuery
				? {
					bool: {
						must: [...query(value, props), ...defaultQuery(value, props),],
					},
				  }
				: query(value, props);
			this.updateQuery({
				componentId,
				query: queryObject,
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
			const { value, } = e.target;

			if (!this.$data.isOpen) {
				this.isOpen = true;
			}

			this.setValue(value);
		},

		onSuggestionSelected(suggestion) {
			this.setValue(
				suggestion.value,
				true,
				this.$props,
				causes.SUGGESTION_SELECT
			);
			this.onValueSelected(
				suggestion.value,
				causes.SUGGESTION_SELECT,
				suggestion.source
			);
		},

		onValueSelectedHandler(currentValue = this.state.currentValue, ...cause) {
			const { onValueSelected, } = this.$props;
			if (onValueSelected) {
				this.$emit('valueSelected', currentValue, ...cause);
			}
		},

		// handleStateChange(changes) {
		//   const { isOpen, type } = changes;

		//   // if (type === Downshift.stateChangeTypes.mouseUp) {
		//   //   this.isOpen = isOpen;
		//   // }
		// },

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

		renderCancelIcon() {
			if (this.$props.showClear) {
				return this.$props.clearIcon || <CancelSvg />;
			}

			return null;
		},

		renderIcons() {
			return (
				<div>
					{this.$data.currentValue
						&& this.$props.showClear && (
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
		// let suggestionsList = [];
		// if (
		//   !this.$data.currentValue &&
		//   this.$props.defaultSuggestions &&
		//   this.$props.defaultSuggestions.length
		// ) {
		//   suggestionsList = this.$props.defaultSuggestions;
		// } else if (this.$data.currentValue) {
		//   suggestionsList = this.suggestions;
		// }

		// const { theme, renderSuggestions } = this.$props;
		return (
			<Container class={this.$props.className}>
				{this.$props.title && (
					<Title class={getClassName(this.$props.innerClass, 'title') || ''}>
						{this.$props.title}
					</Title>
				)}
				{this.$props.defaultSuggestions || this.$props.autosuggest ? (
					//           <Downshift
					//             id={`${this.$props.componentId}-downshift`}
					//             onChange={this.onSuggestionSelected}
					//             onStateChange={this.handleStateChange}
					//             isOpen={this.$data.isOpen}
					//             itemToString={i => i}
					//             render={({
					//  getInputProps, getItemProps, isOpen, highlightedIndex,
					// }) => (
					<div class={suggestionsContainer}>
						<Input
							id={`${this.$props.componentId}-input`}
							showIcon={this.$props.showIcon}
							showClear={this.$props.showClear}
							iconPosition={this.$props.iconPosition}
							innerRef={this.$props.innerRef}
							// {...getInputProps({
							//   className: getClassName(this.$props.innerClass, 'input'),
							//   placeholder: this.$props.placeholder,
							//   value: this.$data.currentValue === null ? '' : this.$data.currentValue,
							//   onChange: this.onInputChange,
							//   onBlur: this.$props.onBlur,
							//   onFocus: this.handleFocus,
							//   onKeyPress: this.$props.onKeyPress,
							//   onKeyDown: e => this.handleKeyDown(e, highlightedIndex),
							//   onKeyUp: this.$props.onKeyUp,
							// })}
							themePreset={this.themePreset}
						/>
						{this.renderIcons()}
						{/* {renderSuggestions &&
                  renderSuggestions({
                    currentValue: this.$data.currentValue,
                    isOpen,
                    getItemProps,
                    highlightedIndex,
                    suggestions: this.suggestions,
                    parsedSuggestions: suggestionsList,
                  })} */}

						{/* {!renderSuggestions && isOpen && suggestionsList.length ? (
                  <ul
                    class={`${suggestions(this.themePreset, theme)} ${getClassName(
                      this.$props.innerClass,
                      'list',
                    )}`}
                  >
                    {suggestionsList.slice(0, 10).map((item, index) => (
                      <li
                        {...getItemProps({
                          item,
                        })}
                        key={`${index + 1}-${item.value}`}
                        style={{
                          backgroundColor: this.getBackgroundColor(highlightedIndex, index),
                        }}
                      >
                        {typeof item.label === 'string' ? (
                          <div
                            class="trim"
                            dangerouslySetInnerHTML={{
                              __html: item.label,
                            }}
                          />
                        ) : (
                          item.label
                        )}
                      </li>
                    ))}
                  </ul>
                ) : null} */}
					</div>
				) : (
					//   )}
					// />
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
			fields = [props.dataField,];
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

	return finalQuery;
};
DataSearch.shouldQuery = (value, dataFields, props) => {
	const fields = dataFields.map(
		(field, index) =>
			`${field}${
				Array.isArray(props.fieldWeights) && props.fieldWeights[index]
					? `^${props.fieldWeights[index]}`
					: ''
			}`
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
	const highlightField = props.highlightField
		? props.highlightField
		: props.dataField;

	if (typeof highlightField === 'string') {
		fields[highlightField] = {};
	} else if (Array.isArray(highlightField)) {
		highlightField.forEach(item => {
			fields[item] = {};
		});
	}

	return {
		highlight: {
			pre_tags: ['<mark>',],
			post_tags: ['</mark>',],
			fields,
		},
	};
};

const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	suggestions:
		state.hits[props.componentId] && state.hits[props.componentId].hits,
	themePreset: state.config.themePreset,
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
	mapDispatchtoProps
)(DataSearch);

DataSearch.install = function(Vue) {
	Vue.component(DataSearch.name, DSConnected);
};
export default DataSearch;
