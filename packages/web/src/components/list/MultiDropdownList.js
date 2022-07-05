import React, { Component } from 'react';

import {
	updateQuery,
	setQueryOptions,
	setCustomQuery,
	setDefaultQuery,
} from '@appbaseio/reactivecore/lib/actions';
import hoistNonReactStatics from 'hoist-non-react-statics';
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
	getComponent,
	isFunction,
	hasCustomRenderer,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';
import Title from '../../styles/Title';
import Container from '../../styles/Container';
import Button, { loadMoreContainer } from '../../styles/Button';
import Dropdown from '../shared/Dropdown';
import PreferencesConsumer from '../basic/PreferencesConsumer';
import ComponentWrapper from '../basic/ComponentWrapper';
import { connect, isEvent, parseValueArray, isQueryIdentical } from '../../utils';

class MultiDropdownList extends Component {
	constructor(props) {
		super(props);

		const defaultValue = props.defaultValue || props.value;
		const currentValueArray = props.selectedValue || defaultValue || [];
		const currentValue = {};
		currentValueArray.forEach((item) => {
			currentValue[item] = true;
		});
		const dataField = props.dataField;

		this.state = {
			currentValue,
			options:
				props.options && props.options[dataField] ? props.options[dataField].buckets : [],
			after: {}, // for composite aggs
			isLastBucket: false,
		};
		this.internalComponent = getInternalComponentID(props.componentId);

		// Set custom and default queries in store
		updateCustomQuery(props.componentId, props, currentValue);
		updateDefaultQuery(props.componentId, props, currentValue);
		this.updateQueryOptions(props);

		const hasMounted = false;

		if (currentValueArray.length) {
			this.setValue(currentValueArray, true, props, hasMounted);
		}
	}

	componentDidMount() {
		const { enableAppbase, index } = this.props;
		if (!enableAppbase && index) {
			console.warn(
				'Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.',
			);
		}
	}

	componentDidUpdate(prevProps) {
		checkPropChange(this.props.options, prevProps.options, () => {
			const { showLoadMore, dataField } = this.props;
			const { options } = this.state;
			if (showLoadMore && this.props.options && this.props.options[dataField]) {
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
						const value = Object.keys(currentValue).filter(
							item => currentValue[item],
						);
						if (value.length) this.setValue(value, true);
					},
				);
			} else {
				this.setState(
					{
						options:
							this.props.options && this.props.options[dataField]
								? this.props.options[dataField].buckets
								: [],
					},
					() => {
						// this will ensure that the Select-All (or any)
						// value gets handled on the initial load and
						// consecutive loads
						const { currentValue } = this.state;
						const value = Object.keys(currentValue).filter(
							item => currentValue[item],
						);
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

		checkPropChange(this.props.dataField, prevProps.dataField, () => {
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
			updateCustomQuery(props.componentId, props, value);
		}
		props.setQueryOptions(props.componentId, customQueryOptions, false);
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
		const value = Object.keys(this.state.currentValue);
		// Update default query for RS API
		updateDefaultQuery(this.props.componentId, this.props, value);
		updateInternalQuery(
			this.internalComponent,
			queryOptions,
			value,
			this.props,
			MultiDropdownList.generateQueryOptions(
				this.props,
				this.state.prevAfter,
				this.state.currentValue,
			),
		);
	};

	static generateQueryOptions(props, after, value = {}) {
		const queryOptions = getQueryOptions(props);
		const valueArray = Object.keys(value);
		return props.showLoadMore
			? getCompositeAggsQuery({
				value: valueArray,
				query: queryOptions,
				props,
				after,
			  })
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
		const queryOptions = MultiDropdownList.generateQueryOptions(
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
		const { error, isLoading, rawData } = this.props;
		const { currentValue } = this.state;
		const data = {
			error,
			loading: isLoading,
			value: currentValue,
			data: items || [],
			rawData,
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
					showClear={this.props.showClear}
					transformData={this.props.transformData}
					footer={
						showLoadMore
						&& !isLastBucket && (
							<div css={loadMoreContainer}>
								<Button disabled={isLoading} onClick={this.handleLoadMore}>
									{loadMoreLabel}
								</Button>
							</div>
						)
					}
					isOpen={this.props.isOpen}
				/>
			</Container>
		);
	}
}

MultiDropdownList.propTypes = {
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	options: types.options,
	rawData: types.rawData,
	selectedValue: types.selectedValue,
	setCustomQuery: types.funcRequired,
	isLoading: types.bool,
	error: types.title,
	enableAppbase: types.bool,
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
	index: types.string,
	showClear: types.bool,
	isOpen: types.bool,
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
	showClear: false,
	showLoadMore: false,
	loadMoreLabel: 'Load More',
	isOpen: false,
};

// Add componentType for SSR
MultiDropdownList.componentType = componentTypes.multiDropdownList;

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
	enableAppbase: state.config.enableAppbase,
});

const mapDispatchtoProps = dispatch => ({
	setCustomQuery: (component, query) => dispatch(setCustomQuery(component, query)),
	setDefaultQuery: (component, query) => dispatch(setDefaultQuery(component, query)),
	setQueryOptions: (...args) => dispatch(setQueryOptions(...args)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => (
	<ComponentWrapper {...props} internalComponent componentType={componentTypes.multiDropdownList}>
		{() => <MultiDropdownList ref={props.myForwardedRef} {...props} />}
	</ComponentWrapper>
));

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<PreferencesConsumer userProps={props} >
		{preferenceProps => <ConnectedComponent {...preferenceProps} myForwardedRef={ref} />}
	</PreferencesConsumer>
));
hoistNonReactStatics(ForwardRefComponent, MultiDropdownList);

ForwardRefComponent.displayName = 'MultiDropdownList';
export default ForwardRefComponent;
