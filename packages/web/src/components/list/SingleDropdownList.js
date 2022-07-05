import React, { Component } from 'react';

import {
	updateQuery,
	setQueryOptions,
	setCustomQuery,
	setDefaultQuery,
} from '@appbaseio/reactivecore/lib/actions';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {
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
	isFunction,
	getComponent,
	hasCustomRenderer,
} from '@appbaseio/reactivecore/lib/utils/helper';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';
import types from '@appbaseio/reactivecore/lib/utils/types';

import Title from '../../styles/Title';
import Container from '../../styles/Container';
import Button, { loadMoreContainer } from '../../styles/Button';
import Dropdown from '../shared/Dropdown';
import { connect, isEvent, isQueryIdentical } from '../../utils';
import PreferencesConsumer from '../basic/PreferencesConsumer';
import ComponentWrapper from '../basic/ComponentWrapper';

class SingleDropdownList extends Component {
	constructor(props) {
		super(props);

		const defaultValue = props.defaultValue || props.value;
		const currentValue = props.selectedValue || defaultValue;
		const dataField = props.dataField;

		this.state = {
			currentValue: currentValue || '',
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

		if (currentValue) {
			this.setValue(currentValue, props, hasMounted);
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
				this.setState({
					after: {
						after,
					},
					isLastBucket,
					options: nextOptions,
				});
			} else {
				this.setState({
					options:
						this.props.options && this.props.options[dataField]
							? this.props.options[dataField].buckets
							: [],
				});
			}
		});
		checkSomePropChange(this.props, prevProps, ['size', 'sortBy'], () =>
			this.updateQueryOptions(this.props),
		);

		// Treat defaultQuery and customQuery as reactive props
		if (!isQueryIdentical(this.state.currentValue, this.props, prevProps, 'defaultQuery')) {
			this.updateDefaultQuery();
			// Clear the component value
			this.updateQuery('', this.props);
		}

		if (!isQueryIdentical(this.state.currentValue, this.props, prevProps, 'customQuery')) {
			this.updateQuery(this.state.currentValue, this.props);
		}

		checkPropChange(this.props.dataField, prevProps.dataField, () => {
			this.updateQueryOptions(this.props);
			this.updateQuery(this.state.currentValue, this.props);
		});

		if (this.props.value !== prevProps.value) {
			this.setValue(this.props.value);
		} else if (
			this.state.currentValue !== this.props.selectedValue
			&& this.props.selectedValue !== prevProps.selectedValue
		) {
			const { value, onChange } = this.props;

			if (value === undefined) {
				this.setValue(this.props.selectedValue || '');
			} else if (onChange) {
				onChange(this.props.selectedValue || '');
			} else {
				this.setValue(this.state.currentValue);
			}
		}
	}

	static defaultQuery = (value, props) => {
		let query = null;
		if (props.selectAllLabel && props.selectAllLabel === value) {
			if (props.showMissing) {
				query = { match_all: {} };
			}
			query = {
				exists: {
					field: props.dataField,
				},
			};
		} else if (value) {
			if (props.showMissing && props.missingLabel === value) {
				query = {
					bool: {
						must_not: {
							exists: { field: props.dataField },
						},
					},
				};
			}
			query = {
				term: {
					[props.dataField]: value,
				},
			};
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

	setValue = (value, props = this.props, hasMounted = true) => {
		const performUpdate = () => {
			const handleUpdates = () => {
				this.updateQuery(value, props);
				if (props.onValueChange) props.onValueChange(value);
			};
			if (hasMounted) {
				this.setState(
					{
						currentValue: value,
					},
					handleUpdates,
				);
			} else {
				handleUpdates();
			}
		};

		checkValueChange(props.componentId, value, props.beforeValueChange, performUpdate);
	};

	updateQuery = (value, props) => {
		const { customQuery } = props;
		let query = SingleDropdownList.defaultQuery(value, props);
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
			componentType: componentTypes.singleDropdownList,
		});
	};

	updateDefaultQuery = (queryOptions) => {
		const { currentValue } = this.state;
		// Update default query for RS API
		updateDefaultQuery(this.props.componentId, this.props, currentValue);
		updateInternalQuery(
			this.internalComponent,
			queryOptions,
			currentValue,
			this.props,
			SingleDropdownList.generateQueryOptions(this.props, this.state.prevAfter, currentValue),
		);
	};

	static generateQueryOptions(props, after, value) {
		const queryOptions = getQueryOptions(props);
		return props.showLoadMore
			? getCompositeAggsQuery({
				value,
				query: queryOptions,
				props,
				after,
			  })
			: getAggsQuery(value, queryOptions, props);
	}

	updateQueryOptions = (props, addAfterKey = false) => {
		// when using composite aggs flush the current options for a fresh query
		if (props.showLoadMore && !addAfterKey) {
			this.setState({
				options: [],
			});
		}
		// for a new query due to other changes don't append after to get fresh results
		const queryOptions = SingleDropdownList.generateQueryOptions(
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
			onChange(currentValue);
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
			showLoadMore, loadMoreLabel, renderError, error, isLoading,
		} = this.props;
		const { isLastBucket } = this.state;
		let selectAll = [];

		if (this.props.isLoading && this.props.loader) {
			return this.props.loader;
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

SingleDropdownList.propTypes = {
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	options: types.options,
	rawData: types.rawData,
	selectedValue: types.selectedValue,
	setCustomQuery: types.funcRequired,
	error: types.title,
	isLoading: types.bool,
	enableAppbase: types.bool,
	// component props
	beforeValueChange: types.func,
	children: types.func,
	className: types.string,
	componentId: types.stringRequired,
	customQuery: types.func,
	defaultQuery: types.func,
	dataField: types.stringRequired,
	defaultValue: types.string,
	value: types.string,
	filterLabel: types.string,
	innerClass: types.style,
	loader: types.title,
	onQueryChange: types.func,
	onValueChange: types.func,
	onChange: types.func,
	onError: types.func,
	placeholder: types.string,
	searchPlaceholder: types.string,
	react: types.react,
	render: types.func,
	renderItem: types.func,
	renderLabel: types.func,
	renderError: types.title,
	renderNoResults: types.func,
	transformData: types.func,
	selectAllLabel: types.string,
	showCount: types.bool,
	showFilter: types.bool,
	size: types.number,
	sortBy: types.sortByWithCount,
	style: types.style,
	title: types.title,
	themePreset: types.themePreset,
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

SingleDropdownList.defaultProps = {
	className: null,
	placeholder: 'Select a value',
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
SingleDropdownList.componentType = componentTypes.singleDropdownList;

const mapStateToProps = (state, props) => ({
	rawData: state.rawData[props.componentId],
	options:
		props.nestedField && state.aggregations[props.componentId]
			? state.aggregations[props.componentId].reactivesearch_nested
			: state.aggregations[props.componentId],
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| '',
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
	<ComponentWrapper
		{...props}
		internalComponent
		componentType={componentTypes.singleDropdownList}
	>
		{() => <SingleDropdownList ref={props.myForwardedRef} {...props} />}
	</ComponentWrapper>
));

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<PreferencesConsumer userProps={props} >
		{preferenceProps => <ConnectedComponent {...preferenceProps} myForwardedRef={ref} />}
	</PreferencesConsumer>
));
hoistNonReactStatics(ForwardRefComponent, SingleDropdownList);

ForwardRefComponent.displayName = 'SingleDropdownList';
export default ForwardRefComponent;
