import React, { Component } from 'react';

import {
	updateQuery,
	setQueryOptions,
	loadMore,
	setCustomQuery,
	setDefaultQuery,
} from '@appbaseio/reactivecore/lib/actions';
import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import {
	isEqual,
	getQueryOptions,
	checkValueChange,
	checkPropChange,
	checkSomePropChange,
	getClassName,
	getOptionsFromQuery,
	getAggsQuery,
	getCompositeAggsQuery,
	updateInternalQuery,
	updateCustomQuery,
	updateDefaultQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';

import Title from '../../styles/Title';
import Input from '../../styles/Input';
import Button, { loadMoreContainer } from '../../styles/Button';
import Container from '../../styles/Container';
import { UL, Checkbox } from '../../styles/FormControlList';
import {
	connect,
	isFunction,
	getComponent,
	hasCustomRenderer,
	isEvent,
	parseValueArray,
	isQueryIdentical,
} from '../../utils';
import ComponentWrapper from '../basic/ComponentWrapper';

class MultiList extends Component {
	constructor(props) {
		super(props);

		const defaultValue = props.defaultValue || props.value;
		const currentValueArray = props.selectedValue || defaultValue || [];
		const currentValue = {};
		currentValueArray.forEach((item) => {
			currentValue[item] = true;
		});

		const options
			= props.options && props.options[props.dataField]
				? this.getOptions(props.options[props.dataField].buckets, props)
				: [];

		this.state = {
			currentValue,
			options,
			searchTerm: '',
			after: {}, // for composite aggs,
			prevAfter: {}, // useful when we want to prevent the showLoadMore results
			isLastBucket: false,
		};
		this.internalComponent = getInternalComponentID(props.componentId);

		// Set custom and default queries in store
		updateCustomQuery(props.componentId, props, currentValueArray);
		updateDefaultQuery(props.componentId, props, currentValueArray);

		this.updateQueryOptions(props);

		const hasMounted = false;

		if (currentValueArray.length) {
			this.setValue(currentValueArray, true, props, hasMounted);
		}
	}

	componentDidUpdate(prevProps) {
		checkPropChange(this.props.options, prevProps.options, () => {
			const { showLoadMore, dataField, options } = this.props;
			if (showLoadMore && options && options[dataField]) {
				const { buckets } = options[dataField];
				const after = options[dataField].after_key;
				const prevAfter
					= prevProps.options
					&& prevProps.options[dataField]
					&& prevProps.options[dataField].after_key;
				// detect the last bucket by checking if the after key is absent
				const isLastBucket = !after;
				this.setState(
					state => ({
						...state,
						prevAfter: prevAfter ? { after: prevAfter } : state.prevAfter,
						after: after ? { after } : state.after,
						isLastBucket,
						options: this.getOptions(buckets, this.props),
					}),
					() => {
						// this will ensure that the Select-All (or any)
						// value gets handled on the initial load and
						// consecutive loads
						const { currentValue } = this.state;
						const value = Object.keys(currentValue).filter(item => currentValue[item]);
						if (value.length) this.setValue(value, true);
					},
				);
			} else {
				this.setState(
					{
						options:
							options && options[dataField]
								? this.getOptions(options[dataField].buckets, this.props)
								: [],
					},
					() => {
						// this will ensure that the Select-All (or any)
						// value gets handled on the initial load and
						// consecutive loads
						const { currentValue } = this.state;
						const value = Object.keys(currentValue).filter(item => currentValue[item]);
						if (value.length) this.setValue(value, true);
					},
				);
			}
		});
		const valueArray
			= typeof this.state.currentValue === 'object' ? Object.keys(this.state.currentValue) : [];
		// Treat defaultQuery and customQuery as reactive props
		if (!isQueryIdentical(valueArray, this.props, prevProps, 'defaultQuery')) {
			this.updateDefaultQuery();
			this.updateQuery([], this.props);
		}

		if (!isQueryIdentical(valueArray, this.props, prevProps, 'customQuery')) {
			this.updateQuery(valueArray, this.props);
		}

		checkSomePropChange(this.props, prevProps, ['size', 'sortBy'], () =>
			this.updateQueryOptions(this.props),
		);

		checkSomePropChange(this.props, prevProps, ['dataField', 'nestedField'], () => {
			this.updateQueryOptions(this.props);
			this.updateQuery(valueArray, this.props);
		});

		let selectedValue = valueArray;
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
			const { value, onChange } = this.props;
			if (value === undefined) {
				this.setValue(this.props.selectedValue || [], true);
			} else if (onChange) {
				onChange(this.props.selectedValue || null);
			} else {
				const selectedListItems = valueArray;
				this.setValue(selectedListItems, true);
			}
		}
	}

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
				let should = [
					{
						[type]: {
							[props.dataField]: value.filter(item => item !== props.missingLabel),
						},
					},
				];
				if (props.showMissing) {
					const hasMissingTerm = value.includes(props.missingLabel);
					if (hasMissingTerm) {
						should = should.concat({
							bool: {
								must_not: {
									exists: { field: props.dataField },
								},
							},
						});
					}
				}
				listQuery = {
					bool: {
						should,
					},
				};
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
				nested: {
					path: props.nestedField,
					query,
				},
			};
		}

		return query;
	};

	setValue = (value, isDefaultValue = false, props = this.props, hasMounted = true) => {
		const { selectAllLabel } = props;
		let { currentValue } = this.state;
		let finalValues = null;

		if (
			selectAllLabel
			&& ((Array.isArray(value) && value.includes(selectAllLabel))
				|| (typeof value === 'string' && value === selectAllLabel))
		) {
			if (currentValue[selectAllLabel] && hasMounted && !isDefaultValue) {
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
				if (props.onValueChange) props.onValueChange(finalValues);
			};

			if (hasMounted) {
				this.setState(
					{
						currentValue,
					},
					handleUpdates,
				);
			} else {
				handleUpdates();
			}
		};

		checkValueChange(props.componentId, finalValues, props.beforeValueChange, performUpdate);
	};

	updateQuery = (value, props) => {
		const { customQuery } = props;
		let query = MultiList.defaultQuery(value, props);
		let customQueryOptions;
		if (customQuery) {
			({ query } = customQuery(value, props) || {});
			customQueryOptions = getOptionsFromQuery(customQuery(value, props));
			updateCustomQuery(props.componentId, props, value);
		}
		props.setQueryOptions(props.componentId, {
			...MultiList.generateQueryOptions(props, this.state.prevAfter, this.state.currentValue),
			...customQueryOptions,
		});

		props.updateQuery({
			componentId: props.componentId,
			query,
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: componentTypes.multiList,
		});
	};

	updateDefaultQuery = (queryOptions) => {
		updateInternalQuery(
			this.internalComponent,
			queryOptions,
			Object.keys(this.state.currentValue),
			this.props,
			MultiList.generateQueryOptions(
				this.props,
				this.state.prevAfter,
				this.state.currentValue,
			),
			null,
		);
	};

	static generateQueryOptions(props, after, value = {}) {
		const queryOptions = getQueryOptions(props);
		const valueArray = Object.keys(value);
		return props.showLoadMore
			? getCompositeAggsQuery(valueArray, queryOptions, props, after)
			: getAggsQuery(valueArray, queryOptions, props);
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
			this.state.currentValue,
		);
		if (props.defaultQuery) {
			this.updateDefaultQuery(queryOptions);
		} else {
			props.setQueryOptions(this.internalComponent, queryOptions);
		}
	};

	handleInputChange = (e) => {
		const { value } = e.target;
		this.setState({
			searchTerm: value,
		});
	};

	handleLoadMore = () => {
		const queryOptions = MultiList.generateQueryOptions(
			this.props,
			this.state.after,
			this.state.currentValue,
		);
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
					aria-label={`${this.props.componentId}-search`}
					themePreset={this.props.themePreset}
				/>
			);
		}
		return null;
	};

	handleClick = (e) => {
		let currentValue = e;
		if (isEvent(e)) {
			currentValue = e.target.value;
		}
		const { value, onChange } = this.props;
		if (value === undefined) {
			this.setValue(currentValue);
		} else if (onChange) {
			onChange(parseValueArray(this.props.value, currentValue));
		}
	};

	get hasCustomRenderer() {
		return hasCustomRenderer(this.props);
	}

	get listItems() {
		let { options: itemsToRender } = this.state;

		if (this.props.transformData) {
			itemsToRender = this.props.transformData(itemsToRender);
		}

		const listItems = itemsToRender.filter((item) => {
			if (String(item.key).length) {
				if (this.props.showSearch && this.state.searchTerm) {
					return String(item.key)
						.toLowerCase()
						.includes(this.state.searchTerm.toLowerCase());
				}
				return true;
			}
			return false;
		});
		return listItems;
	}

	getComponent() {
		const { error, isLoading, rawData } = this.props;
		const { currentValue } = this.state;
		const data = {
			error,
			loading: isLoading,
			value: currentValue,
			data: this.listItems,
			handleChange: this.handleClick,
			rawData,
		};
		return getComponent(data, this.props);
	}

	render() {
		const {
			selectAllLabel,
			renderItem,
			showLoadMore,
			loadMoreLabel,
			renderError,
			error,
			isLoading,
		} = this.props;
		const { isLastBucket } = this.state;

		if (this.props.isLoading && this.props.loader) {
			return this.props.loader;
		}

		if (renderError && error) {
			return isFunction(renderError) ? renderError(error) : renderError;
		}

		if (!this.hasCustomRenderer && this.state.options && this.state.options.length === 0) {
			return this.props.renderNoResults ? this.props.renderNoResults() : null;
		}

		const listItems = this.listItems;

		const isAllChecked = selectAllLabel ? !!this.state.currentValue[selectAllLabel] : false;
		return (
			<Container style={this.props.style} className={this.props.className}>
				{this.props.title && (
					<Title className={getClassName(this.props.innerClass, 'title') || null}>
						{this.props.title}
					</Title>
				)}
				{this.renderSearch()}
				{this.hasCustomRenderer ? (
					this.getComponent()
				) : (
					<UL
						className={getClassName(this.props.innerClass, 'list') || null}
						role="listbox"
						aria-label={`${this.props.componentId}-items`}
					>
						{selectAllLabel ? (
							<li
								key={selectAllLabel}
								className={`${isAllChecked ? 'active' : ''}`}
								role="option"
								aria-checked={isAllChecked}
								aria-selected={isAllChecked}
							>
								<Checkbox
									className={
										getClassName(this.props.innerClass, 'checkbox') || null
									}
									id={`${this.props.componentId}-${selectAllLabel}`}
									name={selectAllLabel}
									value={selectAllLabel}
									onChange={this.handleClick}
									checked={isAllChecked}
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
						{listItems.length
							? listItems.map((item) => {
								const isChecked = !!this.state.currentValue[item.key];
								return (
									<li
										key={item.key}
										className={`${
											isChecked ? 'active' : ''
										}`}
										role="option"
										aria-checked={isChecked}
										aria-selected={isChecked}
									>
										<Checkbox
											className={
												getClassName(this.props.innerClass, 'checkbox') || null
											}
											id={`${this.props.componentId}-${item.key}`}
											name={`${this.props.componentId}-${item.key}`}
											value={item.key}
											onChange={this.handleClick}
											checked={isChecked}
											show={this.props.showCheckbox}
										/>
										<label
											className={
												getClassName(this.props.innerClass, 'label') || null
											}
											htmlFor={`${this.props.componentId}-${item.key}`}
										>
											{renderItem ? (
												renderItem(
													item.key,
													item.doc_count,
													isChecked,
												)
											) : (
												<span>
													<span>{item.key}</span>
													{this.props.showCount && (
														<span
															className={
																getClassName(
																	this.props.innerClass,
																	'count',
																) || null
															}
														>
															{item.doc_count}
														</span>
													)}
												</span>
											)}
										</label>
									</li>
								);
							}) // prettier-ignore
							: this.props.renderNoResults && this.props.renderNoResults()}
						{showLoadMore && !isLastBucket && (
							<div css={loadMoreContainer}>
								<Button disabled={isLoading} onClick={this.handleLoadMore}>
									{loadMoreLabel}
								</Button>
							</div>
						)}
					</UL>
				)}
			</Container>
		);
	}
}

MultiList.propTypes = {
	setQueryOptions: types.funcRequired,
	loadMore: types.funcRequired,
	updateQuery: types.funcRequired,

	options: types.options,
	rawData: types.rawData,
	selectedValue: types.selectedValue,
	setCustomQuery: types.funcRequired,
	isLoading: types.bool,
	error: types.title,
	// component props
	beforeValueChange: types.func,
	children: types.func,
	className: types.string,
	componentId: types.stringRequired,
	customQuery: types.func,
	defaultQuery: types.func,
	dataField: types.stringRequired,
	nestedField: types.string,
	defaultValue: types.stringArray,
	value: types.stringArray,
	filterLabel: types.string,
	innerClass: types.style,
	loader: types.title,
	onError: types.func,
	renderNoResults: types.func,
	onQueryChange: types.func,
	onValueChange: types.func,
	onChange: types.func,
	placeholder: types.string,
	queryFormat: types.queryFormatSearch,
	react: types.react,
	render: types.func,
	renderItem: types.func,
	renderError: types.title,
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

// Add componentType for SSR
MultiList.componentType = componentTypes.multiList;

const mapStateToProps = (state, props) => ({
	options:
		props.nestedField && state.aggregations[props.componentId]
			? state.aggregations[props.componentId].reactivesearch_nested
			: state.aggregations[props.componentId],
	rawData: state.rawData[props.componentId],
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	isLoading: state.isLoading[props.componentId],
	themePreset: state.config.themePreset,
	error: state.error[props.componentId],
});

const mapDispatchtoProps = dispatch => ({
	setCustomQuery: (component, query) => dispatch(setCustomQuery(component, query)),
	setDefaultQuery: (component, query) => dispatch(setDefaultQuery(component, query)),

	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
	loadMore: (component, aggsQuery) => dispatch(loadMore(component, aggsQuery, true, true)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => (
	<ComponentWrapper {...props} internalComponent componentType={componentTypes.multiList}>
		{() => <MultiList ref={props.myForwardedRef} {...props} />}
	</ComponentWrapper>
));

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, MultiList);

ForwardRefComponent.name = 'MultiList';
export default ForwardRefComponent;
