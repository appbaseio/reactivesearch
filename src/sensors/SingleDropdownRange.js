import React, { Component } from "react";
import { Picker } from "native-base";
import { connect } from "react-redux";

import { addComponent, removeComponent, watchComponent, updateQuery, setQueryOptions } from "../actions";
import { isEqual } from "../utils/helper";

const Item = Picker.Item;

class SingleDropdownRange extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: null
		};
		this.type = "range";
	}

	componentDidMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);
		this.setDefaultValue(this.props.defaultSelected);
	}

	componentWillReceiveProps(nextProps) {
		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}

		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.setDefaultValue(nextProps.defaultSelected);
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

	defaultQuery = (value) => {
		if (value) {
			return {
				range: {
					[this.props.dataField]: {
						gte: value.start,
						lte: value.end,
						boost: 2.0
					}
				}
			};
		}
		return null;
	}

	setDefaultValue = (value) => {
		const currentValue = this.props.data.find(item => item.label === value);
		if (currentValue) {
			this.setValue(currentValue);
		}
	}

	setValue = (value) => {
		this.setState({
			currentValue: value
		});
		const query = this.props.customQuery || this.defaultQuery;
		this.props.updateQuery(this.props.componentId, query(value));
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
					this.props.data.map(item => (
						<Picker.Item key={item.label} label={item.label} value={item} />
					))
				}
			</Picker>
		);
	}
}

SingleDropdownRange.defaultProps = {
	placeholder: "Select a value"
}

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: (component, query) => dispatch(updateQuery(component, query))
});

export default connect(null, mapDispatchtoProps)(SingleDropdownRange);
