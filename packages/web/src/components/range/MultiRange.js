import React, { Component } from "react";
import { connect } from "react-redux";

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery
} from "@appbaseio/reactivecore/lib/actions";
import {
	isEqual,
	getQueryOptions,
	pushToAndClause,
	checkValueChange,
	getAggsOrder,
	checkPropChange,
	checkSomePropChange
} from "@appbaseio/reactivecore/lib/utils/helper";

import types from "@appbaseio/reactivecore/lib/utils/types";

import Title from "../../styles/Title";
import { UL, Checkbox } from "../../styles/FormControlList";

class MultiRange extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: [],
			showModal: false,
			selectedValues: {} // selectedValues hold the selected items as keys for O(1) complexity
		};

		this.type = "range";
	}

	componentWillMount() {
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
			() => this.setReact(nextProps)
		);

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
							boost: 2.0
						}
					}
				}));
			}
		};

		if (values && values.length) {
			const query = {
				bool: {
					should: generateRangeQuery(props.dataField, values),
					minimum_should_match: 1,
					boost: 1.0
				}
			};
			return query;
		}
		return null;
	}

	selectItem = (item, isDefaultValue = false, props = this.props) => {
		let { currentValue, selectedValues } = this.state;

		if (!item) {
			currentValue = [];
			selectedValues = {};
		} else if (isDefaultValue) {
			// checking if the items in defaultSeleted exist in the data prop
			currentValue = props.data.filter(value => item.includes(value.label));
			currentValue.forEach(value => {
				selectedValues = { ...selectedValues, [value.label]: true };
			});
		} else {
			if (selectedValues[item]) {
				currentValue = currentValue.filter(value => value.label !== item);
				const { [item]: del, ...selected } = selectedValues;
				selectedValues = selected;
			} else {
				const currentItem = props.data.find(value => item === value.label);
				currentValue = [...currentValue, currentItem];
				selectedValues = { ...selectedValues, [item]: true };
			}
		}
		const performUpdate = () => {
			this.setState({
				currentValue,
				selectedValues
			}, () => {
				this.updateQuery(currentValue, props);
			});
		}

		checkValueChange(
			props.componentId,
			currentValue,
			props.beforeValueChange,
			props.onValueChange,
			performUpdate
		);
	}

	toggleModal = () => {
		this.setState({
			showModal: !this.state.showModal
		})
	};

	updateQuery = (value, props) => {
		const query = props.customQuery || this.defaultQuery;
		let callback = null;

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
			URLParams: props.URLParams
		});
	}

	render() {
		return (
			<div style={this.props.style} className={this.props.className}>
				{this.props.title && <Title>{this.props.title}</Title>}
				<UL>
					{
						this.props.data.map(item => (
							<li key={item.label}>
								<Checkbox
									id={item.label}
									name={this.props.componentId}
									value={item.label}
									onClick={e => this.selectItem(e.target.value)}
									checked={!!this.state.selectedValues[item.label]}
									onChange={() => {}}
									show={this.props.showCheckbox}
								/>
								<label htmlFor={item.label}>
									{item.label}
								</label>
							</li>
						))
					}
				</UL>
			</div>
		);
	}
}

MultiRange.propTypes = {
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
	title: types.title,
	URLParams: types.boolRequired,
	showFilter: types.bool,
	showCheckbox: types.boolRequired,
	filterLabel: types.filterLabel,
	style: types.style,
	className: types.string
}

MultiRange.defaultProps = {
	URLParams: false,
	showFilter: true,
	showCheckbox: true,
	style: {},
	className: null
}

const mapStateToProps = (state, props) => ({
	selectedValue: state.selectedValues[props.componentId] ? state.selectedValues[props.componentId].value : null
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: (updateQueryObject) => dispatch(updateQuery(updateQueryObject))
});

export default connect(mapStateToProps, mapDispatchtoProps)(MultiRange);
