import React, { Component } from 'react';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
	setQueryListener,
} from '@appbaseio/reactivecore/lib/actions';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {
	getQueryOptions,
	pushToAndClause,
	checkValueChange,
	checkPropChange,
	checkSomePropChange,
	getClassName,
	getOptionsFromQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';

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
} from '../../utils';

class SingleDropdownList extends Component {
	constructor(props) {
		super(props);

		const defaultValue = props.defaultValue || props.value;
		const currentValue = props.selectedValue || defaultValue;

		this.state = {
			currentValue: currentValue || '',
			options: [],
			after: {}, // for composite aggs
			isLastBucket: false,
		};
		this.locked = false;
		this.internalComponent = `${props.componentId}__internal`;

		props.addComponent(this.internalComponent);
		props.addComponent(props.componentId);
		props.setQueryListener(props.componentId, props.onQueryChange, props.onError);
		this.updateQueryOptions(props);

		this.setReact(props);
		const hasMounted = false;

		if (currentValue) {
			this.setValue(currentValue, props, hasMounted);
		}
	}

	componentDidUpdate(prevProps) {
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
				this.setState({
					after: {
						after,
					},
					isLastBucket,
					options: nextOptions,
				});
			} else {
				this.setState({
					options: this.props.options[dataField]
						? this.props.options[dataField].buckets
						: [],
				});
			}
		});
		checkSomePropChange(this.props, prevProps, ['size', 'sortBy'], () =>
			this.updateQueryOptions(this.props),
		);

		// Treat defaultQuery and customQuery as reactive props
		if (!isIdentical(this.props.defaultQuery, prevProps.defaultQuery)) {
			this.updateDefaultQuery();
			// Clear the component value
			this.updateQuery('', this.props);
		}

		if (!isIdentical(this.props.customQuery, prevProps.customQuery)) {
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

	setValue = (value, props = this.props, hasMounted = true) => {
		// ignore state updates when component is locked
		if (props.beforeValueChange && this.locked) {
			return;
		}

		this.locked = true;
		const performUpdate = () => {
			const handleUpdates = () => {
				this.updateQuery(value, props);
				this.locked = false;
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
		}
		props.setQueryOptions(props.componentId, customQueryOptions);
		props.updateQuery({
			componentId: props.componentId,
			query,
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: 'SINGLEDROPDOWNLIST',
		});
	};

	updateDefaultQuery = (queryOptions) => {
		updateInternalQuery(
			this.internalComponent,
			queryOptions,
			this.state.currentValue,
			this.props,
			SingleDropdownList.generateQueryOptions(this.props, this.state.prevAfter),
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
		const queryOptions = SingleDropdownList.generateQueryOptions(
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
			onChange(currentValue);
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
			showLoadMore, loadMoreLabel, renderError, error,
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
					labelField="key"
					showCount={this.props.showCount}
					themePreset={this.props.themePreset}
					renderItem={this.props.renderItem}
					hasCustomRenderer={this.hasCustomRenderer}
					customRenderer={this.getComponent}
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

SingleDropdownList.propTypes = {
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
	children: types.func,
	className: types.string,
	componentId: types.stringRequired,
	customQuery: types.func,
	defaultQuery: types.func,
	dataField: types.stringRequired,
	defaultValue: types.string,
	error: types.title,
	value: types.string,
	filterLabel: types.string,
	innerClass: types.style,
	isLoading: types.bool,
	loader: types.title,
	onQueryChange: types.func,
	onValueChange: types.func,
	onChange: types.func,
	onError: types.func,
	placeholder: types.string,
	react: types.react,
	render: types.func,
	renderItem: types.func,
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
		|| '',
	isLoading: state.isLoading[props.componentId],
	themePreset: state.config.themePreset,
	error: state.error[props.componentId],
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

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => <SingleDropdownList ref={props.myForwardedRef} {...props} />);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, SingleDropdownList);

ForwardRefComponent.name = 'SingleDropdownList';
export default ForwardRefComponent;
