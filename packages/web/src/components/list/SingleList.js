import React, { Component } from 'react';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
} from '@appbaseio/reactivecore/lib/actions';
import {
	getQueryOptions,
	pushToAndClause,
	checkValueChange,
	getAggsOrder,
	checkPropChange,
	checkSomePropChange,
	getClassName,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';

import Title from '../../styles/Title';
import Input from '../../styles/Input';
import { UL, Radio } from '../../styles/FormControlList';
import { connect } from '../../utils';

class SingleList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: '',
			options: [],
			searchTerm: '',
		};
		this.type = 'term';
		this.locked = false;
		this.internalComponent = `${props.componentId}__internal`;
	}

	componentWillMount() {
		this.props.addComponent(this.internalComponent);
		this.props.addComponent(this.props.componentId);
		this.updateQueryOptions(this.props);

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
			this.props.options,
			nextProps.options,
			() => {
				this.setState({
					options: nextProps.options[nextProps.dataField]
						? nextProps.options[nextProps.dataField].buckets
						: [],
				});
			},
		);
		checkSomePropChange(
			this.props,
			nextProps,
			['size', 'sortBy'],
			() => this.updateQueryOptions(nextProps),
		);

		checkPropChange(
			this.props.dataField,
			nextProps.dataField,
			() => {
				this.updateQueryOptions(nextProps);
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
		this.props.removeComponent(this.internalComponent);
	}

	setReact = (props) => {
		const { react } = props;
		if (react) {
			const newReact = pushToAndClause(react, this.internalComponent);
			props.watchComponent(props.componentId, newReact);
		} else {
			props.watchComponent(props.componentId, { and: this.internalComponent });
		}
	};

	defaultQuery = (value, props) => {
		if (this.props.selectAllLabel && this.props.selectAllLabel === value) {
			if (this.props.showMissing === true) {
				return {};
			}
			return {
				exists: {
					field: props.dataField,
				},
			};
		} else if (value) {
			if (this.props.showMissing === true && value === this.props.missingLabel) {
				return {
					bool: {
						must_not: {
							exists: { field: props.dataField },
						},
					},
				};
			}
			return {
				[this.type]: {
					[props.dataField]: value,
				},
			};
		}
		return null;
	};

	setValue = (nextValue, props = this.props) => {
		// ignore state updates when component is locked
		if (props.beforeValueChange && this.locked) {
			return;
		}

		this.locked = true;
		let value = nextValue;
		if (nextValue === this.state.currentValue) {
			value = '';
		}

		const performUpdate = () => {
			this.setState({
				currentValue: value,
			}, () => {
				this.updateQuery(value, props);
				this.locked = false;
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

		const { onQueryChange = null } = props;

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

	updateQueryOptions = (props) => {
		const queryOptions = getQueryOptions(props);
		queryOptions.aggs = {
			[props.dataField]: {
				terms: {
					field: props.dataField,
					size: props.size,
					order: getAggsOrder(props.sortBy),
					...(this.props.showMissing ? { missing: this.props.missingLabel } : {}),
				},
			},
		};
		props.setQueryOptions(this.internalComponent, queryOptions);
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

		if (this.state.options.length === 0) {
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
								<li key={selectAllLabel} className={`${this.state.currentValue === selectAllLabel ? 'active' : ''}`}>
									<Radio
										className={getClassName(this.props.innerClass, 'radio')}
										id={`${this.props.componentId}-${selectAllLabel}`}
										name={this.props.componentId}
										value={selectAllLabel}
										onClick={this.handleClick}
										readOnly
										checked={this.state.currentValue === selectAllLabel}
										show={this.props.showRadio}
									/>
									<label
										className={getClassName(this.props.innerClass, 'label') || null}
										htmlFor={`${this.props.componentId}-${selectAllLabel}`}
									>
										{selectAllLabel}
									</label>
								</li>
							)
							: null
					}
					{
						this.state.options
							.filter((item) => {
								if (String(item.key).length) {
									if (this.props.showSearch && this.state.searchTerm) {
										return String(item.key).toLowerCase()
											.includes(this.state.searchTerm.toLowerCase());
									}
									return true;
								}
								return false;
							})
							.map(item => (
								<li key={item.key} className={`${this.state.currentValue === String(item.key) ? 'active' : ''}`}>
									<Radio
										className={getClassName(this.props.innerClass, 'radio')}
										id={`${this.props.componentId}-${item.key}`}
										name={this.props.componentId}
										value={item.key}
										readOnly
										onClick={this.handleClick}
										checked={this.state.currentValue === String(item.key)}
										show={this.props.showRadio}
									/>
									<label
										className={getClassName(this.props.innerClass, 'label') || null}
										htmlFor={`${this.props.componentId}-${item.key}`}
									>
										{item.key}
										{
											this.props.showCount
											&& ` (${item.doc_count})`
										}
									</label>
								</li>
							))
					}
				</UL>
			</div>
		);
	}
}

SingleList.propTypes = {
	componentId: types.stringRequired,
	addComponent: types.funcRequired,
	dataField: types.stringRequired,
	sortBy: types.sortByWithCount,
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	defaultSelected: types.string,
	react: types.react,
	options: types.options,
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
	size: types.number,
	showCount: types.bool,
	showSearch: types.bool,
	selectAllLabel: types.string,
	style: types.style,
	showMissing: types.bool,
	missingLabel: types.string,
	className: types.string,
	innerClass: types.style,
};

SingleList.defaultProps = {
	size: 100,
	sortBy: 'count',
	showRadio: true,
	URLParams: false,
	showCount: true,
	showFilter: true,
	showMissing: false,
	missingLabel: 'N/A',
	placeholder: 'Search',
	showSearch: true,
	style: {},
	className: null,
};

const mapStateToProps = (state, props) => ({
	options: state.aggregations[props.componentId],
	selectedValue: (state.selectedValues[props.componentId]
		&& state.selectedValues[props.componentId].value) || '',
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
});

export default connect(mapStateToProps, mapDispatchtoProps)(SingleList);
