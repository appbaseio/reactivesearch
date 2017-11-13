import React, { Component } from "react";
import { View, Modal, TouchableWithoutFeedback } from "react-native";
import {
	Input,
	Item,
	List,
	ListItem,
	Text,
	Button,
	Header,
	Left,
	Right,
	Icon
} from "native-base";
import { connect } from "react-redux";

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions
} from "@appbaseio/reactivecore/lib/actions";
import {
	isEqual,
	debounce,
	pushToAndClause,
	checkValueChange
} from "@appbaseio/reactivecore/lib/utils/helper";

class DataSearch extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: "",
			suggestions: [],
			showModal: false
		};
		this.internalComponent = this.props.componentId + "__internal";
	}

	componentDidMount() {
		this.props.addComponent(this.props.componentId);
		this.props.addComponent(this.internalComponent);

		if (this.props.highlight) {
			const queryOptions = this.highlightQuery(this.props);
			this.props.setQueryOptions(this.props.componentId, queryOptions);
		}
		this.setReact(this.props);

		if (this.props.defaultSelected) {
			this.setValue(this.props.defaultSelected, true);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.highlight &&
			!isEqual(this.props.dataField, nextProps.dataField) ||
			!isEqual(this.props.highlightField, nextProps.highlightField)) {
			const queryOptions = this.highlightQuery(nextProps);
			this.props.setQueryOptions(this.props.componentId, queryOptions);
		}

		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}

		if (Array.isArray(nextProps.suggestions)
			&& !isEqual(this.props.suggestions, nextProps.suggestions)
			&& this.state.currentValue.trim() !== "") {
			this.setState({
				suggestions: nextProps.suggestions
			});
		}

		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.setValue(nextProps.defaultSelected, true);
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
		this.props.removeComponent(this.internalComponent);
	}

	setReact = (props) => {
		const { react } = props;
		if (react) {
			newReact = pushToAndClause(react, this.internalComponent)
			props.watchComponent(props.componentId, newReact);
		} else {
			props.watchComponent(props.componentId, { and: this.internalComponent });
		}
	}

	highlightQuery = (props) => {
		const fields = {};
		const highlightField = props.highlightField ? props.highlightField : props.dataField;

		if (typeof highlightField === "string") {
			fields[highlightField] = {};
		} else if (Array.isArray(highlightField)) {
			highlightField.forEach((item) => {
				fields[item] = {};
			});
		}

		return {
			highlight: {
				pre_tags: ["<em>"],
				post_tags: ["</em>"],
				fields
			}
		};
	}

	defaultQuery = (value) => {
		let finalQuery = null,
			fields;
		if (value) {
			if (Array.isArray(this.props.dataField)) {
				fields = this.props.dataField;
			} else {
				fields = [this.props.dataField];
			}
			finalQuery = {
				bool: {
					should: this.shouldQuery(value, fields),
					minimum_should_match: "1"
				}
			};
		}

		if (value === "") {
			finalQuery = {
				"match_all": {}
			}
		}

		return finalQuery;
	}

	shouldQuery(value, dataFields) {
		const fields = dataFields.map(
			(field, index) => `${field}${(Array.isArray(this.props.weights) && this.props.weights[index]) ? ("^" + this.props.weights[index]) : ""}`
		);

		if (this.props.queryFormat === "and") {
			return [
				{
					multi_match: {
						query: value,
						fields,
						type: "cross_fields",
						operator: "and",
						fuzziness: this.props.fuzziness ? this.props.fuzziness : 0
					}
				},
				{
					multi_match: {
						query: value,
						fields,
						type: "phrase_prefix",
						operator: "and"
					}
				}
			];
		}

		return [
			{
				multi_match: {
					query: value,
					fields,
					type: "best_fields",
					operator: "or",
					fuzziness: this.props.fuzziness ? this.props.fuzziness : 0
				}
			},
			{
				multi_match: {
					query: value,
					fields,
					type: "phrase_prefix",
					operator: "or"
				}
			}
		];
	}

	setValue = (value, isDefaultValue = false) => {
		const performUpdate = () => {
			this.setState({
				currentValue: value
			});
			if (isDefaultValue) {
				if (this.props.autoSuggest) {
					this.updateQuery(this.internalComponent, value);
				}
				this.updateQuery(this.props.componentId, value);
			} else {
				// debounce for handling text while typing
				this.handleTextChange(value);
			}
		}
		checkValueChange(
			this.props.componentId,
			value,
			this.props.beforeValueChange,
			this.props.onValueChange,
			performUpdate
		);
	};

	handleTextChange = debounce((value) => {
		if (this.props.autoSuggest) {
			this.updateQuery(this.internalComponent, value);
		} else {
			this.updateQuery(this.props.componentId, value);
		}
	}, 300);

	selectSuggestion = (value) => {
		this.setState({
			suggestions: []
		});
		this.setValue(value, true);
		this.toggleModal();
	};

	setSuggestions = () => {
		let suggestions = [];
		if (this.state.currentValue.trim() !== "") {
			suggestions = this.props.suggestions;
		}

		this.setState({
			suggestions
		});
	};

	toggleModal = () => {
		this.setState({
			showModal: !this.state.showModal
		})
	};

	updateQuery = (component, value) => {
		const query = this.props.customQuery || this.defaultQuery;
		let callback = null;
		if (component === this.props.componentId && this.props.onQueryChange) {
			callback = this.props.onQueryChange;
		}
		this.props.updateQuery(component, query(value), callback);
	};

	renderSuggestions() {
		if (this.props.autoSuggest && Array.isArray(this.state.suggestions)) {
			return (<List
				dataArray={this.state.suggestions}
				keyboardShouldPersistTaps="always"
				renderRow={(item) =>
					<ListItem
						onPress={() => this.selectSuggestion(item._source.name)}
					>
						<Text>{item._source.name}</Text>
					</ListItem>
				}>
			</List>)
		}

		return null;
	}

	renderDataSearch = () => {
		if (this.state.showModal) {
			return (<Modal
				supportedOrientations={this.props.supportedOrientations || null}
				transparent={false}
				visible={this.state.showModal}
				onRequestClose={this.toggleModal}
			>
				<Header>
					<Left>
						<Button transparent onPress={this.toggleModal}>
							<Icon name="arrow-back" />
						</Button>
					</Left>
					{
						this.state.currentValue
							? (<Right>
								<Button
									style={{ paddingRight: 0 }}
									transparent
									onPress={() => this.selectSuggestion("")}
								>
									<Text>Reset</Text>
								</Button>
							</Right>)
							: null
					}
				</Header>
				<Item regular style={{ marginLeft: 10, margin: 10 }}>
					<Input
						placeholder={this.props.placeholder}
						onChangeText={this.setValue}
						value={this.state.currentValue}
						onFocus={this.setSuggestions}
						autoFocus
					/>
				</Item>
				{this.renderSuggestions()}
			</Modal>);
		}

		return (<Item regular style={{ marginLeft: 0 }}>
			<TouchableWithoutFeedback
				onPress={this.toggleModal}
			>
				<Text
					style={{
						flex: 1,
						alignItems: "center",
						color: this.state.currentValue && this.state.currentValue !== "" ? "#000" : "#555",
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
						this.state.currentValue && this.state.currentValue !== ""
							? this.state.currentValue
							: this.props.placeholder
					}
				</Text>
			</TouchableWithoutFeedback>
		</Item>)
	}

	render() {
		return (
			<View>
				{
					this.props.autoSuggest
						? this.renderDataSearch()
						: <Item regular style={{ marginLeft: 0 }}>
							<Input
								placeholder={this.props.placeholder}
								onChangeText={this.setValue}
								value={this.state.currentValue}
							/>
						</Item>
				}
			</View>
		);
	}
}

DataSearch.defaultProps = {
	placeholder: "Search",
	autoSuggest: true,
	queryFormat: "or"
}

const mapStateToProps = (state, props) => ({
	suggestions: state.hits[props.componentId] && state.hits[props.componentId].hits
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: (component, query, onQueryChange) => dispatch(updateQuery(component, query, onQueryChange)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props))
});

export default connect(mapStateToProps, mapDispatchtoProps)(DataSearch);
