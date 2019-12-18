import React, { Component } from 'react';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
	setQueryListener,
	loadMore,
	setComponentProps,
	updateComponentProps,
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
	getAggsQuery,
	getCompositeAggsQuery,
	updateInternalQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import Title from '../../styles/Title';
import Input from '../../styles/Input';
import Button, { loadMoreContainer } from '../../styles/Button';
import Container from '../../styles/Container';
import { UL, Radio } from '../../styles/FormControlList';
import {
	connect,
	isFunction,
	getComponent,
	hasCustomRenderer,
	isEvent,
	isIdentical,
	getValidPropsKeys,
} from '../../utils';

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
		this.internalComponent = `${props.componentId}__internal`;

		props.addComponent(this.internalComponent);
		props.addComponent(props.componentId);
		props.setComponentProps(props.componentId, {
			...props,
			componentType: componentTypes.singleList,
		});
		props.setQueryListener(props.componentId, props.onQueryChange, props.onError);
		this.updateQueryOptions(props);

		this.setReact(props);
		const hasMounted = false;

		if (currentValue) {
			this.setValue(currentValue, true, props, hasMounted);
		}
	}

	componentDidUpdate(prevProps) {
		checkSomePropChange(this.props, prevProps, getValidPropsKeys(this.props), () => {
			this.props.updateComponentProps(this.props.componentId, this.props);
		});
		checkPropChange(prevProps.react, this.props.react, () => this.setReact(this.props));

		checkPropChange(prevProps.options, this.props.options, () => {
			const { showLoadMore, dataField, options } = this.props;

			if (showLoadMore) {
				const { buckets } = options[dataField];
				const after = options[dataField].after_key;
				const prevAfter = prevProps.options && prevProps.options[dataField].after_key;
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
					options: options[dataField]
						? this.getOptions(options[dataField].buckets, this.props)
						: [],
				});
			}
		});

		// Treat defaultQuery and customQuery as reactive props
		if (!isIdentical(this.props.defaultQuery, prevProps.defaultQuery)) {
			this.updateDefaultQuery();
			// Clear the component value
			this.updateQuery('', this.props);
		}

		if (!isIdentical(this.props.customQuery, prevProps.customQuery)) {
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
		}
		props.setQueryOptions(props.componentId, {
			...SingleList.generateQueryOptions(props, this.state.prevAfter),
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
		updateInternalQuery(
			this.internalComponent,
			queryOptions,
			this.state.currentValue,
			this.props,
			SingleList.generateQueryOptions(this.props, this.state.prevAfter),
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
		const queryOptions = SingleList.generateQueryOptions(
			props,
			addAfterKey ? this.state.after : {},
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
		const queryOptions = SingleList.generateQueryOptions(this.props, this.state.after);
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
			onChange(currentValue);
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
		const { error, isLoading } = this.props;
		const { currentValue } = this.state;
		const data = {
			error,
			loading: isLoading,
			value: currentValue,
			data: this.listItems,
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
								<Button onClick={this.handleLoadMore}>{loadMoreLabel}</Button>
							</div>
						)}
					</UL>
				)}
			</Container>
		);
	}
}

SingleList.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	setQueryOptions: types.funcRequired,
	loadMore: types.funcRequired,
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
	themePreset: state.config.themePreset,
	isLoading: state.isLoading[props.componentId],
	error: state.error[props.componentId],
});

const mapDispatchtoProps = dispatch => ({
	setComponentProps: (component, options) => dispatch(setComponentProps(component, options)),
	updateComponentProps: (component, options) =>
		dispatch(updateComponentProps(component, options)),
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
	loadMore: (component, aggsQuery) => dispatch(loadMore(component, aggsQuery, true, true)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => <SingleList ref={props.myForwardedRef} {...props} />);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, SingleList);

ForwardRefComponent.name = 'SingleList';
export default ForwardRefComponent;
