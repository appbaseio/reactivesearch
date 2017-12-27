import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
} from '@appbaseio/reactivecore/lib/actions';
import {
	isEqual,
	checkValueChange,
	checkPropChange,
	getClassName,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';

import Title from '../../styles/Title';
import Input from '../../styles/Input';
import { UL, Checkbox } from '../../styles/FormControlList';

class MultiDataList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: {},
			searchTerm: '',
		};
		this.type = 'term';
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

		let selectedValue = Object.keys(this.state.currentValue);

		if (this.props.selectAllLabel) {
			selectedValue = selectedValue.filter(val => val !== this.props.selectAllLabel);

			if (this.state.currentValue[this.props.selectAllLabel]) {
				selectedValue = [this.props.selectAllLabel];
			}
		}

		if (!isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			this.setValue(nextProps.defaultSelected, true);
		} else if (!isEqual(selectedValue, nextProps.selectedValue)) {
			this.setValue(nextProps.selectedValue, true);
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
		let query = null;
		const type = props.queryFormat === 'or' ? 'terms' : 'term';
		if (
			this.props.selectAllLabel && Array.isArray(value) && value.includes(this.props.selectAllLabel)
		) {
			query = {
				exists: {
					field: props.dataField,
				},
			};
		} else if (value) {
			let listQuery;
			if (props.queryFormat === 'or') {
				listQuery = {
					[type]: {
						[props.dataField]: value,
					},
				};
			} else {
				// adds a sub-query with must as an array of objects for each term/value
				const queryArray = value.map(item => (
					{
						[type]: {
							[props.dataField]: item,
						},
					}
				));
				listQuery = {
					bool: {
						must: queryArray,
					},
				};
			}

			query = value.length ? listQuery : null;
		}
		return query;
	};

	setValue = (value, isDefaultValue = false, props = this.props) => {
		const { selectAllLabel } = this.props;
		let { currentValue } = this.state;
		let finalValues = null;

		if (selectAllLabel
			&& ((Array.isArray(value) && value.includes(selectAllLabel))
			|| (typeof value === 'string' && value === selectAllLabel))) {
			if (currentValue[selectAllLabel]) {
				currentValue = {};
				finalValues = [];
			} else {
				props.data.forEach((item) => {
					currentValue[item.label] = true;
				});
				currentValue[selectAllLabel] = true;
				finalValues = [selectAllLabel];
			}
		} else if (isDefaultValue) {
			finalValues = value;
			currentValue = {};
			if (value) {
				value.forEach((item) => {
					currentValue[item] = true;
				});
			}

			if (selectAllLabel && selectAllLabel in currentValue) {
				const { [selectAllLabel]: del, ...obj } = currentValue;
				currentValue = { ...obj };
			}
		} else {
			if (currentValue[value]) {
				const { [value]: del, ...rest } = currentValue;
				currentValue = { ...rest };
			} else {
				currentValue[value] = true;
			}

			if (selectAllLabel && selectAllLabel in currentValue) {
				const { [selectAllLabel]: del, ...obj } = currentValue;
				currentValue = { ...obj };
			}
			finalValues = Object.keys(currentValue);
		}

		const performUpdate = () => {
			this.setState({
				currentValue,
			}, () => {
				this.updateQuery(finalValues, props);
			});
		};

		checkValueChange(
			props.componentId,
			finalValues,
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
			URLParams: props.URLParams,
		});
	};

	handleInputChange = (e) => {
		const { value } = e.target;
		this.setState({
			searchTerm: value,
		});
	};

	renderSearch = () => {
		if (this.props.showSearch) {
			return (<Input
				className={getClassName(this.props.innerClass, 'input') || null}
				onChange={this.handleInputChange}
				value={this.state.searchTerm}
				placeholder={this.props.placeholder}
				style={{
					margin: '0 0 8px',
				}}
			/>);
		}
		return null;
	};

	handleClick = (e) => {
		this.setValue(e.target.value);
	};

	render() {
		const { selectAllLabel } = this.props;

		if (this.props.data.length === 0) {
			return null;
		}

		return (
			<div style={this.props.style} className={this.props.className}>
				{this.props.title && <Title className={getClassName(this.props.innerClass, 'title') || null}>{this.props.title}</Title>}
				{this.renderSearch()}
				<UL className={getClassName(this.props.innerClass, 'list') || null}>
					{
						selectAllLabel
							? (
								<li key={selectAllLabel}>
									<Checkbox
										className={getClassName(this.props.innerClass, 'input') || null}
										id={selectAllLabel}
										name={selectAllLabel}
										value={selectAllLabel}
										onClick={this.handleClick}
										checked={!!this.state.currentValue[selectAllLabel]}
										show={this.props.showCheckbox}
									/>
									<label className={getClassName(this.props.innerClass, 'label') || null} htmlFor={selectAllLabel}>
										{selectAllLabel}
									</label>
								</li>
							)
							: null
					}
					{
						this.props.data
							.filter((item) => {
								if (this.props.showSearch && this.state.searchTerm) {
									return item.label.toLowerCase().includes(this.state.searchTerm.toLowerCase());
								}
								return true;
							})
							.map(item => (
								<li key={item.label}>
									<Checkbox
										className={getClassName(this.props.innerClass, 'input') || null}
										id={item.label}
										name={this.props.componentId}
										value={item.label}
										onClick={this.handleClick}
										checked={!!this.state.currentValue[item.label]}
										show={this.props.showCheckbox}
									/>
									<label className={getClassName(this.props.innerClass, 'label') || null} htmlFor={item.label}>
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

MultiDataList.propTypes = {
	componentId: types.stringRequired,
	addComponent: types.funcRequired,
	dataField: types.stringRequired,
	updateQuery: types.funcRequired,
	data: types.data,
	defaultSelected: types.stringArray,
	react: types.react,
	removeComponent: types.funcRequired,
	beforeValueChange: types.func,
	onValueChange: types.func,
	customQuery: types.func,
	onQueryChange: types.func,
	placeholder: types.string,
	title: types.title,
	showCheckbox: types.boolRequired,
	filterLabel: types.string,
	selectedValue: types.selectedValue,
	URLParams: types.boolRequired,
	showFilter: types.bool,
	showSearch: types.bool,
	selectAllLabel: types.string,
	style: types.style,
	className: types.string,
	innerClass: types.style,
};

MultiDataList.defaultProps = {
	showCheckbox: true,
	URLParams: false,
	showFilter: true,
	placeholder: 'Search',
	showSearch: true,
	style: {},
	className: null,
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

export default connect(mapStateToProps, mapDispatchtoProps)(MultiDataList);
