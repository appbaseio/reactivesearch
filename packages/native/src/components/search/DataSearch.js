import React, { Component } from 'react';
import { Platform, View, Modal, TouchableWithoutFeedback } from 'react-native';
import { Input, Item, List, ListItem, Text, Button, Header, Left, Right, Icon } from 'native-base';

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
	getInnerKey,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';
import getSuggestions from '@appbaseio/reactivecore/lib/utils/suggestions';

import withTheme from '../../theme/withTheme';
import { connect } from '../../utils';

class DataSearch extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: '',
			suggestions: [],
			showModal: false,
		};
		this.internalComponent = `${this.props.componentId}__internal`;
		props.setQueryListener(props.componentId, props.onQueryChange, null);
	}

	componentDidMount() {
		this.props.addComponent(this.props.componentId);
		this.props.addComponent(this.internalComponent);

		if (this.props.highlight) {
			const queryOptions = this.highlightQuery(this.props) || {};
			queryOptions.size = 20;
			this.props.setQueryOptions(this.props.componentId, queryOptions);
		} else {
			this.props.setQueryOptions(this.props.componentId, {
				size: 20,
			});
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
			['highlight', 'dataField', 'highlightField'],
			() => {
				const queryOptions = this.highlightQuery(nextProps) || {};
				queryOptions.size = 20;
				this.props.setQueryOptions(nextProps.componentId, queryOptions);
			},
		);

		checkPropChange(this.props.react, nextProps.react, () => this.setReact(nextProps));

		if (Array.isArray(nextProps.suggestions) && this.state.currentValue.trim().length) {
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
			['fieldWeights', 'fuzziness', 'queryFormat', 'dataField'],
			() => {
				this.updateQuery(nextProps.componentId, this.state.currentValue, nextProps);
			},
		);

		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.setValue(nextProps.defaultSelected, true, nextProps);
		} else if (this.props.selectedValue !== nextProps.selectedValue) {
			this.setValue(nextProps.selectedValue || '', true, nextProps);
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

		if (typeof highlightField === 'string') {
			fields[highlightField] = {};
		} else if (Array.isArray(highlightField)) {
			highlightField.forEach((item) => {
				fields[item] = {};
			});
		}

		return {
			highlight: {
				pre_tags: ['<em>'],
				post_tags: ['</em>'],
				fields,
			},
		};
	};

	defaultQuery = (value, props) => {
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
		}

		if (value === '') {
			finalQuery = {
				match_all: {},
			};
		}

		return finalQuery;
	};

	shouldQuery = (value, dataFields, props) => {
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
		const fields = Array.isArray(this.props.dataField)
			? this.props.dataField
			: [this.props.dataField];

		return getSuggestions(fields, results, this.state.currentValue.toLowerCase());
	};

	setValue = (value, isDefaultValue = false, props = this.props) => {
		const performUpdate = () => {
			this.setState({
				currentValue: value,
			});
			if (isDefaultValue) {
				if (props.autosuggest) {
					this.updateQuery(this.internalComponent, value, props);
				}
				this.updateQuery(props.componentId, value, props);
			} else {
				// debounce for handling text while typing
				this.handleTextChange(value);
			}
			if (props.onValueChange) props.onValueChange(value);
		};
		checkValueChange(props.componentId, value, props.beforeValueChange, performUpdate);
	};

	handleTextChange = debounce((value) => {
		if (this.props.autosuggest) {
			this.updateQuery(this.internalComponent, value, this.props);
		} else {
			this.updateQuery(this.props.componentId, value, this.props);
		}
	}, this.props.debounce);

	handleUserSelection = (value) => {
		if (this.props.onValueSelected) this.props.onValueSelected(value);
		this.selectSuggestion(value.label);
	}

	selectSuggestion = (value) => {
		this.setState({
			suggestions: [],
		});
		this.setValue(value, true);
		this.toggleModal();
	};

	setSuggestions = () => {
		let suggestions = [];
		if (this.state.currentValue.trim() !== '') {
			suggestions = this.onSuggestions(this.props.suggestions);
		}

		this.setState({
			suggestions,
		});
	};

	toggleModal = () => {
		this.setState({
			showModal: !this.state.showModal,
		});
	};

	updateQuery = (componentId, value, props) => {
		const query = props.customQuery || this.defaultQuery;

		props.updateQuery({
			componentId,
			query: query(value, props),
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: false,
		});
	};

	renderSuggestions() {
		let suggestionsList = [];

		if (
			!this.state.currentValue
			&& this.props.defaultSuggestions
			&& this.props.defaultSuggestions.length
		) {
			suggestionsList = this.props.defaultSuggestions;
		} else if (this.state.currentValue) {
			suggestionsList = this.state.suggestions;
		}

		return (
			<List
				dataArray={suggestionsList}
				keyboardShouldPersistTaps="always"
				renderRow={item => (
					<ListItem
						onPress={() => this.handleUserSelection(item)}
						{...getInnerKey(this.props.innerProps, 'listItem')}
					>
						<Text
							style={getInnerKey(this.props.innerStyle, 'label')}
							{...getInnerKey(this.props.innerProps, 'text')}
						>
							{item.label}
						</Text>
					</ListItem>
				)}
				{...getInnerKey(this.props.innerProps, 'list')}
			/>
		);
	}

	renderDataSearch = (style) => {
		if (this.state.showModal) {
			return (
				<Modal
					supportedOrientations={this.props.supportedOrientations || null}
					transparent={false}
					visible={this.state.showModal}
					onRequestClose={this.toggleModal}
					{...getInnerKey(this.props.innerProps, 'modal')}
				>
					<Header {...getInnerKey(this.props.innerProps, 'header')}>
						<Left style={getInnerKey(this.props.innerStyle, 'left')}>
							<Button
								transparent
								onPress={this.toggleModal}
								style={getInnerKey(this.props.innerStyle, 'button')}
								{...getInnerKey(this.props.innerProps, 'button')}
							>
								<Icon
									name="arrow-back"
									style={{
										...Platform.select({
											android: {
												color: '#fff',
											},
											ios: {
												color: this.props.theming.primaryColor,
											},
										}),
										...getInnerKey(this.props.innerStyle, 'icon'),
									}}
									{...getInnerKey(this.props.innerProps, 'icon')}
								/>
							</Button>
						</Left>
						{this.state.currentValue ? (
							<Right style={getInnerKey(this.props.innerStyle, 'right')}>
								<Button
									style={{
										paddingRight: 0,
										...getInnerKey(this.props.innerStyle, 'button'),
									}}
									transparent
									onPress={() => this.selectSuggestion('')}
									{...getInnerKey(this.props.innerProps, 'button')}
								>
									<Text
										style={{
											...Platform.select({
												android: {
													color: '#fff',
												},
											}),
										}}
										{...getInnerKey(this.props.innerProps, 'text')}
									>
										Reset
									</Text>
								</Button>
							</Right>
						) : (
							<Right style={getInnerKey(this.props.innerStyle, 'right')} />
						)}
					</Header>
					<Item
						regular
						style={{ marginLeft: 10, margin: 10 }}
						{...getInnerKey(this.props.innerProps, 'item')}
					>
						{this.props.showIcon && this.props.iconPosition === 'left' ? (
							<Icon
								name="search"
								style={{
									fontSize: 22,
									top: 2,
									...getInnerKey(this.props.innerStyle, 'icon'),
								}}
							/>
						) : null}
						<Input
							style={{
								color: this.props.theming.textColor,
								...style,
								...getInnerKey(this.props.innerStyle, 'input'),
							}}
							returnKeyType="search"
							onSubmitEditing={e => this.selectSuggestion(e.nativeEvent.text)}
							placeholder={this.props.placeholder}
							onChangeText={this.setValue}
							value={this.state.currentValue}
							onFocus={this.setSuggestions}
							autoFocus
							{...getInnerKey(this.props.innerProps, 'input')}
						/>
						{this.props.showIcon && this.props.iconPosition === 'right' ? (
							<Icon
								name="search"
								style={{
									fontSize: 22,
									top: 2,
									...getInnerKey(this.props.innerStyle, 'icon'),
								}}
								{...getInnerKey(this.props.innerProps, 'icon')}
							/>
						) : null}
					</Item>
					{this.renderSuggestions()}
				</Modal>
			);
		}

		return (
			<Item regular style={{ marginLeft: 0 }} {...getInnerKey(this.props.innerProps, 'item')}>
				{this.props.showIcon && this.props.iconPosition === 'left' ? (
					<Icon
						name="search"
						style={{
							fontSize: 22,
							top: 2,
							...getInnerKey(this.props.innerStyle, 'icon'),
						}}
					/>
				) : null}
				<TouchableWithoutFeedback onPress={this.toggleModal}>
					<Text
						numberOfLines={1}
						ellipsizeMode="tail"
						style={{
							flex: 1,
							alignItems: 'center',
							color:
								this.state.currentValue && this.state.currentValue !== ''
									? this.props.theming.textColor
									: '#555',
							fontSize: 17,
							height: 50,
							lineHeight: 24,
							paddingLeft: 8,
							paddingRight: 5,
							paddingTop: 13,
							...style,
							...getInnerKey(this.props.innerStyle, 'input'),
						}}
						{...getInnerKey(this.props.innerProps, 'text')}
					>
						{this.state.currentValue && this.state.currentValue !== ''
							? this.state.currentValue
							: this.props.placeholder}
					</Text>
				</TouchableWithoutFeedback>
				{this.props.showIcon && this.props.iconPosition === 'right' ? (
					<Icon
						name="search"
						style={{
							fontSize: 22,
							top: 2,
							...getInnerKey(this.props.innerStyle, 'icon'),
						}}
						{...getInnerKey(this.props.innerProps, 'icon')}
					/>
				) : null}
			</Item>
		);
	};

	clearValue = () => {
		this.setValue('', true);
	};

	render() {
		let style = {};

		if (this.props.showIcon) {
			if (this.props.iconPosition === 'left') {
				style = {
					paddingLeft: 0,
				};
			} else {
				style = {
					paddingRight: 0,
				};
			}
		}

		return (
			<View style={this.props.style}>
				{this.props.defaultSuggestions || this.props.autosuggest ? (
					this.renderDataSearch(style)
				) : (
					<Item
						regular
						style={{ marginLeft: 0 }}
						{...getInnerKey(this.props.innerProps, 'item')}
					>
						{this.props.showIcon && this.props.iconPosition === 'left' ? (
							<Icon
								name="search"
								style={{
									fontSize: 22,
									top: 2,
									...getInnerKey(this.props.innerStyle, 'icon'),
								}}
								{...getInnerKey(this.props.innerProps, 'icon')}
							/>
						) : null}
						<Input
							style={{
								color: this.props.theming.textColor,
								...style,
								...getInnerKey(this.props.innerStyle, 'input'),
							}}
							placeholder={this.props.placeholder}
							onChangeText={this.setValue}
							value={this.state.currentValue}
							autoFocus={this.props.autoFocus}
							{...getInnerKey(this.props.innerProps, 'input')}
						/>
						{this.state.currentValue && this.props.showClear ? (
							<Button
								transparent
								onPress={this.clearValue}
								style={getInnerKey(this.props.innerStyle, 'button')}
								{...getInnerKey(this.props.innerProps, 'button')}
							>
								<Icon
									name="md-close"
									style={{
										fontSize: 22,
										top: 3,
										color: '#666',
										marginLeft: 10,
										marginRight:
											this.props.showIcon
											&& this.props.iconPosition === 'right'
												? 0
												: 10,
										...getInnerKey(this.props.innerStyle, 'icon'),
									}}
									{...getInnerKey(this.props.innerProps, 'icon')}
								/>
							</Button>
						) : null}
						{this.props.showIcon && this.props.iconPosition === 'right' ? (
							<Icon
								name="search"
								style={{
									fontSize: 22,
									top: 2,
									...getInnerKey(this.props.innerStyle, 'icon'),
								}}
								{...getInnerKey(this.props.innerProps, 'icon')}
							/>
						) : null}
					</Item>
				)}
			</View>
		);
	}
}

DataSearch.propTypes = {
	componentId: types.stringRequired,
	addComponent: types.funcRequired,
	highlight: types.bool,
	setQueryOptions: types.funcRequired,
	defaultSelected: types.string,
	dataField: types.dataFieldArray,
	highlightField: types.stringOrArray,
	react: types.react,
	suggestions: types.suggestions,
	defaultSuggestions: types.suggestions,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	fieldWeights: types.fieldWeights,
	queryFormat: types.queryFormatSearch,
	fuzziness: types.fuzziness,
	autosuggest: types.bool,
	beforeValueChange: types.func,
	onValueChange: types.func,
	customQuery: types.func,
	onQueryChange: types.func,
	updateQuery: types.funcRequired,
	placeholder: types.string,
	selectedValue: types.selectedValue,
	showFilter: types.bool,
	filterLabel: types.string,
	style: types.style,
	debounce: types.number,
	supportedOrientations: types.supportedOrientations,
	autoFocus: types.bool,
	showIcon: types.bool,
	iconPosition: types.string,
	showClear: types.bool,
	theming: types.style,
	innerStyle: types.style,
	innerProps: types.props,
};

DataSearch.defaultProps = {
	placeholder: 'Search',
	showIcon: true,
	iconPosition: 'left',
	autoFocus: false,
	autosuggest: true,
	queryFormat: 'or',
	showFilter: true,
	style: {},
	debounce: 0,
	showClear: true,
};

const mapStateToProps = (state, props) => ({
	suggestions: state.hits[props.componentId] && state.hits[props.componentId].hits,
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
});

export default connect(
	mapStateToProps,
	mapDispatchtoProps,
)(withTheme(DataSearch));
