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

import { addComponent, removeComponent, watchComponent, updateQuery, setQueryOptions } from "../actions";
import { isEqual, getQueryOptions, pushToAndClause, checkValueChange } from "../utils/helper";

class MultiDropdownList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: [],
			options: [],
			showModal: false
		};

		this.ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1.key !== r2.key || r1.count !== r2.count
		});
		this.type = this.props.queryFormat === "or" ? "Terms" : "Term";
		this.internalComponent = this.props.componentId + "__internal";
	}

	componentDidMount() {
		this.props.addComponent(this.internalComponent);
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);

		const queryOptions = getQueryOptions(this.props);
		queryOptions.aggs = {
			[this.props.dataField]: {
				terms: {
					field: this.props.dataField,
					size: 100,
					order: {
						_count: "desc"
					}
				}
			}
		}
		this.props.setQueryOptions(this.internalComponent, queryOptions);
		this.props.updateQuery(this.internalComponent, null);

		if (this.props.defaultSelected) {
			this.selectItem(this.props.defaultSelected, true);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}
		if (!isEqual(nextProps.options, this.props.options)) {
			this.setState({
				options: nextProps.options[nextProps.dataField].buckets || []
			});
		}
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.selectItem(nextProps.defaultSelected, true);
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
		this.props.removeComponent(this.internalComponent);
	}

	setReact(props) {
		const { react } = props;
		if (react) {
			newReact = pushToAndClause(react, this.internalComponent)
			props.watchComponent(props.componentId, newReact);
		} else {
			props.watchComponent(props.componentId, { and: this.internalComponent });
		}
	}

	defaultQuery = (value) => {
		if (this.selectAll) {
			return {
				exists: {
					field: [this.props.dataField]
				}
			};
		} else if (value && value.length) {
			if (this.props.queryFormat === "and") {
				const queryArray = value.map(item => (
					{
						[this.type]: {
							[this.props.dataField]: item
						}
					}
				));
				return {
					bool: {
						must: queryArray
					}
				};
			}

			return {
				[this.type]: {
					[this.props.dataField]: value
				}
			};
		}
		return null;
	}

	selectItem = (item, isDefaultValue = false) => {
		let { currentValue } = this.state;

		if (isDefaultValue) {
			currentValue = item;
		} else {
			if (currentValue.includes(item)) {
				currentValue = currentValue.filter(value => value !== item);
			} else {
				currentValue = [ ...currentValue, item ];
			}
		}
		const performUpdate = () => {
			this.setState({
				currentValue
			});
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
								dataSource={this.ds.cloneWithRows(this.state.options)}
								enableEmptySections={true}
								renderRow={(item) => (
									<TouchableWithoutFeedback onPress={() => this.selectItem(item.key)}>
										<View style={{
											flex: 1,
											flexDirection: "row",
											padding: 15,
											borderBottomColor: "#c9c9c9",
											borderBottomWidth: 0.5
										}}>
											<CheckBox
												onPress={() => this.selectItem(item.key)}
												checked={this.state.currentValue.includes(item.key)}
											/>
											<Text style={{ marginLeft: 20 }}>{item.key}</Text>
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

MultiDropdownList.defaultProps = {
	size: 100,
	queryFormat: "or",
	placeholder: "Select a value"
}

const mapStateToProps = (state, props) => ({
	options: state.aggregations[props.componentId]
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: (component, query, onQueryChange) => dispatch(updateQuery(component, query, onQueryChange)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props))
});

export default connect(mapStateToProps, mapDispatchtoProps)(MultiDropdownList);
