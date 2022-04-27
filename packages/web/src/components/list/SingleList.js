import React, { Component } from 'react';

import {
	updateQuery,
	setQueryOptions,
	loadMore,
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
import { replaceDiacritics } from '@appbaseio/reactivecore/lib/utils/suggestions';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';
import Title from '../../styles/Title';
import Input from '../../styles/Input';
import Button, { loadMoreContainer } from '../../styles/Button';
import Container from '../../styles/Container';
import { UL, Radio } from '../../styles/FormControlList';
import { connect, isEvent, isQueryIdentical } from '../../utils';
import ComponentWrapper from '../basic/ComponentWrapper';

// showLoadMore is experimental API and works only with ES6
class SingleList extends Component {
	constructor(props) {
		super(props);

		const defaultValue = props.defaultValue || props.value;
		const currentValue = props.selectedValue || defaultValue;

		this.state = {
			currentValue: currentValue || '',
			options:
				props.options && props.options[props.dataField]
					? this.getOptions(props.options[props.dataField].buckets, props)
					: [],
			searchTerm: '',
			after: {}, // for composite aggs,
			prevAfter: {}, // useful when we want to prevent the showLoadMore results
			isLastBucket: false,
		};
		this.internalComponent = getInternalComponentID(props.componentId);

		// Set custom and default queries in store
		updateCustomQuery(props.componentId, props, currentValue);
		updateDefaultQuery(props.componentId, props, currentValue);
		this.updateQueryOptions(props);

		const hasMounted = false;

		if (currentValue) {
			this.setValue(currentValue, true, props, hasMounted);
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
		checkPropChange(prevProps.options, this.props.options, () => {
			const { showLoadMore, dataField, options } = this.props;

			if (showLoadMore && options && options[dataField]) {
				const { buckets } = options[dataField];
				const after = options[dataField].after_key;
				const prevAfter
					= prevProps.options
					&& prevProps.options[dataField]
					&& prevProps.options[dataField].after_key;
				// detect the last bucket by checking if the
				// after key is absent
				const isLastBucket = !after;
				this.setState(state => ({
					...state,
					after: after ? { after } : state.after,
					prevAfter: prevAfter ? { after: prevAfter } : state.prevAfter,
					isLastBucket,
					options: this.getOptions(buckets, this.props),
				}));
			} else {
				this.setState({
					options:
						options && options[dataField]
							? this.getOptions(options[dataField].buckets, this.props)
							: [],
				});
			}
		});

		// Treat defaultQuery and customQuery as reactive props
		if (!isQueryIdentical(this.state.currentValue, this.props, prevProps, 'defaultQuery')) {
			this.updateDefaultQuery();
			// Clear the component value
			this.updateQuery('', this.props);
		}

		if (!isQueryIdentical(this.state.currentValue, this.props, prevProps, 'customQuery')) {
			this.updateQuery(this.state.currentValue, this.props);
		}

		checkSomePropChange(prevProps, this.props, ['size', 'sortBy'], () =>
			this.updateQueryOptions(this.props),
		);

		checkSomePropChange(this.props, prevProps, ['dataField', 'nestedField'], () => {
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
				this.setValue(this.state.currentValue, true);
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
			query = {
				term: {
					[props.dataField]: value,
				},
			};
			if (props.showMissing && props.missingLabel === value) {
				query = {
					bool: {
						must_not: {
							exists: { field: props.dataField },
						},
					},
				};
			}
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

	setValue = (nextValue, isDefaultValue = false, props = this.props, hasMounted = true) => {
		let value = nextValue;
		if (isDefaultValue) {
			value = nextValue;
		} else if (nextValue === this.state.currentValue && hasMounted) {
			value = '';
		}
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
		let query = SingleList.defaultQuery(value, props);
		let customQueryOptions;
		if (customQuery) {
			({ query } = customQuery(value, props) || {});
			customQueryOptions = getOptionsFromQuery(customQuery(value, props));
			updateCustomQuery(props.componentId, props, value);
		}
		props.setQueryOptions(props.componentId, {
			...SingleList.generateQueryOptions(
				props,
				this.state.prevAfter,
				this.state.currentValue,
			),
			...customQueryOptions,
		});
		props.updateQuery({
			componentId: props.componentId,
			query,
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: componentTypes.singleList,
		});
	};

	updateDefaultQuery = (queryOptions) => {
		const { currentValue } = this.state;
		updateDefaultQuery(this.props.componentId, this.props, currentValue);
		updateInternalQuery(
			this.internalComponent,
			queryOptions,
			currentValue,
			this.props,
			SingleList.generateQueryOptions(this.props, this.state.prevAfter, currentValue),
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
		const queryOptions = SingleList.generateQueryOptions(
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
		const queryOptions = SingleList.generateQueryOptions(
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
		const { enableStrictSelection } = this.props;
		if (enableStrictSelection && currentValue === this.state.currentValue) {
			return false;
		}
		const { value, onChange } = this.props;
		if (value === undefined) {
			this.setValue(currentValue);
		} else if (onChange) {
			onChange(currentValue);
		}
		return false;
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
					return replaceDiacritics(String(item.key))
						.toLowerCase()
						.includes(replaceDiacritics(this.state.searchTerm.toLowerCase()));
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
			rawData,
			handleChange: this.handleClick,
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

		if (!this.hasCustomRenderer && this.state.options.length === 0) {
			if (this.props.renderNoResults && !this.props.isLoading) {
				return this.props.renderNoResults();
			}

			return null;
		}

		const isAllChecked = this.state.currentValue === selectAllLabel;

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
						role="radiogroup"
						aria-label={`${this.props.componentId}-items`}
					>
						{selectAllLabel ? (
							<li
								key={selectAllLabel}
								className={`${isAllChecked ? 'active' : ''}`}
								role="radio"
								aria-checked={isAllChecked}
							>
								<Radio
									className={getClassName(this.props.innerClass, 'radio')}
									id={`${this.props.componentId}-${selectAllLabel}`}
									value={selectAllLabel}
									tabIndex={isAllChecked ? '-1' : '0'}
									onClick={this.handleClick}
									readOnly
									checked={isAllChecked}
									show={this.props.showRadio}
								/>
								<label
									className={getClassName(this.props.innerClass, 'label') || null}
									htmlFor={`${this.props.componentId}-${selectAllLabel}`}
								>
									{selectAllLabel}
								</label>
							</li>
						) : null}
						{this.listItems.length
							? this.listItems.map((item) => {
								const isChecked = this.state.currentValue === String(item.key);
								return (
									<li key={item.key} className={`${isChecked ? 'active' : ''}`} role="radio" aria-checked={isChecked}>
										<Radio
											className={getClassName(this.props.innerClass, 'radio')}
											id={`${this.props.componentId}-${item.key}`}
											tabIndex={isChecked ? '-1' : '0'}
											value={item.key}
											readOnly
											onClick={this.handleClick}
											checked={isChecked}
											show={this.props.showRadio}
										/>
										<label
											className={
												getClassName(this.props.innerClass, 'label') || null
											}
											htmlFor={`${this.props.componentId}-${item.key}`}
										>
											{renderItem ? (
												renderItem(item.key, item.doc_count, isChecked)
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

SingleList.propTypes = {
	setQueryOptions: types.funcRequired,
	loadMore: types.funcRequired,
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
	defaultValue: types.string,
	value: types.string,
	filterLabel: types.string,
	innerClass: types.style,
	loader: types.title,
	onQueryChange: types.func,
	onError: types.func,
	onValueChange: types.func,
	onChange: types.func,
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
	showRadio: types.boolRequired,
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
	nestedField: types.string,
	index: types.string,
	enableStrictSelection: types.bool,
};

SingleList.defaultProps = {
	className: null,
	placeholder: 'Search',
	showCount: true,
	showFilter: true,
	showRadio: true,
	showSearch: true,
	size: 100,
	sortBy: 'count',
	style: {},
	URLParams: false,
	showMissing: false,
	missingLabel: 'N/A',
	showLoadMore: false,
	loadMoreLabel: 'Load More',
	enableStrictSelection: false,
};

// Add componentType for SSR
SingleList.componentType = componentTypes.singleList;

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
	themePreset: state.config.themePreset,
	isLoading: state.isLoading[props.componentId],
	error: state.error[props.componentId],
	enableAppbase: state.config.enableAppbase,
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
	<ComponentWrapper {...props} internalComponent componentType={componentTypes.singleList}>
		{() => <SingleList ref={props.myForwardedRef} {...props} />}
	</ComponentWrapper>
));

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, SingleList);

ForwardRefComponent.displayName = 'SingleList';
export default ForwardRefComponent;
