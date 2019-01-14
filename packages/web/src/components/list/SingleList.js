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

import { getAggsQuery, getCompositeAggsQuery } from './utils';
import Title from '../../styles/Title';
import Input from '../../styles/Input';
import Button, { loadMoreContainer } from '../../styles/Button';
import Container from '../../styles/Container';
import { UL, Radio } from '../../styles/FormControlList';
import { connect, isFunction } from '../../utils';

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
		checkPropChange(prevProps.react, this.props.react, () => this.setReact(this.props));

		checkPropChange(prevProps.options, this.props.options, () => {
			const { showLoadMore, dataField, options } = this.props;

			if (showLoadMore) {
				const { buckets } = options[dataField];
				const after = options[dataField].after_key;

				// detect the last bucket by checking if the
				// after key is absent
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
						? this.getOptions(options[dataField].buckets, this.props)
						: [],
				});
			}
		});

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
			this.setValue(this.props.selectedValue || '');
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

	setValue = (nextValue, props = this.props, hasMounted = true) => {
		// ignore state updates when component is locked
		if (props.beforeValueChange && this.locked) {
			return;
		}

		let value = nextValue;
		if (this.state.currentValue === nextValue && hasMounted) {
			value = '';
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
		let query = SingleList.defaultQuery(value, props);
		let customQueryOptions;
		if (customQuery) {
			({ query } = customQuery(value, props) || {});
			customQueryOptions = getOptionsFromQuery(customQuery(value, props));
		}
		this.queryOptions = {
			...this.queryOptions,
			...customQueryOptions,
		};
		props.setQueryOptions(props.componentId, this.queryOptions);
		props.updateQuery({
			componentId: props.componentId,
			query,
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: 'SINGLELIST',
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
		const queryOptions = SingleList.generateQueryOptions(
			props,
			addAfterKey ? this.state.after : {},
		);
		this.queryOptions = {
			...this.queryOptions,
			...queryOptions,
		};
		if (props.defaultQuery) {
			const value = this.state.currentValue;
			const defaultQueryOptions = getOptionsFromQuery(props.defaultQuery(value, props));
			props.setQueryOptions(this.internalComponent,
				{ ...this.queryOptions, ...defaultQueryOptions });
		} else {
			props.setQueryOptions(this.internalComponent, this.queryOptions);
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
					themePreset={this.props.themePreset}
				/>
			);
		}
		return null;
	};

	handleClick = (e) => {
		const { value, onChange } = this.props;
		const { value: listValue } = e.target;
		if (value === undefined) {
			this.setValue(listValue);
		} else if (onChange) {
			onChange(listValue);
		}
	};

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

		if (this.state.options.length === 0) {
			return null;
		}

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
							className={`${
								this.state.currentValue === selectAllLabel ? 'active' : ''
							}`}
						>
							<Radio
								className={getClassName(this.props.innerClass, 'radio')}
								id={`${this.props.componentId}-${selectAllLabel}`}
								name={this.props.componentId}
								value={selectAllLabel}
								onClick={this.handleClick}
								readOnly
								checked={this.state.currentValue === selectAllLabel}
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
					{listItems.length
						? listItems.map((item) => {
							const isChecked = this.state.currentValue === String(item.key);
							return (
								<li key={item.key} className={`${isChecked ? 'active' : ''}`}>
									<Radio
										className={getClassName(this.props.innerClass, 'radio')}
										id={`${this.props.componentId}-${item.key}`}
										name={this.props.componentId}
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
	// component props
	beforeValueChange: types.func,
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
	onError: types.func,
	onValueChange: types.func,
	onChange: types.func,
	placeholder: types.string,
	react: types.react,
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
