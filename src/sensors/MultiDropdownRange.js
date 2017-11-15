import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Modal, ListView, TouchableWithoutFeedback } from "react-native";
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
	Right
} from "native-base";

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions
} from "@appbaseio/reactivecore/lib/actions";
import { isEqual, checkValueChange } from "@appbaseio/reactivecore/lib/utils/helper";

import types from "@appbaseio/reactivecore/lib/utils/types";

class MultiDropdownRange extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: [],
			showModal: false
		};

		this.ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1.start !== r2.start || r1.end !== r2.end || r1.label !== r2.label
		});
		this.type = "range";
	}

	componentDidMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);
		if (this.props.defaultSelected) {
			this.selectItem(this.props.defaultSelected, true);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.selectItem(nextProps.defaultSelected, true);
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

	defaultQuery = (values) => {
		const generateRangeQuery = (dataField, items) => {
			if (items.length > 0) {
				return items.map(value => ({
					range: {
						[dataField]: {
							gte: value.start,
							lte: value.end,
							boost: 2.0
						}
					}
				}));
			}
		};

		if (values) {
			const selectedItems = this.props.data.filter(item => values.includes(item.label));
			const query = {
				bool: {
					should: generateRangeQuery(this.props.dataField, selectedItems),
					minimum_should_match: 1,
					boost: 1.0
				}
			};
			return query;
		}
		return null;
	}

	selectItem = (item, isDefaultValue = false) => {
		let { currentValue } = this.state;
		if (isDefaultValue) {
			// checking if the items in defaultSeleted exist in the data prop
			currentValue = item.filter(currentItem => this.props.data.find(dataItem => dataItem.label === currentItem));
		} else {
			if (currentValue.includes(item)) {
				currentValue = currentValue.filter(value => value !== item);
			} else {
				currentValue = [...currentValue, item];
			}
		}
		const performUpdate = () => {
			this.setState({
				currentValue
			});
			const query = this.props.customQuery || this.defaultQuery;
			this.updateQuery(currentValue);
		}

		checkValueChange(
			this.props.componentId,
			currentValue,
			this.props.beforeValueChange,
			this.props.onValueChange,
			performUpdate
		);
	}

	toggleModal = () => {
		this.setState({
			showModal: !this.state.showModal
		})
	};

	updateQuery = (value) => {
		const query = this.props.customQuery || this.defaultQuery;
		let callback = null;
		if (this.props.onQueryChange) {
			callback = this.props.onQueryChange;
		}
		this.props.updateQuery(this.props.componentId, query(value), callback);
	}

	render() {
		return (
			<View>
				{
					this.state.showModal
						? (<Modal
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
								enableEmptySections={true}
								renderRow={(item) => (
									<TouchableWithoutFeedback onPress={() => this.selectItem(item.label)}>
										<View style={{
											flex: 1,
											flexDirection: "row",
											padding: 15,
											borderBottomColor: "#c9c9c9",
											borderBottomWidth: 0.5
										}}>
											<CheckBox
												onPress={() => this.selectItem(item.label)}
												checked={this.state.currentValue.includes(item.label)}
											/>
											<Text style={{ marginLeft: 20 }}>{item.label}</Text>
										</View>
									</TouchableWithoutFeedback>
								)}
							/>
						</Modal>)
						: (<Item regular style={{ marginLeft: 0 }}>
							<TouchableWithoutFeedback
								onPress={this.toggleModal}
							>
								<Text
									style={{
										flex: 1,
										alignItems: "center",
										color: this.state.currentValue.length ? "#000" : "#555",
										flex: 1,
										fontSize: 17,
										height: 50,
										lineHeight: 24,
										paddingLeft: 8,
										paddingRight: 5,
										paddingTop: 12
									}}
								>
									{
										this.state.currentValue.length
											? this.state.currentValue.join(", ")
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
	addComponent: types.addComponent,
	componentId: types.componentId,
	defaultSelected: types.stringArray,
	react: types.react,
	removeComponent: types.removeComponent,
	data: types.data,
	dataField: types.dataField,
	customQuery: types.customQuery,
	beforeValueChange: types.beforeValueChange,
	onValueChange: types.onValueChange,
	onQueryChange: types.onQueryChange,
	updateQuery: types.updateQuery,
	supportedOrientations: types.supportedOrientations,
	placeholder: types.placeholder
}

MultiDropdownRange.defaultProps = {
	placeholder: "Select a value"
}

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: (component, query, customQuery) => dispatch(updateQuery(component, query, customQuery))
});

export default connect(null, mapDispatchtoProps)(MultiDropdownRange);
