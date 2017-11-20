import React, { Component } from "react";
import { connect } from "react-redux";

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setValue
} from "@appbaseio/reactivecore/lib/actions";
import {
	isEqual,
	debounce,
	checkValueChange
} from "@appbaseio/reactivecore/lib/utils/helper";
import types from "@appbaseio/reactivecore/lib/utils/types";

import Input from "../../styles/Input";
import Title from "../../styles/Title";

class TextField extends Component {
	constructor(props) {
		super(props);

		this.type = "match";
		this.state = {
			currentValue: ""
		};
	}

	componentDidMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);

		if (this.props.selectedValue) {
			this.setValue(this.props.selectedValue, true);
		} else if (this.props.defaultSelected) {
			this.setValue(this.props.defaultSelected, true);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!isEqual(nextProps.react, this.props.react)) {
			this.setReact(nextProps);
		}
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.setValue(nextProps.defaultSelected, true);
		} else if (this.state.currentValue !== nextProps.selectedValue) {
			this.setValue(nextProps.selectedValue || "", true);
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
		if (value && value.trim() !== "") {
			return {
				[this.type]: {
					[this.props.dataField]: value
				}
			};
		}
		return null;
	}

	handleTextChange = debounce((value) => {
		this.updateQuery(value);
	}, 300);

	setValue = (value, isDefaultValue = false) => {
		const performUpdate = () => {
			this.setState({
				currentValue: value
			});
			if (isDefaultValue) {
				this.updateQuery(value);
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

	updateQuery = (value) => {
		const query = this.props.customQuery || this.defaultQuery;
		let callback = null;
		if (this.props.onQueryChange) {
			callback = this.props.onQueryChange;
		}
		this.props.updateQuery(this.props.componentId, query(value), callback);
		this.props.setValue(this.props.componentId, value);
	}

	render() {
		return (
			<div>
				{
					this.props.title
						? (<Title>{this.props.title}</Title>)
						: null
				}
				<Input
					type="text"
					placeholder={this.props.placeholder}
					onChange={(e) => this.setValue(e.target.value)}
					value={this.state.currentValue}
				/>
			</div>
		);
	}
}

TextField.propTypes = {
	addComponent: types.addComponent,
	componentId: types.componentId,
	defaultSelected: types.string,
	react: types.react,
	removeComponent: types.removeComponent,
	dataField: types.dataField,
	title: types.title,
	beforeValueChange: types.beforeValueChange,
	onValueChange: types.onValueChange,
	customQuery: types.customQuery,
	onQueryChange: types.onQueryChange,
	updateQuery: types.updateQuery,
	placeholder: types.placeholder,
	selectedValue: types.selectedValue,
	setValue: types.setValue
};

TextField.defaultProps = {
	placeholder: "Search"
}

const mapStateToProps = (state, props) => ({
	selectedValue: state.selectedValues[props.componentId] && state.selectedValues[props.componentId].value || null
});

const mapDispatchtoProps = (dispatch, props) => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: (component, query, onQueryChange) => dispatch(updateQuery(component, query, onQueryChange)),
	setValue: (component, value) => dispatch(setValue(component, value, props.filterLabel))
});

export default connect(mapStateToProps, mapDispatchtoProps)(TextField);
