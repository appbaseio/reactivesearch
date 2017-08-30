import React, { Component } from "react";
import { Picker } from "native-base";
import { connect } from "react-redux";

import { addComponent, removeComponent, watchComponent, updateQuery, setQueryOptions } from "../actions";
import { isEqual, getQueryOptions, pushToAndClause } from "../utils/helper";

const Item = Picker.Item;

class DropdownList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: "",
			options: []
		};
		this.type = this.props.multipleSelect && this.props.queryFormat === "or" ? "Terms" : "Term";
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
		} else if (value) {
			if (this.props.queryFormat === "and" && this.props.multipleSelect) {
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
	}

	setValue = (value) => {
		this.setState({
			currentValue: value
		});
		this.props.updateQuery(this.props.componentId, this.defaultQuery(value))
	};

	render() {
		return (
			<Picker
				iosHeader="Select one"
				mode="dropdown"
				placeholder={this.props.placeholder}
				selectedValue={this.state.currentValue}
				onValueChange={this.setValue}
			>
				{
					this.state.options.map(item => (
						<Picker.Item key={item.key} label={item.key} value={item.key} />
					))
				}
			</Picker>
		);
	}
}

DropdownList.defaultProps = {
	size: 100,
	multipleSelect: false,
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

export default connect(mapStateToProps, mapDispatchtoProps)(DropdownList);
