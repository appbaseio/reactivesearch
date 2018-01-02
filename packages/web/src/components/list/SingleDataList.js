import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
} from '@appbaseio/reactivecore/lib/actions';
import {
	checkValueChange,
	checkPropChange,
	getClassName,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';

import Title from '../../styles/Title';
import Input from '../../styles/Input';
import { UL, Radio } from '../../styles/FormControlList';

class SingleDataList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: null,
			searchTerm: '',
		};
		this.type = 'term';
	}

	componentWillMount() {
		this.props.addComponent(this.props.componentId);

		this.setReact(this.props);

		if (this.props.selectedValue) {
			this.setValue(this.props.selectedValue);
		} else if (this.props.defaultSelected) {
			this.setValue(this.props.defaultSelected);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(
			this.props.react,
			nextProps.react,
			() => this.setReact(nextProps),
		);

		checkPropChange(
			this.props.dataField,
			nextProps.dataField,
			() => {
				this.updateQuery(this.state.currentValue, nextProps);
			},
		);

		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.setValue(nextProps.defaultSelected);
		} else if (this.state.currentValue !== nextProps.selectedValue) {
			this.setValue(nextProps.selectedValue || '');
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
		if (this.props.selectAllLabel && this.props.selectAllLabel === value) {
			return {
				exists: {
					field: props.dataField,
				},
			};
		} else if (value) {
			return {
				[this.type]: {
					[props.dataField]: value,
				},
			};
		}
		return null;
	};

	setValue = (nextValue, props = this.props) => {
		let value = nextValue;
		if (nextValue === this.state.currentValue) {
			value = '';
		}

		const performUpdate = () => {
			this.setState({
				currentValue: value,
			}, () => {
				this.updateQuery(value, props);
			});
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

		let currentValue = value;
		if (value !== props.selectAllLabel) {
			currentValue = props.data.find(item => item.label === value);
			currentValue = currentValue ? currentValue.value : null;
		}

		props.updateQuery({
			componentId: props.componentId,
			query: query(currentValue, props),
			value: currentValue ? value : null,
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
									<Radio
										className={getClassName(this.props.innerClass, 'input')}
										id={selectAllLabel}
										name={this.props.componentId}
										value={selectAllLabel}
										onClick={this.handleClick}
										checked={this.state.currentValue === selectAllLabel}
										show={this.props.showRadio}
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
									<Radio
										className={getClassName(this.props.innerClass, 'input')}
										id={item.label}
										name={this.props.componentId}
										value={item.label}
										onChange={() => {}}
										onClick={this.handleClick}
										checked={this.state.currentValue === item.label}
										show={this.props.showRadio}
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

SingleDataList.propTypes = {
	componentId: types.stringRequired,
	addComponent: types.funcRequired,
	dataField: types.stringRequired,
	updateQuery: types.funcRequired,
	data: types.data,
	defaultSelected: types.string,
	react: types.react,
	removeComponent: types.funcRequired,
	beforeValueChange: types.func,
	onValueChange: types.func,
	customQuery: types.func,
	onQueryChange: types.func,
	placeholder: types.string,
	title: types.title,
	showRadio: types.boolRequired,
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

SingleDataList.defaultProps = {
	showRadio: true,
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

export default connect(mapStateToProps, mapDispatchtoProps)(SingleDataList);
