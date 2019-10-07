import React, { Component } from 'react';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
	setQueryListener,
	setComponentProps,
	updateComponentProps,
} from '@appbaseio/reactivecore/lib/actions';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {
	isEqual,
	getQueryOptions,
	pushToAndClause,
	checkValueChange,
	checkPropChange,
	checkSomePropChange,
	getClassName,
	getOptionsFromQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';

import { getAggsQuery, getCompositeAggsQuery, updateInternalQuery } from './utils';
import Title from '../../styles/Title';
import Container from '../../styles/Container';
import Button, { loadMoreContainer } from '../../styles/Button';
import Dropdown from '../shared/Dropdown';
import {
	connect,
	isFunction,
	getComponent,
	hasCustomRenderer,
	isEvent,
	isIdentical,
	getValidPropsKeys,
	parseValueArray,
} from '../../utils';

class MultiDropdownList extends Component {
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
			options: [],
			after: {}, // for composite aggs
			isLastBucket: false,
		};
		this.locked = false;
		this.internalComponent = `${props.componentId}__internal`;

		props.addComponent(this.internalComponent);
		props.addComponent(props.componentId);
		props.setQueryListener(props.componentId, props.onQueryChange, props.onError);
		props.setComponentProps(props.componentId, {
			...props,
			componentType: componentTypes.multiDropdownList,
		});
		this.updateQueryOptions(props);

		this.setReact(props);
		const hasMounted = false;

		if (currentValueArray.length) {
			this.setValue(currentValueArray, true, props, hasMounted);
		}
	}

	componentDidUpdate(prevProps) {
		checkSomePropChange(this.props, prevProps, getValidPropsKeys(this.props), () => {
			this.props.updateComponentProps(this.props.componentId, this.props);
		});
		checkPropChange(this.props.react, prevProps.react, () => this.setReact(this.props));
		checkPropChange(this.props.options, prevProps.options, () => {
			const { showLoadMore, dataField } = this.props;
			const { options } = this.state;
			if (showLoadMore) {
				// append options with showLoadMore
				const { buckets } = this.props.options[dataField];
				const nextOptions = [
					...options,
					...buckets.map(bucket => ({
						key: bucket.key[dataField],
						doc_count: bucket.doc_count,
					})),
				];
				const after = this.props.options[dataField].after_key;
				// detect the last bucket by checking if the next set of buckets were empty
				const isLastBucket = !buckets.length;
				this.setState(
					{
						after: {
							after,
						},
						isLastBucket,
						options: nextOptions,
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
			} else {
				this.setState(
					{
						options: this.props.options[dataField]
							? this.props.options[dataField].buckets
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
		// Treat defaultQuery and customQuery as reactive props
		if (!isIdentical(this.props.defaultQuery, prevProps.defaultQuery)) {
			this.updateDefaultQuery();
			this.updateQuery([], this.props);
		}

		if (!isIdentical(this.props.customQuery, prevProps.customQuery)) {
			this.updateQuery(Object.keys(this.state.currentValue), this.props);
		}

		checkSomePropChange(this.props, prevProps, ['size', 'sortBy'], () =>
			this.updateQueryOptions(this.props),
		);

		checkPropChange(this.props.dataField, prevProps.dataField, () => {
			this.updateQueryOptions(this.props);
			this.updateQuery(Object.keys(this.state.currentValue), this.props);
		});

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
			const { value, onChange } = this.props;
			if (value === undefined) {
				this.setValue(this.props.selectedValue || [], true);
			} else if (onChange) {
				onChange(this.props.selectedValue || null);
			} else {
				const selectedListItems = Object.keys(this.state.currentValue);
				this.setValue(selectedListItems, true);
			}
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

		if (selectAllLabel && value.includes(selectAllLabel)) {
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
				this.locked = false;
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
		let query = MultiDropdownList.defaultQuery(value, props);
		let customQueryOptions;
		if (customQuery) {
			({ query } = customQuery(value, props) || {});
			customQueryOptions = getOptionsFromQuery(customQuery(value, props));
		}
		props.setQueryOptions(props.componentId, customQueryOptions);
		props.updateQuery({
			componentId: props.componentId,
			query,
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: componentTypes.multiDropdownList,
		});
	};

	updateDefaultQuery = (queryOptions) => {
		updateInternalQuery(
			this.internalComponent,
			queryOptions,
			Object.keys(this.state.currentValue),
			this.props,
			MultiDropdownList.generateQueryOptions(this.props, this.state.prevAfter),
		);
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
		const queryOptions = MultiDropdownList.generateQueryOptions(
			props,
			addAfterKey ? this.state.after : {},
		);
		if (props.defaultQuery) {
			this.updateDefaultQuery(queryOptions);
		} else {
			props.setQueryOptions(this.internalComponent, queryOptions);
		}
	};

	handleLoadMore = () => {
		this.updateQueryOptions(this.props, true);
	};

	handleChange = (e) => {
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

	getComponent = (items, downshiftProps) => {
		const { error, isLoading } = this.props;
		const { currentValue } = this.state;
		const data = {
			error,
			loading: isLoading,
			value: currentValue,
			data: items || [],
			handleChange: this.handleChange,
			downshiftProps,
		};
		return getComponent(data, this.props);
	};

	render() {
		const {
			showLoadMore, loadMoreLabel, error, renderError, isLoading, loader,
		} = this.props;
		const { isLastBucket } = this.state;
		let selectAll = [];

		if (isLoading && loader) {
			return loader;
		}

		if (renderError && error) {
			return isFunction(renderError) ? renderError(error) : renderError;
		}

		if (!this.hasCustomRenderer && this.state.options.length === 0) {
			if (this.props.renderNoResults && !this.props.isLoading) {
				return this.props.renderNoResults();
			}

			return null;
		}

		if (this.props.selectAllLabel) {
			selectAll = [
				{
					key: this.props.selectAllLabel,
				},
			];
		}
		return (
			<Container style={this.props.style} className={this.props.className}>
				{this.props.title && (
					<Title className={getClassName(this.props.innerClass, 'title') || null}>
						{this.props.title}
					</Title>
				)}
				<Dropdown
					innerClass={this.props.innerClass}
					items={[
						...selectAll,
						...this.state.options
							.filter(item => String(item.key).trim().length)
							.map(item => ({ ...item, key: String(item.key) })),
					]}
					onChange={this.handleChange}
					selectedItem={this.state.currentValue}
					placeholder={this.props.placeholder}
					searchPlaceholder={this.props.searchPlaceholder}
					labelField="key"
					multi
					showCount={this.props.showCount}
					themePreset={this.props.themePreset}
					renderItem={this.props.renderItem}
					hasCustomRenderer={this.hasCustomRenderer}
					customRenderer={this.getComponent}
					customLabelRenderer={this.props.renderLabel}
					renderNoResults={this.props.renderNoResults}
					showSearch={this.props.showSearch}
					transformData={this.props.transformData}
					footer={
						showLoadMore
						&& !isLastBucket && (
							<div css={loadMoreContainer}>
								<Button onClick={this.handleLoadMore}>{loadMoreLabel}</Button>
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
	setComponentProps: types.funcRequired,
	updateComponentProps: types.funcRequired,
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
	defaultValue: types.stringArray,
	value: types.stringArray,
	filterLabel: types.string,
	innerClass: types.style,
	loader: types.title,
	onQueryChange: types.func,
	onValueChange: types.func,
	onChange: types.func,
	onError: types.func,
	placeholder: types.string,
	searchPlaceholder: types.string,
	queryFormat: types.queryFormatSearch,
	react: types.react,
	render: types.func,
	renderItem: types.func,
	renderNoResults: types.func,
	renderLabel: types.func,
	renderError: types.title,
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
	loadMoreLabel: types.title,
	nestedField: types.string,
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
	isLoading: state.isLoading[props.componentId],
	themePreset: state.config.themePreset,
	error: state.error[props.componentId],
});

const mapDispatchtoProps = dispatch => ({
	setComponentProps: (component, options) => dispatch(setComponentProps(component, options)),
	updateComponentProps: (component, options) =>
		dispatch(updateComponentProps(component, options)),
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => <MultiDropdownList ref={props.myForwardedRef} {...props} />);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, MultiDropdownList);

ForwardRefComponent.name = 'MultiDropdownList';
export default ForwardRefComponent;
