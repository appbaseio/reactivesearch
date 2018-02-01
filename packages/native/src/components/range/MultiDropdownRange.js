/* eslint-disable */
import React, { Component } from 'react';
import { View, Modal, ListView, TouchableWithoutFeedback } from 'react-native';
import {
	CheckBox,
	Text,
	Body,
	Item,
	Header,
	Left,
	Button,
	Icon,
	Title,
	Right,
} from 'native-base';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
} from '@appbaseio/reactivecore/lib/actions';
import {
	isEqual,
	checkValueChange,
	checkPropChange,
	getClassName,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';

import { connect } from '../../utils';

class MultiDropdownRange extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: [],
			showModal: false,
		};

		this.ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1.start !== r2.start
			|| r1.end !== r2.end || r1.label !== r2.label,
		});

		// selectedValues hold the selected items as keys for O(1) complexity
		this.selectedValues = {};
		this.type = 'range';
		this.locked = false;
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
		checkPropChange(
			this.props.react,
			nextProps.react,
			() => this.setReact(nextProps),
		);

		checkPropChange(this.props.dataField, nextProps.dataField, () => {
			this.updateQuery(this.state.currentValue, nextProps);
		});

		if (!isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			this.selectItem(nextProps.defaultSelected, true);
		} else if (!isEqual(this.state.currentValue, nextProps.selectedValue)
			&& (nextProps.selectedValue || nextProps.selectedValue === null)) {
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
			currentValue.forEach((value) => {
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
			this.setState({
				currentValue,
			}, () => {
				this.updateQuery(currentValue, props);
				this.locked = false;
			});
		};

		checkValueChange(
			props.componentId,
			currentValue,
			props.beforeValueChange,
			props.onValueChange,
			performUpdate,
		);
	};

	toggleModal = () => {
		this.setState({
			showModal: !this.state.showModal,
		});
	};

	updateQuery = (value, props) => {
		const query = props.customQuery || this.defaultQuery;

		const { onQueryChange = null } = props;

		props.updateQuery({
			componentId: props.componentId,
			query: query(value, props),
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			onQueryChange,
			URLParams: false,
		});
	};

	render() {
		return (
			<View>
				{
					this.state.showModal
						? (
							<Modal
								supportedOrientations={this.props.supportedOrientations || null}
								transparent={false}
								visible={this.state.showModal}
								onRequestClose={() => {
									this.toggleModal();
								}}
							>
								<Header>
									<Left>
										<Button transparent onPress={this.toggleModal}>
											<Icon name="arrow-back" />
										</Button>
									</Left>
									<Body>
										<Title>{this.props.placeholder}</Title>
									</Body>
									<Right />
								</Header>
								<ListView
									dataSource={this.ds.cloneWithRows(this.props.data)}
									enableEmptySections
									renderRow={item => (
										<TouchableWithoutFeedback onPress={() => this.selectItem(item.label)}>
											<View style={{
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
												/>
												<Text style={{ marginLeft: 20 }}>{item.label}</Text>
											</View>
										</TouchableWithoutFeedback>
									)}
								/>
							</Modal>)
						: (
							<Item regular style={{ marginLeft: 0 }}>
								<TouchableWithoutFeedback
									onPress={this.toggleModal}
								>
									<Text
										style={{
											flex: 1,
											alignItems: 'center',
											color: this.state.currentValue.length ? '#000' : '#555',
											fontSize: 17,
											height: 50,
											lineHeight: 24,
											paddingLeft: 8,
											paddingRight: 5,
											paddingTop: 12,
										}}
									>
										{
											Object.keys(this.state.currentValue).length
												? this.state.currentValue.map(item => item.label).join(', ')
												: this.props.placeholder
										}
									</Text>
								</TouchableWithoutFeedback>
							</Item>)

				}
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
});

export default connect(mapStateToProps, mapDispatchtoProps)(MultiDropdownRange);
