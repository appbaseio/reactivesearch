import React, { Component } from "react";
import { TextInput, View, Text, FlatList, TouchableHighlight } from "react-native";
import { connect } from "react-redux";

import { addComponent, removeComponent, watchComponent, updateQuery } from "../actions";
import { isEqual, debounce, pushToAndClause } from "../utils/helper";

class DataSearch extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: "",
			suggestions: []
		};
		this.internalComponent = this.props.componentId + "__internal";
	}

	componentDidMount() {
		this.props.addComponent(this.props.componentId);
		this.props.addComponent(this.internalComponent);
		this.setReact(this.props);
		this.updateQuery = debounce((component, value) => {
			this.props.updateQuery(component, this.defaultQuery(value));
		}, 300);
	}

	componentWillReceiveProps(nextProps) {
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
			props.watchComponent(props.componentId, {and: this.internalComponent});
		}
	}

	defaultQuery(value) {
		let finalQuery = null,
			fields;
		if (value) {
			if (Array.isArray(this.props.appbaseField)) {
				fields = this.props.appbaseField;
			} else {
				fields = [this.props.appbaseField];
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

	shouldQuery(value, appbaseFields) {
		const fields = appbaseFields.map(
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

	setValue = (value) => {
		this.setState({
			currentValue: value,
			suggestions: []
		});
		this.updateQuery(this.internalComponent, value);
	};

	selectSuggestion = (value) => {
		console.log("selected", value);
		this.setState({
			currentValue: value,
			suggestions: []
		});
		this.updateQuery(this.props.componentId, value);
	};

	setSuggestions = () => {
		let suggestions = [];
		if (this.state.currentValue.trim() !== "") {
			suggestions = this.props.suggestions;
		}

		this.setState({
			suggestions
		});
	}

	render() {
		return (
			<View style={{width: "100%"}}>
				<TextInput
					placeholder={this.props.placeholder}
					onChangeText={this.setValue}
					value={this.state.currentValue}
					onFocus={this.setSuggestions}
					style={{
						borderWidth: 1,
						width: "100%"
					}}
				/>
				{
					Array.isArray(this.state.suggestions)
					? (<FlatList
						data={this.state.suggestions}
						keyExtractor={(item) => item._id}
						renderItem={({item}) => (
							<TouchableHighlight
								onPress={() => this.selectSuggestion(item._source.name)}
							>
								<Text>{item._source.name}</Text>
							</TouchableHighlight>
						)}
					/>)
					: null
				}
			</View>
		);
	}
}

const mapStateToProps = (state, props) => ({
	suggestions: state.hits[props.componentId]
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: (component, query) => dispatch(updateQuery(component, query))
});

export default connect(mapStateToProps, mapDispatchtoProps)(DataSearch);
