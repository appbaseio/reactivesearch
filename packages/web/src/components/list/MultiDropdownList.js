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
	checkPropChange,
	checkSomePropChange,
	getClassName,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';

import { getAggsQuery, getCompositeAggsQuery } from './utils';
import Title from '../../styles/Title';
import Container from '../../styles/Container';
import Button, { loadMoreContainer } from '../../styles/Button';
import Dropdown from '../shared/Dropdown';
import { connect } from '../../utils';

class MultiDropdownList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: {},
			options: [],
			after: {},	// for composite aggs
			isLastBucket: false,
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
				const { showLoadMore, dataField } = nextProps;
				const { options } = this.state;
				if (showLoadMore) {
					// append options with showLoadMore
					const { buckets } = nextProps.options[dataField];
					const nextOptions = [
						...options,
						...buckets.map(bucket => ({
							key: bucket.key[dataField],
							doc_count: bucket.doc_count,
						})),
					];
					const after = nextProps.options[dataField].after_key;
					// detect the last bucket by checking if the next set of buckets were empty
					const isLastBucket = !buckets.length;
					this.setState({
						after: {
							after,
						},
						isLastBucket,
						options: nextOptions,
					});
				} else {
					this.setState({
						options: nextProps.options[nextProps.dataField]
							? nextProps.options[nextProps.dataField].buckets
							: [],
					});
				}
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

		if (selectAllLabel && value.includes(selectAllLabel)) {
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
		const query = props.customQuery || MultiDropdownList.defaultQuery;

		props.updateQuery({
			componentId: props.componentId,
			query: query(value, props),
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: 'MULTIDROPDOWNLIST',
		});
	};

	static generateQueryOptions(props, after) {
		const queryOptions = getQueryOptions(props);
		return props.showLoadMore
			? getCompositeAggsQuery(queryOptions, props, after)
			: getAggsQuery(queryOptions, props);
	}

	updateQueryOptions = (props, addAfterKey = false) => {
		// when using composite aggs flush the current options for a fresh query
		if (props.showLoadMore && !addAfterKey) {
			this.setState({
				options: [],
			});
		}
		// for a new query due to other changes don't append after to get fresh results
		const queryOptions = MultiDropdownList
			.generateQueryOptions(props, addAfterKey ? this.state.after : {});
		props.setQueryOptions(this.internalComponent, queryOptions);
	};

	handleLoadMore = () => {
		this.updateQueryOptions(this.props, true);
	}

	render() {
		const { showLoadMore } = this.props;
		const { isLastBucket } = this.state;
		let selectAll = [];

		if (this.state.options.length === 0) {
			return null;
		}

		if (this.props.selectAllLabel) {
			selectAll = [{
				key: this.props.selectAllLabel,
			}];
		}

		return (
			<Container style={this.props.style} className={this.props.className}>
				{this.props.title && <Title className={getClassName(this.props.innerClass, 'title') || null}>{this.props.title}</Title>}
				<Dropdown
					innerClass={this.props.innerClass}
					items={
						[
							...selectAll,
							...this.state.options
								.filter(item => String(item.key).trim().length)
								.map(item => ({ ...item, key: String(item.key) })),
						]
					}
					onChange={this.setValue}
					selectedItem={this.state.currentValue}
					placeholder={this.props.placeholder}
					labelField="key"
					multi
					showCount={this.props.showCount}
					themePreset={this.props.themePreset}
					renderListItem={this.props.renderListItem}
					showSearch={this.props.showSearch}
					transformData={this.props.transformData}
					footer={
						showLoadMore && !isLastBucket && (
							<div css={loadMoreContainer}>
								<Button onClick={this.handleLoadMore}>Load More</Button>
							</div>
						)
					}
				/>
			</Container>
		);
	}
}

MultiDropdownList.propTypes = {
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
	transformData: types.func,
	selectAllLabel: types.string,
	showCount: types.bool,
	showFilter: types.bool,
	size: types.number,
	sortBy: types.sortByWithCount,
	style: types.style,
	themePreset: types.themePreset,
	title: types.title,
	URLParams: types.bool,
	showMissing: types.bool,
	missingLabel: types.string,
	showSearch: types.bool,
	showLoadMore: types.bool,
};

MultiDropdownList.defaultProps = {
	className: null,
	placeholder: 'Select values',
	queryFormat: 'or',
	showCount: true,
	showFilter: true,
	size: 100,
	sortBy: 'count',
	style: {},
	URLParams: false,
	showMissing: false,
	missingLabel: 'N/A',
	showSearch: false,
	showLoadMore: false,
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

export default connect(mapStateToProps, mapDispatchtoProps)(MultiDropdownList);
