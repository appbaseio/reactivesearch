/* eslint-disable */
import React, { Component } from 'react';
import { View, Modal, ListView, TouchableWithoutFeedback } from 'react-native';
import { CheckBox, Text, Body, Item, Header, Left, Button, Icon, Title, Right } from 'native-base';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryListener,
} from '@appbaseio/reactivecore/lib/actions';
import {
	isEqual,
	checkValueChange,
	checkPropChange,
	getClassName,
	getInnerKey,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';

import withTheme from '../../theme/withTheme';
import { connect } from '../../utils';

class MultiDropdownRange extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: [],
			showModal: false,
		};

		this.ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) =>
				r1.start !== r2.start || r1.end !== r2.end || r1.label !== r2.label,
		});

		// selectedValues hold the selected items as keys for O(1) complexity
		this.selectedValues = {};
		this.type = 'range';
		this.locked = false;
		props.setQueryListener(props.componentId, props.onQueryChange, null);
	}

	componentDidMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);

		if (this.props.selectedValue) {
			this.selectItem(this.props.selectedValue, true);
		} else if (this.props.defaultSelected) {
			this.selectItem(this.props.defaultSelected, true);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(this.props.react, nextProps.react, () => this.setReact(nextProps));

		checkPropChange(this.props.dataField, nextProps.dataField, () => {
			this.updateQuery(this.state.currentValue, nextProps);
		});

		if (!isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			this.selectItem(nextProps.defaultSelected, true);
		} else if (
			!isEqual(this.state.currentValue, nextProps.selectedValue) &&
			(nextProps.selectedValue || nextProps.selectedValue === null)
		) {
			this.selectItem(nextProps.selectedValue, true);
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	}

	setReact(props) {
		if (props.react) {
			props.watchComponent(props.componentId, props.react);
		}
	}

	defaultQuery = (values, props) => {
		const generateRangeQuery = (dataField, items) => {
			if (items.length > 0) {
				return items.map(value => ({
					range: {
						[dataField]: {
							gte: value.start,
							lte: value.end,
							boost: 2.0,
						},
					},
				}));
			}
			return null;
		};

		if (values && values.length) {
			const query = {
				bool: {
					should: generateRangeQuery(props.dataField, values),
					minimum_should_match: 1,
					boost: 1.0,
				},
			};
			return query;
		}
		return null;
	};

	selectItem = (item, isDefaultValue = false, props = this.props) => {
		// ignore state updates when component is locked
		if (props.beforeValueChange && this.locked) {
			return;
		}

		this.locked = true;
		let { currentValue } = this.state;

		if (!item) {
			currentValue = [];
			this.selectedValues = {};
		} else if (isDefaultValue) {
			// checking if the items in defaultSeleted exist in the data prop
			currentValue = props.data.filter(value => item.includes(value.label));
			currentValue.forEach(value => {
				this.selectedValues = { ...this.selectedValues, [value.label]: true };
			});
		} else if (this.selectedValues[item]) {
			currentValue = currentValue.filter(value => value.label !== item);
			const { [item]: del, ...selectedValues } = this.selectedValues;
			this.selectedValues = selectedValues;
		} else {
			const selectedItem = this.props.data.find(value => value.label === item);
			currentValue = [...currentValue, selectedItem];
			this.selectedValues = { ...this.selectedValues, [item]: true };
		}
		const performUpdate = () => {
			this.setState(
				{
					currentValue,
				},
				() => {
					this.updateQuery(currentValue, props);
					this.locked = false;
					if (props.onValueChange) props.onValueChange(currentValue);
				},
			);
		};

		checkValueChange(props.componentId, currentValue, props.beforeValueChange, performUpdate);
	};

	toggleModal = () => {
		this.setState({
			showModal: !this.state.showModal,
		});
	};

	updateQuery = (value, props) => {
		const query = props.customQuery || this.defaultQuery;

		props.updateQuery({
			componentId: props.componentId,
			query: query(value, props),
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: false,
		});
	};

	render() {
		const { color, ...checkBoxStyles } = getInnerKey(this.props.innerStyle, 'checkbox');
		return (
			<View>
				{this.state.showModal ? (
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
										color={this.props.theming.primaryColor}
										style={getInnerKey(this.props.innerStyle, 'icon')}
										{...getInnerKey(this.props.innerProps, 'icon')}
									/>
								</Button>
							</Left>
							<Body style={getInnerKey(this.props.innerStyle, 'body')}>
								<Title
									style={getInnerKey(this.props.innerStyle, 'title')}
									{...getInnerKey(this.props.innerProps, 'title')}
								>
									{this.props.placeholder}
								</Title>
							</Body>
							<Right style={getInnerKey(this.props.innerStyle, 'right')} />
						</Header>
						<ListView
							dataSource={this.ds.cloneWithRows(this.props.data)}
							enableEmptySections
							renderRow={item => (
								<TouchableWithoutFeedback
									onPress={() => this.selectItem(item.label)}
								>
									<View
										style={{
											flex: 1,
											flexDirection: 'row',
											padding: 15,
											borderBottomColor: '#c9c9c9',
											borderBottomWidth: 0.5,
										}}
									>
										<CheckBox
											onPress={() => this.selectItem(item.label)}
											checked={!!this.selectedValues[item.label]}
											color={color || this.props.theming.primaryColor}
											style={checkBoxStyles}
											{...getInnerKey(this.props.innerProps, 'checkbox')}
										/>
										<Text
											style={{
												color: this.props.theming.textColor,
												marginLeft: 20,
												...getInnerKey(this.props.innerStyle, 'label'),
											}}
											{...getInnerKey(this.props.innerProps, 'text')}
										>
											{item.label}
										</Text>
									</View>
								</TouchableWithoutFeedback>
							)}
							{...getInnerKey(this.props.innerProps, 'listView')}
						/>
					</Modal>
				) : (
					<Item
						regular
						style={{ marginLeft: 0 }}
						{...getInnerKey(this.props.innerProps, 'text')}
					>
						<TouchableWithoutFeedback onPress={this.toggleModal}>
							<Text
								numberOfLines={1}
								ellipsizeMode="tail"
								style={{
									flex: 1,
									alignItems: 'center',
									color: this.state.currentDate
										? this.props.theming.textColor
										: '#555',
									fontSize: 17,
									height: 50,
									lineHeight: 24,
									paddingLeft: 8,
									paddingRight: 5,
									paddingTop: 12,
									...getInnerKey(this.props.innerStyle, 'label'),
								}}
								{...getInnerKey(this.props.innerProps, 'text')}
							>
								{Object.keys(this.state.currentValue).length
									? this.state.currentValue.map(item => item.label).join(', ')
									: this.props.placeholder}
							</Text>
						</TouchableWithoutFeedback>
					</Item>
				)}
			</View>
		);
	}
}

MultiDropdownRange.propTypes = {
	addComponent: types.funcRequired,
	componentId: types.stringRequired,
	defaultSelected: types.stringArray,
	react: types.react,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	data: types.data,
	dataField: types.stringRequired,
	customQuery: types.func,
	beforeValueChange: types.func,
	onValueChange: types.func,
	onQueryChange: types.func,
	updateQuery: types.funcRequired,
	supportedOrientations: types.supportedOrientations,
	placeholder: types.string,
	selectedValue: types.selectedValue,
	showFilter: types.bool,
	filterLabel: types.filterLabel,
	style: types.style,
	theming: types.style,
	innerStyle: types.style,
	innerProps: types.props,
};

MultiDropdownRange.defaultProps = {
	placeholder: 'Select a value',
	URLParams: false,
	showFilter: true,
	style: {},
};

const mapStateToProps = (state, props) => ({
	selectedValue: state.selectedValues[props.componentId]
		? state.selectedValues[props.componentId].value
		: null,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
});

export default connect(
	mapStateToProps,
	mapDispatchtoProps,
)(withTheme(MultiDropdownRange));
