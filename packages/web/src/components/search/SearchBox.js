/** @jsx jsx */
import { componentTypes, queryTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';
import { jsx } from '@emotion/core';
import { withTheme } from 'emotion-theming';
import causes from '@appbaseio/reactivecore/lib/utils/causes';
import { debounce, checkValueChange, getClassName, getResultStats, withClickIds } from '@appbaseio/reactivecore/lib/utils/helper';
import Downshift from 'downshift';
import hoistNonReactStatics from 'hoist-non-react-statics';
import React, { Component } from 'react';
import types from '@appbaseio/reactivecore/lib/utils/types';
import {
	updateQuery,
	recordSuggestionClick,
	fetchSuggestions,
} from '@appbaseio/reactivecore/lib/actions';
import ComponentWrapper from '../basic/ComponentWrapper';
import InputGroup from '../../styles/InputGroup';
import InputWrapper from '../../styles/InputWrapper';
import InputAddon from '../../styles/InputAddon';
import IconGroup from '../../styles/IconGroup';
import IconWrapper from '../../styles/IconWrapper';
import SearchSvg from '../shared/SearchSvg';
import Container from '../../styles/Container';
import Title from '../../styles/Title';
import Input, { suggestions, suggestionsContainer } from '../../styles/Input';
import SuggestionItem from './addons/SuggestionItem';
import { connect, getComponent, handleCaretPosition, isFunction, suggestionTypes } from '../../utils';
import Mic from './addons/Mic';
import CancelSvg from '../shared/CancelSvg';
import CustomSvg from '../shared/CustomSvg';
import SuggestionWrapper from './addons/SuggestionWrapper';


class SearchBox extends Component {
	constructor(props) {
		super(props);
		const { value, defaultValue } = props;
		const currentValue = value || defaultValue || '';
		this.state = {
			currentValue, // decide whether to keep it or not
			isOpen: false,
		};
		this.internalComponent = getInternalComponentID(props.componentId);
		/**
		 * To regulate the query execution based on the input handler,
		 * the component query will only get executed when it sets to `true`.
		 * */
		this.isPending = false;
		const hasMounted = false;
		const cause = null;
		if (currentValue) {
			if (props.onChange) {
				props.onChange(currentValue, this.triggerQuery);
			}
		}
		this.setValue(currentValue, true, props, cause, hasMounted);
	}

	componentDidMount() {}

	get stats() {
		return getResultStats(this.props);
	}

	get parsedSuggestions() {
		return withClickIds(this.props.suggestions);
	}

	triggerClickAnalytics = (searchPosition, documentId) => {
		let docId = documentId;
		if (!docId) {
			const hitData = this.parsedSuggestions.find(hit => hit._click_id === searchPosition);
			if (hitData && hitData.source && hitData.source._id) {
				docId = hitData.source._id;
			}
		}
		this.props.triggerAnalytics(searchPosition, docId);
	};

	withTriggerQuery = (func) => {
		if (func) {
			return e => func(e, this.triggerQuery);
		}
		return undefined;
	};

	triggerDefaultQuery = () => {
		this.props.fetchSuggestions(this.internalComponent, this.state.currentValue);
	};

	triggerCustomQuery = () => {
		const {
			componentId, filterLabel, showFilter, URLParams,
		} = this.props;
		const { currentValue: value } = this.state;
		console.log('triggered custom query');
		this.props.updateQuery({
			componentId,
			query: {
				query: {},
			},
			value,
			label: filterLabel,
			showFilter,
			URLParams,
			componentType: componentTypes.dataSearch,
		});
	};

	triggerQuery = ({ isOpen = false, customQuery = false, defaultQuery = false }) => {
		this.isPending = false;
		if (isOpen) {
			this.setState({ isOpen });
		}
		if (defaultQuery) {
			this.triggerDefaultQuery();
		}

		if (customQuery) {
			this.triggerCustomQuery();
		}
	};

	onSuggestionSelected = (suggestion) => {
		const { value, onChange } = this.props;
		this.setState({
			isOpen: false,
		});
		if (value === undefined) {
			this.setValue(suggestion.value, true, this.props, causes.SUGGESTION_SELECT);
		} else if (onChange) {
			this.isPending = false;
			onChange(suggestion.value, this.triggerQuery);
		}
		// Record analytics for selected suggestions
		this.triggerClickAnalytics(suggestion._click_id);
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
			// handle caret position in controlled components
			handleCaretPosition(e);
			onChange(inputValue, this.triggerQuery, e);
		}
	};

	handleTextChange = debounce(() => {
		if (this.props.autosuggest) {
			this.triggerDefaultQuery();
		} else {
			this.triggerCustomQuery();
		}
	}, this.props.debounce);

	handleKeyDown = (event, highlightedIndex) => {
		const { value, onChange } = this.props;
		if (value !== undefined && onChange) {
			this.isPending = true;
		}
		// if a suggestion was selected, delegate the handling
		// to suggestion handler
		if (event.key === 'Enter' && highlightedIndex === null) {
			this.setValue(event.target.value, true);
			this.onValueSelected(event.target.value, causes.ENTER_PRESS);
		}
		if (this.props.onKeyDown) {
			this.props.onKeyDown(event, this.triggerQuery);
		}
	};

	clearValue = () => {
		this.isPending = false;
		const { onChange } = this.props;
		this.setValue('', true);
		if (onChange) {
			onChange('', this.triggerQuery);
		}
		this.onValueSelected('', causes.CLEAR_VALUE, null);
	};

	setValue = (
		value,
		isDefaultValue = false,
		props = this.props,
		cause,
		hasMounted = true,
		toggleIsOpen = true,
	) => {
		const performUpdate = () => {
			if (hasMounted) {
				// if (!value && autosuggest) {
				// 	this.triggerQuery({
				// 		isOpen: toggleIsOpen ? !this.state.isOpen : this.state.isOpen,
				// 		defaultQuery: true,
				// 	});
				// }
				this.setState(
					{
						currentValue: value,
					},
					() => {
						if (isDefaultValue) {
							if (this.props.autosuggest) {
								this.triggerQuery({
									...(toggleIsOpen && { isOpen: !this.state.isOpen }),
									defaultQuery: true,
								});
							}
							// in case of strict selection only SUGGESTION_SELECT should be able
							// to set the query otherwise the value should reset
							if (props.strictSelection) {
								if (cause === causes.SUGGESTION_SELECT || value === '') {
									this.triggerCustomQuery();
								} else {
									this.setValue('', true);
								}
							} else {
								this.triggerCustomQuery();
							}
						} else {
							// debounce for handling text while typing
							this.handleTextChange();
						}
						if (props.onValueChange) props.onValueChange(value);
					},
				);
			} else {
				this.triggerQuery({
					defaultQuery: this.props.autosuggest,
					customQuery: true,
				});
				if (props.onValueChange) props.onValueChange(value);
			}
		};
		checkValueChange(props.componentId, value, props.beforeValueChange, performUpdate);
	};

	shouldMicRender(showVoiceSearch) {
		// checks for SSR
		if (typeof window === 'undefined') return false;
		return showVoiceSearch && (window.webkitSpeechRecognition || window.SpeechRecognition);
	}
	handleStateChange = (changes) => {
		const { isOpen, type } = changes;
		if (type === Downshift.stateChangeTypes.mouseUp && isOpen !== undefined) {
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
			this.onValueSelected(currentValue, causes.SEARCH_ICON_CLICK);
		}
	};

	handleVoiceResults = ({ results }) => {
		if (
			results
			&& results[0]
			&& results[0].isFinal
			&& results[0][0]
			&& results[0][0].transcript
			&& results[0][0].transcript.trim()
		) {
			this.isPending = false;
			this.setValue(results[0][0].transcript.trim(), true);
		}
	};
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
		const { error, isLoading, rawData } = this.props;
		const { currentValue } = this.state;
		const data = {
			error,
			loading: isLoading,
			downshiftProps,
			data: this.props.suggestions,
			value: currentValue,
			triggerClickAnalytics: this.triggerClickAnalytics,
			resultStats: this.stats,
			rawData,
		};
		return getComponent(data, this.props);
	};

	renderInputAddonBefore = () => {
		const { addonBefore } = this.props;
		if (addonBefore) {
			return <InputAddon>{addonBefore}</InputAddon>;
		}

		return null;
	};

	renderInputAddonAfter = () => {
		const { addonAfter } = this.props;
		if (addonAfter) {
			return <InputAddon>{addonAfter}</InputAddon>;
		}

		return null;
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

	renderIcons = () => {
		const {
			showIcon,
			showClear,
			renderMic,
			getMicInstance,
			showVoiceSearch,
			iconPosition,
			innerClass,
		} = this.props;
		return (
			<div>
				<IconGroup groupPosition="right" positionType="absolute">
					{this.state.currentValue && showClear && (
						<IconWrapper onClick={this.clearValue} showIcon={showIcon} isClearIcon>
							{this.renderCancelIcon()}
						</IconWrapper>
					)}
					{this.shouldMicRender(showVoiceSearch) && (
						<Mic
							getInstance={getMicInstance}
							render={renderMic}
							onResult={this.handleVoiceResults}
							className={getClassName(innerClass, 'mic') || null}
						/>
					)}
					{iconPosition === 'right' && (
						<IconWrapper onClick={this.handleSearchIconClick}>
							{this.renderIcon()}
						</IconWrapper>
					)}
				</IconGroup>

				<IconGroup groupPosition="left" positionType="absolute">
					{iconPosition === 'left' && (
						<IconWrapper onClick={this.handleSearchIconClick}>
							{this.renderIcon()}
						</IconWrapper>
					)}
				</IconGroup>
			</div>
		);
	};
	handleFocus = (event) => {
		this.setState({
			isOpen: true,
		});
		if (this.props.onFocus) {
			this.props.onFocus(event, this.triggerQuery);
		}
	};
	render() {
		const { currentValue } = this.state;
		const suggestionsList = this.parsedSuggestions;
		const {
			theme,
			themePreset,
			recentSearchesIcon,
			popularSearchesIcon,
			innerClass,
		} = this.props;
		const hasSuggestions = !!this.props.defaultSuggestions || !!suggestionsList;

		return (
			<Container style={this.props.style} className={this.props.className}>
				{this.props.title && (
					<Title className={getClassName(this.props.innerClass, 'title') || null}>
						{this.props.title}
					</Title>
				)}
				{hasSuggestions || this.props.autosuggest ? (
					<Downshift
						id={`${this.props.componentId}-downshift`}
						onChange={this.onSuggestionSelected}
						onStateChange={this.handleStateChange}
						isOpen={this.state.isOpen}
						itemToString={i => i}
						render={({
							getRootProps,
							getInputProps,
							getItemProps,
							isOpen,
							highlightedIndex,
							setHighlightedIndex,
							...rest
						}) => {
							const renderSuggestionsDropdown = () => {
								const getIcon = (iconType) => {
									switch (iconType) {
										case suggestionTypes.Recent:
											return recentSearchesIcon;
										case suggestionTypes.Popular:
											return popularSearchesIcon;
										default:
											return null;
									}
								};
								return (
									<React.Fragment>
										{this.hasCustomRenderer
											&& this.getComponent({
												getInputProps,
												getItemProps,
												isOpen,
												highlightedIndex,
												setHighlightedIndex,
												...rest,
											})}
										{isOpen && this.renderLoader()}
										{isOpen && this.renderError()}
										{!this.hasCustomRenderer && isOpen && hasSuggestions ? (
											<ul
												css={suggestions(themePreset, theme)}
												className={getClassName(
													this.props.innerClass,
													'list',
												)}
											>
												{suggestionsList.map((item, index) => (
													<li
														{...getItemProps({ item })}
														key={`${index + 1}-${item.value}`}
														style={{
															backgroundColor: this.getBackgroundColor(
																highlightedIndex,
																index,
															),
															justifyContent: 'flex-start',
															alignItems: 'center',
														}}
													>
														{/* eslint-disable */}
														{item._suggestion_type !==
														suggestionTypes.Index ? (
															<div
																style={{
																	padding: '0 10px 0 0',
																	display: 'flex',
																}}
															>
																<CustomSvg
																	iconId={`${index + 1}-${
																		item.value
																	}-icon`}
																	className={
																		getClassName(
																			innerClass,
																			`${item._suggestion_type}-search-icon`,
																		) || null
																	}
																	icon={getIcon(
																		item._suggestion_type,
																	)}
																	type={`${item._suggestion_type}-search-icon`}
																/>
															</div>
														) : null}
														{/* eslint-enable */}
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
									</React.Fragment>
								);
							};

							return (
								<div
									{...getRootProps(
										{ css: suggestionsContainer },
										{ suppressRefError: true },
									)}
								>
									<InputGroup>
										{this.renderInputAddonBefore()}
										<InputWrapper>
											<Input
												aria-label={this.props.componentId}
												id={`${this.props.componentId}-input`}
												showIcon={this.props.showIcon}
												showClear={this.props.showClear}
												iconPosition={this.props.iconPosition}
												ref={(c) => {
													this._inputRef = c;
												}}
												{...getInputProps({
													className: getClassName(
														this.props.innerClass,
														'input',
													),
													placeholder: this.props.placeholder,
													value:
														this.state.currentValue === null
															? ''
															: this.state.currentValue,
													onChange: this.onInputChange,
													onBlur: this.withTriggerQuery(
														this.props.onBlur,
													),
													onFocus: this.handleFocus,
													onClick: () => {
														// clear highlighted index
														setHighlightedIndex(null);
													},
													onKeyPress: this.withTriggerQuery(
														this.props.onKeyPress,
													),
													onKeyDown: e =>
														this.handleKeyDown(e, highlightedIndex),
													onKeyUp: this.withTriggerQuery(
														this.props.onKeyUp,
													),
													autoFocus: this.props.autoFocus,
												})}
												themePreset={themePreset}
												type={this.props.type}
											/>
											{this.renderIcons()}
											{!this.props.expandSuggestionsContainer
												&& renderSuggestionsDropdown(
													getRootProps,
													getInputProps,
													getItemProps,
													isOpen,
													highlightedIndex,
													setHighlightedIndex,
													...rest,
												)}
										</InputWrapper>
										{this.renderInputAddonAfter()}
									</InputGroup>

									{this.props.expandSuggestionsContainer
										&& renderSuggestionsDropdown(
											getRootProps,
											getInputProps,
											getItemProps,
											isOpen,
											highlightedIndex,
											setHighlightedIndex,
											...rest,
										)}
								</div>
							);
						}}
						{...this.props.downShiftProps}
					/>
				) : (
					<div css={suggestionsContainer}>
						<InputGroup>
							{this.renderInputAddonBefore()}
							<InputWrapper>
								<Input
									aria-label={this.props.componentId}
									className={getClassName(this.props.innerClass, 'input') || null}
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
									showIcon={this.props.showIcon}
									showClear={this.props.showClear}
									themePreset={themePreset}
								/>
								{this.renderIcons()}
							</InputWrapper>
							{this.renderInputAddonAfter()}
						</InputGroup>
					</div>
				)}
			</Container>
		);
	}
}

SearchBox.propTypes = {
	updateQuery: types.funcRequired,
	selectedValue: types.selectedValue,
	suggestions: types.suggestions,
	triggerAnalytics: types.funcRequired,
	error: types.title,
	isLoading: types.bool,
	time: types.number,
	enableAppbase: types.bool,
	rawData: types.rawData,
	// component props
	autoFocus: types.bool,
	autosuggest: types.bool,
	enableSynonyms: types.bool,
	distinctField: types.string,
	distinctFieldConfig: types.componentObject,
	index: types.string,
	enablePopularSuggestions: types.bool,
	enableRecentSuggestions: types.bool,
	queryString: types.bool,
	beforeValueChange: types.func,
	className: types.string,
	clearIcon: types.children,
	componentId: types.stringRequired,
	customHighlight: types.func,
	customQuery: types.func,
	defaultQuery: types.func,
	dataField: types.dataFieldValidator,
	aggregationField: types.string,
	aggregationSize: types.number,
	size: types.number,
	debounce: types.number,
	defaultValue: types.string,
	value: types.string,
	defaultSuggestions: types.suggestions,
	customData: types.title,
	downShiftProps: types.props,
	children: types.func,
	excludeFields: types.excludeFields,
	fieldWeights: types.fieldWeights,
	filterLabel: types.string,
	fuzziness: types.fuzziness,
	highlight: types.bool,
	highlightField: types.stringOrArray,
	icon: types.children,
	iconPosition: types.iconPosition,
	innerClass: types.style,
	includeFields: types.includeFields,
	loader: types.title,
	nestedField: types.string,
	onError: types.func,
	onBlur: types.func,
	onFocus: types.func,
	onKeyDown: types.func,
	onKeyPress: types.func,
	onKeyUp: types.func,
	onQueryChange: types.func,
	onValueChange: types.func,
	onChange: types.func,
	onValueSelected: types.func,
	placeholder: types.string,
	queryFormat: types.queryFormatSearch,
	react: types.react,
	render: types.func,
	renderError: types.title,
	renderNoSuggestion: types.title,
	showClear: types.bool,
	showDistinctSuggestions: types.bool,
	showFilter: types.bool,
	showIcon: types.bool,
	showVoiceSearch: types.bool,
	style: types.style,
	title: types.title,
	theme: types.style,
	themePreset: types.themePreset,
	type: types.string,
	URLParams: types.bool,
	strictSelection: types.bool,
	searchOperators: types.bool,
	enablePredictiveSuggestions: types.bool,
	recentSearchesIcon: types.componentObject,
	popularSearchesIcon: types.componentObject,
	// Mic props
	getMicInstance: types.func,
	renderMic: types.func,
	//
	focusShortcuts: types.focusShortcuts,
	addonBefore: types.children,
	addonAfter: types.children,
	expandSuggestionsContainer: types.bool,
	popularSuggestionsConfig: types.componentObject,
	recentSuggestionsConfig: types.componentObject,
	applyStopwords: types.bool,
	customStopwords: types.stringArray,
	onData: types.func,
	fetchSuggestions: types.func.isRequired,
};

SearchBox.defaultProps = {
	autosuggest: true,
	className: null,
	debounce: 0,
	downShiftProps: {},
	enableSynonyms: true,
	enablePopularSuggestions: false,
	excludeFields: [],
	iconPosition: 'left',
	includeFields: ['*'],
	placeholder: 'Search',
	queryFormat: 'or',
	showFilter: true,
	showIcon: true,
	showVoiceSearch: false,
	style: {},
	URLParams: false,
	showClear: false,
	showDistinctSuggestions: true,
	strictSelection: false,
	searchOperators: false,
	size: 10,
	enablePredictiveSuggestions: false,
	time: 0,
	focusShortcuts: ['/'],
	addonBefore: undefined,
	addonAfter: undefined,
	expandSuggestionsContainer: true,
	suggestions: [],
};

const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	suggestions: state.suggestions[`${props.componentId}__internal`],
	rawData: state.rawData[props.componentId],
	aggregationData: state.compositeAggregations[props.componentId],
	themePreset: state.config.themePreset,
	isLoading: !!state.isLoading[`${props.componentId}_active`],
	error: state.error[props.componentId],
	enableAppbase: state.config.enableAppbase,
	time: state.hits[props.componentId] && state.hits[props.componentId].time,
	total: state.hits[props.componentId] && state.hits[props.componentId].total,
	hidden: state.hits[props.componentId] && state.hits[props.componentId].hidden,
});

const mapDispatchtoProps = dispatch => ({
	fetchSuggestions: (componentId, value) => dispatch(fetchSuggestions(componentId, value)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	triggerAnalytics: (searchPosition, documentId) =>
		dispatch(recordSuggestionClick(searchPosition, documentId)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(
	withTheme(props => (
		<ComponentWrapper {...props} internalComponent componentType={componentTypes.searchBox}>
			{() => <SearchBox ref={props.myForwardedRef} {...props} />}
		</ComponentWrapper>
	)),
);


// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, SearchBox);

ForwardRefComponent.displayName = 'SearchBox';
export default ForwardRefComponent;
