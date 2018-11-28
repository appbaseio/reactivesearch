import React, { Component } from 'react';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
	setQueryListener,
	loadMore,
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
import Input from '../../styles/Input';
import Button, { loadMoreContainer } from '../../styles/Button';
import Container from '../../styles/Container';
import { UL, Checkbox } from '../../styles/FormControlList';
import { connect } from '../../utils';

class MultiList extends Component {
	constructor(props) {
		super(props);

		const defaultValue = props.defaultValue || props.value;
		const currentValueArray = props.selectedValue || defaultValue || [];
		const currentValue = {};
		currentValueArray.forEach((item) => {
			currentValue[item] = true;
		});

		this.state = {
			currentValue,
			options:
				props.options && props.options[props.dataField]
					? this.getOptions(props.options[props.dataField].buckets, props)
					: [],
			searchTerm: '',
			after: {}, // for composite aggs
			isLastBucket: false,
		};
		this.locked = false;
		this.internalComponent = `${props.componentId}__internal`;
		props.setQueryListener(props.componentId, props.onQueryChange, null);

		props.addComponent(this.internalComponent);
		props.addComponent(props.componentId);
		this.updateQueryOptions(props);

		this.setReact(props);
		const hasMounted = false;

		if (currentValueArray.length) {
			this.setValue(currentValueArray, true, props, hasMounted);
		}
	}

	componentDidUpdate(prevProps) {
		checkPropChange(
			this.props.react,
			prevProps.react,
			() => this.setReact(this.props),
		);
		checkPropChange(
			this.props.options,
			prevProps.options,
			() => {
				const { showLoadMore, dataField, options } = this.props;
				if (showLoadMore) {
					const { buckets } = options[dataField];
					const after = options[dataField].after_key;
					// detect the last bucket by checking if the after key is absent
					const isLastBucket = !after;
					this.setState(state => ({
						...state,
						after: after ? { after } : state.after,
						isLastBucket,
						options: this.getOptions(buckets, this.props),
					}));
				} else {
					this.setState({
						options: options[dataField]
							? this.getOptions(
								options[dataField].buckets,
								this.props,
							)
							: [],
					});
				}
			},
		);
		checkSomePropChange(
			this.props,
			prevProps,
			['size', 'sortBy'],
			() => this.updateQueryOptions(this.props),
		);

		checkSomePropChange(
			this.props,
			prevProps,
			['dataField', 'nestedField'],
			() => {
				this.updateQueryOptions(this.props);
				this.updateQuery(Object.keys(this.state.currentValue), this.props);
			},
		);

		let selectedValue = Object.keys(this.state.currentValue);
		const { selectAllLabel } = this.props;

		if (selectAllLabel) {
			selectedValue = selectedValue.filter(val => val !== selectAllLabel);
			if (this.state.currentValue[selectAllLabel]) {
				selectedValue = [selectAllLabel];
			}
		}

		if (this.props.value !== prevProps.value) {
			this.setValue(this.props.value, true);
		} else if (
			!isEqual(selectedValue, this.props.selectedValue)
			&& !isEqual(this.props.selectedValue, prevProps.selectedValue)
		) {
			this.setValue(this.props.selectedValue || [], true);
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
			props.watchComponent(props.componentId, {
				and: this.internalComponent,
			});
		}
	};

	getOptions = (buckets, props) => {
		if (props.showLoadMore) {
			return buckets.map(bucket => ({
				key: bucket.key[props.dataField],
				doc_count: bucket.doc_count,
			}));
		}

		return buckets;
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
				const queryArray = value.map(item => ({
					[type]: {
						[props.dataField]: item,
					},
				}));
				listQuery = {
					bool: {
						must: queryArray,
					},
				};
			}

			query = value.length ? listQuery : null;
		}

		if (query && props.nestedField) {
			return {
				query: {
					nested: {
						path: props.nestedField,
						query,
					},
				},
			};
		}

		return query;
	};

	setValue = (value, isDefaultValue = false, props = this.props, hasMounted = true) => {
		// ignore state updates when component is locked
		if (props.beforeValueChange && this.locked) {
			return;
		}

		this.locked = true;
		const { selectAllLabel } = this.props;
		let { currentValue } = this.state;
		let finalValues = null;

		if (
			selectAllLabel
			&& ((Array.isArray(value) && value.includes(selectAllLabel))
				|| (typeof value === 'string' && value === selectAllLabel))
		) {
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
			const handleUpdates = () => {
				this.updateQuery(finalValues, props);
				this.locked = false;
				if (props.onValueChange) props.onValueChange(finalValues);
			};

			if (hasMounted) {
				this.setState({
					currentValue,
				}, handleUpdates);
			} else {
				handleUpdates();
			}
		};

		checkValueChange(props.componentId, finalValues, props.beforeValueChange, performUpdate);
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
			componentType: 'MULTILIST',
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
		const queryOptions = MultiList.generateQueryOptions(
			props,
			addAfterKey ? this.state.after : {},
		);
		props.setQueryOptions(this.internalComponent, queryOptions);
	};

	handleInputChange = (e) => {
		const { value } = e.target;
		this.setState({
			searchTerm: value,
		});
	};

	handleLoadMore = () => {
		const queryOptions = MultiList.generateQueryOptions(this.props, this.state.after);
		this.props.loadMore(this.props.componentId, queryOptions);
	};

	renderSearch = () => {
		if (this.props.showSearch) {
			return (
				<Input
					className={getClassName(this.props.innerClass, 'input') || null}
					onChange={this.handleInputChange}
					value={this.state.searchTerm}
					placeholder={this.props.placeholder}
					style={{
						margin: '0 0 8px',
					}}
					themePreset={this.props.themePreset}
				/>
			);
		}
		return null;
	};

	handleClick = (e) => {
		const { value, onChange } = this.props;
		if (value) {
			if (onChange) onChange(e);
		} else {
			this.setValue(e.target.value);
		}
	};

	render() {
		const {
			selectAllLabel, renderListItem, showLoadMore, loadMoreLabel,
		} = this.props;
		const { isLastBucket } = this.state;

		if (this.state.options.length === 0) {
			return null;
		}

		let { options: itemsToRender } = this.state;

		if (this.props.transformData) {
			itemsToRender = this.props.transformData(itemsToRender);
		}

		return (
			<Container style={this.props.style} className={this.props.className}>
				{this.props.title && (
					<Title className={getClassName(this.props.innerClass, 'title') || null}>
						{this.props.title}
					</Title>
				)}
				{this.renderSearch()}
				<UL className={getClassName(this.props.innerClass, 'list') || null}>
					{selectAllLabel ? (
						<li
							key={selectAllLabel}
							className={`${this.state.currentValue[selectAllLabel] ? 'active' : ''}`}
						>
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
					) : null}
					{itemsToRender
						.filter((item) => {
							if (String(item.key).length) {
								if (this.props.showSearch && this.state.searchTerm) {
									return String(item.key)
										.toLowerCase()
										.includes(this.state.searchTerm.toLowerCase());
								}
								return true;
							}
							return false;
						})
						.map(item => (
							<li
								key={item.key}
								className={`${this.state.currentValue[item.key] ? 'active' : ''}`}
							>
								<Checkbox
									className={
										getClassName(this.props.innerClass, 'checkbox') || null
									}
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
									{renderListItem ? (
										renderListItem(item.key, item.doc_count)
									) : (
										<span>
											{item.key}
											{this.props.showCount && (
												<span
													className={
														getClassName(
															this.props.innerClass,
															'count',
														) || null
													}
												>
													&nbsp;({item.doc_count})
												</span>
											)}
										</span>
									)}
								</label>
							</li>
						))}
					{showLoadMore
						&& !isLastBucket && (
						<div css={loadMoreContainer}>
							<Button onClick={this.handleLoadMore}>{loadMoreLabel}</Button>
						</div>
					)}
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
	loadMore: types.funcRequired,
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
	nestedField: types.string,
	defaultValue: types.stringArray,
	value: types.stringArray,
	filterLabel: types.string,
	innerClass: types.style,
	onQueryChange: types.func,
	onValueChange: types.func,
	onChange: types.func,
	placeholder: types.string,
	queryFormat: types.queryFormatSearch,
	react: types.react,
	renderListItem: types.func,
	transformData: types.func,
	selectAllLabel: types.string,
	showCheckbox: types.boolRequired,
	showCount: types.bool,
	showSearch: types.bool,
	size: types.number,
	sortBy: types.sortByWithCount,
	style: types.style,
	themePreset: types.themePreset,
	title: types.title,
	URLParams: types.bool,
	showMissing: types.bool,
	missingLabel: types.string,
	showLoadMore: types.bool,
	loadMoreLabel: types.title,
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
	showLoadMore: false,
	loadMoreLabel: 'Load More',
};

const mapStateToProps = (state, props) => ({
	options:
		props.nestedField && state.aggregations[props.componentId]
			? state.aggregations[props.componentId].reactivesearch_nested
			: state.aggregations[props.componentId],
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	themePreset: state.config.themePreset,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
	loadMore: (component, aggsQuery) => dispatch(loadMore(component, aggsQuery, true, true)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
});

export default connect(
	mapStateToProps,
	mapDispatchtoProps,
)(MultiList);
