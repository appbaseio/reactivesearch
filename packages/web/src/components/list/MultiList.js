import React, { Component } from 'react';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
	setQueryListener,
} from '@appbaseio/reactivecore/lib/actions';
import {
	isEqual,
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
import Container from '../../styles/Container';
import { UL, Checkbox } from '../../styles/FormControlList';
import { connect } from '../../utils';

class MultiList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: {},
			options: (props.options && props.options[props.dataField])
				? props.options[props.dataField].buckets
				: [],
			searchTerm: '',
		};
		this.locked = false;
		this.internalComponent = `${props.componentId}__internal`;
		props.setQueryListener(props.componentId, props.onQueryChange, null);
	}

	componentWillMount() {
		this.props.addComponent(this.internalComponent);
		this.props.addComponent(this.props.componentId);
		this.updateQueryOptions(this.props);

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
				this.updateQuery(Object.keys(this.state.currentValue), nextProps);
			},
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
			this.setValue(nextProps.selectedValue || [], true);
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

	static defaultQuery = (value, props) => {
		let query = null;
		const type = props.queryFormat === 'or' ? 'terms' : 'term';

		if (!Array.isArray(value) || value.length === 0) {
			return null;
		}

		if (props.selectAllLabel && value.includes(props.selectAllLabel)) {
			if (props.showMissing) {
				query = { match_all: {} };
			} else {
				query = {
					exists: {
						field: props.dataField,
					},
				};
			}
		} else if (value) {
			let listQuery;
			if (props.queryFormat === 'or') {
				if (props.showMissing) {
					const hasMissingTerm = value.includes(props.missingLabel);
					let should = [
						{
							[type]: {
								[props.dataField]: value.filter(item => item !== props.missingLabel),
							},
						},
					];
					if (hasMissingTerm) {
						should = should.concat({
							bool: {
								must_not: {
									exists: { field: props.dataField },
								},
							},
						});
					}
					listQuery = {
						bool: {
							should,
						},
					};
				} else {
					listQuery = {
						[type]: {
							[props.dataField]: value,
						},
					};
				}
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
		// ignore state updates when component is locked
		if (props.beforeValueChange && this.locked) {
			return;
		}

		this.locked = true;
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
				this.state.options.forEach((item) => {
					currentValue[item.key] = true;
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
				this.locked = false;
				if (props.onValueChange) props.onValueChange(finalValues);
			});
		};

		checkValueChange(
			props.componentId,
			finalValues,
			props.beforeValueChange,
			performUpdate,
		);
	};

	updateQuery = (value, props) => {
		const query = props.customQuery || MultiList.defaultQuery;

		props.updateQuery({
			componentId: props.componentId,
			query: query(value, props),
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
		});
	};

	static generateQueryOptions(props) {
		const queryOptions = getQueryOptions(props);
		queryOptions.aggs = {
			[props.dataField]: {
				terms: {
					field: props.dataField,
					size: props.size,
					order: getAggsOrder(props.sortBy || 'count'),
					...(props.showMissing ? { missing: props.missingLabel } : {}),
				},
			},
		};

		return queryOptions;
	}

	updateQueryOptions = (props) => {
		const queryOptions = MultiList.generateQueryOptions(props);
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
				themePreset={this.props.themePreset}
			/>);
		}
		return null;
	};

	handleClick = (e) => {
		this.setValue(e.target.value);
	};

	render() {
		const { selectAllLabel, renderListItem } = this.props;

		if (this.state.options.length === 0) {
			return null;
		}

		return (
			<Container style={this.props.style} className={this.props.className}>
				{this.props.title && <Title className={getClassName(this.props.innerClass, 'title') || null}>{this.props.title}</Title>}
				{this.renderSearch()}
				<UL className={getClassName(this.props.innerClass, 'list') || null}>
					{
						selectAllLabel
							? (
								<li key={selectAllLabel} className={`${this.state.currentValue[selectAllLabel] ? 'active' : ''}`}>
									<Checkbox
										className={getClassName(this.props.innerClass, 'checkbox') || null}
										id={`${this.props.componentId}-${selectAllLabel}`}
										name={selectAllLabel}
										value={selectAllLabel}
										onChange={this.handleClick}
										checked={!!this.state.currentValue[selectAllLabel]}
										show={this.props.showCheckbox}
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
								<li key={item.key} className={`${this.state.currentValue[item.key] ? 'active' : ''}`}>
									<Checkbox
										className={getClassName(this.props.innerClass, 'checkbox') || null}
										id={`${this.props.componentId}-${item.key}`}
										name={this.props.componentId}
										value={item.key}
										onChange={this.handleClick}
										checked={!!this.state.currentValue[item.key]}
										show={this.props.showCheckbox}
									/>
									<label
										className={getClassName(this.props.innerClass, 'label') || null}
										htmlFor={`${this.props.componentId}-${item.key}`}
									>
										{
											renderListItem
												? renderListItem(item.key, item.doc_count)
												: (
													<span>
														{item.key}
														{
															this.props.showCount
															&& (
																<span
																	className={
																		getClassName(this.props.innerClass, 'count')
																		|| null
																	}
																>
																	&nbsp;({item.doc_count})
																</span>
															)
														}
													</span>
												)
										}
									</label>
								</li>
							))
					}
				</UL>
			</Container>
		);
	}
}

MultiList.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	options: types.options,
	selectedValue: types.selectedValue,
	// component props
	beforeValueChange: types.func,
	className: types.string,
	componentId: types.stringRequired,
	customQuery: types.func,
	dataField: types.stringRequired,
	defaultSelected: types.stringArray,
	filterLabel: types.string,
	innerClass: types.style,
	onQueryChange: types.func,
	onValueChange: types.func,
	placeholder: types.string,
	queryFormat: types.queryFormatSearch,
	react: types.react,
	renderListItem: types.func,
	selectAllLabel: types.string,
	showCheckbox: types.boolRequired,
	showCount: types.bool,
	showSearch: types.bool,
	size: types.number,
	sortBy: types.sortByWithCount,
	style: types.style,
	themePreset: types.themePreset,
	title: types.title,
	URLParams: types.boolRequired,
	showMissing: types.bool,
	missingLabel: types.string,
};

MultiList.defaultProps = {
	className: null,
	placeholder: 'Search',
	queryFormat: 'or',
	showCheckbox: true,
	showCount: true,
	showSearch: true,
	size: 100,
	sortBy: 'count',
	style: {},
	URLParams: false,
	showMissing: false,
	missingLabel: 'N/A',
};

const mapStateToProps = (state, props) => ({
	options: state.aggregations[props.componentId],
	selectedValue: (state.selectedValues[props.componentId]
		&& state.selectedValues[props.componentId].value) || null,
	themePreset: state.config.themePreset,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
});

export default connect(mapStateToProps, mapDispatchtoProps)(MultiList);
