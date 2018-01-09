import React, { Component } from 'react';
import { Input, Item } from 'native-base';
import { connect } from 'react-redux';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
} from '@appbaseio/reactivecore/lib/actions';
import {
	debounce,
	checkValueChange,
	checkPropChange,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

class TextField extends Component {
	constructor(props) {
		super(props);

		this.type = 'match';
		this.state = {
			currentValue: '',
		};
	}

	componentWillMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);

		if (this.props.selectedValue) {
			this.setValue(this.props.selectedValue, true);
		} else if (this.props.defaultSelected) {
			this.setValue(this.props.defaultSelected, true);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(
			this.props.react,
			nextProps.react,
			() => this.setReact(nextProps),
		);
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.setValue(nextProps.defaultSelected, true, nextProps);
		} else if (this.state.currentValue !== nextProps.selectedValue) {
			this.setValue(nextProps.selectedValue || '', true, nextProps);
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

	defaultQuery = (value, props) => {
		if (value && value.trim() !== '') {
			return {
				[this.type]: {
					[props.dataField]: value,
				},
			};
		}
		return null;
	}

	handleTextChange = debounce((value) => {
		this.updateQuery(value, this.props);
	}, this.props.debounce);

	setValue = (value, isDefaultValue = false, props = this.props) => {
		const performUpdate = () => {
			this.setState({
				currentValue: value,
			});
			if (isDefaultValue) {
				this.updateQuery(value, props);
			} else {
				// debounce for handling text while typing
				this.handleTextChange(value);
			}
		};
		checkValueChange(
			props.componentId,
			value,
			props.beforeValueChange,
			props.onValueChange,
			performUpdate,
		);
	};

	updateQuery = (value, props) => {
		const query = props.customQuery || this.defaultQuery;
		let onQueryChange = null;
		if (props.onQueryChange) {
			onQueryChange = props.onQueryChange;
		}
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
			<Item regular style={{ marginLeft: 0, ...this.props.style }}>
				<Input
					placeholder={this.props.placeholder}
					onChangeText={this.setValue}
					value={this.state.currentValue}
				/>
			</Item>
		);
	}
}

TextField.propTypes = {
	addComponent: types.funcRequired,
	componentId: types.stringRequired,
	defaultSelected: types.string,
	react: types.react,
	removeComponent: types.funcRequired,
	dataField: types.stringRequired,
	title: types.title,
	beforeValueChange: types.func,
	onValueChange: types.func,
	customQuery: types.func,
	onQueryChange: types.func,
	updateQuery: types.funcRequired,
	placeholder: types.string,
	selectedValue: types.selectedValue,
	filterLabel: types.string,
	showFilter: types.bool,
	style: types.style,
	debounce: types.number,
};

TextField.defaultProps = {
	placeholder: 'Search',
	showFilter: true,
	style: {},
	debounce: 0,
};

const mapStateToProps = (state, props) => ({
	selectedValue: (state.selectedValues[props.componentId]
		&& state.selectedValues[props.componentId].value) || null,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
});

export default connect(mapStateToProps, mapDispatchtoProps)(TextField);
