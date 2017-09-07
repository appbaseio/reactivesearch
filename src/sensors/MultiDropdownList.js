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
import { isEqual, getQueryOptions, pushToAndClause } from "../utils/helper";

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
			[this.props.appbaseField]: {
				terms: {
					field: this.props.appbaseField,
					size: 100,
					order: {
						_count: "desc"
					}
				}
			}
		}
		this.props.setQueryOptions(this.internalComponent, queryOptions);
		this.props.updateQuery(this.internalComponent, null);
	}

	componentWillReceiveProps(nextProps) {
		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}
		if (!isEqual(nextProps.options, this.props.options)) {
			this.setState({
				options: nextProps.options[nextProps.appbaseField].buckets || []
			});
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
		this.props.removeComponent(this.internalComponent);
	}

	setReact(props) {
		const { react } = props;
		if (props.react) {
			newReact = pushToAndClause(react, this.internalComponent)
			props.watchComponent(props.componentId, newReact);
		} else {
			props.watchComponent(props.componentId, { and: this.internalComponent });
		}
	}

	defaultQuery(value) {
		if (this.selectAll) {
			return {
				exists: {
					field: [this.props.appbaseField]
				}
			};
		} else if (value && value.length) {
			if (this.props.queryFormat === "and") {
				const queryArray = value.map(item => (
					{
						[this.type]: {
							[this.props.appbaseField]: item
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
					[this.props.appbaseField]: value
				}
			};
		}
		return null;
	}

	selectItem = (item) => {
		let { currentValue } = this.state;

		if (currentValue.includes(item)) {
			currentValue = currentValue.filter(value => value !== item);
		} else {
			currentValue.push(item);
		}

		this.setState({
			currentValue
		});

		this.props.updateQuery(this.props.componentId, this.defaultQuery(currentValue))
	}

	toggleModal = () => {
		this.setState({
			showModal: !this.state.showModal
		})
	};

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
											checked={this.state.currentValue.includes(item.key)}
										/>
										<Text style={{marginLeft: 20}}>{item.key}</Text>
									</View>
								</TouchableWithoutFeedback>
							)}
						/>
					</Modal>)
					: (<Item regular style={{marginLeft: 0}}>
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
	updateQuery: (component, query) => dispatch(updateQuery(component, query)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props))
});

export default connect(mapStateToProps, mapDispatchtoProps)(MultiDropdownList);
