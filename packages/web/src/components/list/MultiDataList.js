import React, { Component } from 'react';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryListener,
	setQueryOptions,
	setComponentProps,
	updateComponentProps,
} from '@appbaseio/reactivecore/lib/actions';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import {
	isEqual,
	checkValueChange,
	checkPropChange,
	getClassName,
	pushToAndClause,
	checkSomePropChange,
	getQueryOptions,
	getOptionsFromQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';
import hoistNonReactStatics from 'hoist-non-react-statics';

import types from '@appbaseio/reactivecore/lib/utils/types';

import Title from '../../styles/Title';
import Input from '../../styles/Input';
import Container from '../../styles/Container';
import { UL, Checkbox } from '../../styles/FormControlList';
import { connect, getComponent, hasCustomRenderer, isEvent, getValidPropsKeys } from '../../utils';
import { getAggsQuery } from './utils';

class MultiDataList extends Component {
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
			searchTerm: '',
			options: props.data || [],
		};
		this.internalComponent = `${props.componentId}__internal`;
		this.type = 'term';
		this.locked = false;

		props.addComponent(props.componentId);
		props.addComponent(this.internalComponent);
		props.setComponentProps(props.componentId, {
			...props,
			componentType: componentTypes.multiDataList,
		});

		props.setQueryListener(props.componentId, props.onQueryChange, null);

		this.setReact(props);
		const hasMounted = false;

		if (props.showCount) {
			this.updateQueryOptions(props);
		}

		this.setReact(props);

		if (currentValueArray.length) {
			this.setValue(currentValueArray, true, props, hasMounted);
		}
	}

	componentDidUpdate(prevProps) {
		checkSomePropChange(this.props, prevProps, getValidPropsKeys(this.props), () => {
			this.props.updateComponentProps(this.props.componentId, this.props);
		});
		checkPropChange(this.props.react, prevProps.react, () => this.setReact(this.props));

		checkSomePropChange(this.props, prevProps, ['dataField', 'nestedField'], () => {
			this.updateQuery(Object.keys(this.state.currentValue), this.props);

			if (this.props.showCount) {
				this.updateQueryOptions(this.props);
			}
		});

		checkPropChange(this.props.data, prevProps.data, () => {
			if (this.props.showCount) {
				this.updateQueryOptions(this.props);
			}
		});

		checkPropChange(this.props.options, prevProps.options, () => {
			if (this.props.options[this.props.dataField]) {
				this.updateStateOptions(this.props.options[this.props.dataField].buckets);
			}
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
			this.setValue(this.props.value || [], true);
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

	setReact(props) {
		const { react } = this.props;

		if (react) {
			const newReact = pushToAndClause(react, this.internalComponent);
			props.watchComponent(props.componentId, newReact);
		} else {
			props.watchComponent(props.componentId, {
				and: this.internalComponent,
			});
		}
	}

	static defaultQuery = (value, props) => {
		let query = null;
		const type = props.queryFormat === 'or' ? 'terms' : 'term';
		if (props.selectAllLabel && Array.isArray(value) && value.includes(props.selectAllLabel)) {
			query = {
				exists: {
					field: props.dataField,
				},
			};
		} else if (value) {
			let listQuery;
			if (props.queryFormat === 'or') {
				listQuery = {
					[type]: {
						[props.dataField]: value,
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

		if (
			selectAllLabel
			&& ((Array.isArray(value) && value.includes(selectAllLabel))
				|| (typeof value === 'string' && value === selectAllLabel))
		) {
			if (currentValue[selectAllLabel] && hasMounted && !isDefaultValue) {
				currentValue = {};
				finalValues = [];
			} else {
				props.data.forEach((item) => {
					currentValue[item.label] = true;
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
		let customQueryOptions;

		// find the corresponding value of the label for running the query
		const queryValue = value.reduce((acc, item) => {
			if (item === props.selectAllLabel) {
				return acc.concat(item);
			}
			const matchingItem = props.data.find(dataItem => dataItem.label === item);
			return matchingItem ? acc.concat(matchingItem.value) : acc;
		}, []);

		let query = MultiDataList.defaultQuery(queryValue, props);
		if (customQuery) {
			({ query } = customQuery(queryValue, props) || {});
			customQueryOptions = getOptionsFromQuery(customQuery((queryValue, props)));
		}
		props.setQueryOptions(props.componentId, customQueryOptions);

		props.updateQuery({
			componentId: props.componentId,
			query,
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: componentTypes.multiDataList,
		});
	};

	static generateQueryOptions(props, state) {
		const queryOptions = getQueryOptions(props);
		const includes = state.options.map(item => item.value);
		return getAggsQuery(queryOptions, props, includes);
	}

	updateQueryOptions = (props) => {
		const queryOptions = MultiDataList.generateQueryOptions(props, this.state);
		if (props.defaultQuery) {
			const value = Object.keys(this.state.currentValue);
			const defaultQueryOptions = getOptionsFromQuery(props.defaultQuery(value, props));
			props.setQueryOptions(this.internalComponent, {
				...queryOptions,
				...defaultQueryOptions,
			});
		} else {
			props.setQueryOptions(this.internalComponent, queryOptions);
		}
	};

	updateStateOptions = (bucket) => {
		if (bucket) {
			const bucketDictionary = bucket.reduce(
				(obj, item) => ({
					...obj,
					[item.key]: item.doc_count,
				}),
				{},
			);

			const { options } = this.state;
			const newOptions = options.map((item) => {
				if (bucketDictionary[item.value]) {
					return {
						...item,
						count: bucketDictionary[item.value],
					};
				}

				return item;
			});

			this.setState({
				options: newOptions,
			});
		}
	};

	handleInputChange = (e) => {
		const { value } = e.target;
		this.setState({
			searchTerm: value,
		});
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
			const newValue = Object.assign([], this.props.value);
			const currentValueIndex = newValue.indexOf(currentValue);
			if (currentValueIndex > -1) newValue.splice(currentValueIndex, 1);
			else newValue.push(currentValue);
			onChange(newValue);
		}
	};

	getComponent() {
		const { currentValue } = this.state;
		const data = {
			value: currentValue,
			data: this.listItems,
			handleChange: this.handleClick,
		};
		return getComponent(data, this.props);
	}

	get hasCustomRenderer() {
		return hasCustomRenderer(this.props);
	}

	get listItems() {
		const { options } = this.state;

		const listItems = options.filter((item) => {
			if (this.props.showSearch && this.state.searchTerm) {
				return item.label.toLowerCase().includes(this.state.searchTerm.toLowerCase());
			}
			return true;
		});
		return listItems;
	}

	render() {
		const { selectAllLabel, showCount, renderItem } = this.props;
		const { options } = this.state;

		if (!this.hasCustomRenderer && options.length === 0) {
			return null;
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
								const isChecked = !!this.state.currentValue[item.label];
								return (
									<li
										key={item.label}
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
											id={`${this.props.componentId}-${item.label}`}
											name={`${this.props.componentId}-${item.label}`}
											value={item.label}
											onChange={this.handleClick}
											checked={isChecked}
											show={this.props.showCheckbox}
										/>
										<label
											className={
												getClassName(this.props.innerClass, 'label') || null
											}
											htmlFor={`${this.props.componentId}-${item.label}`}
										>
											{renderItem ? (
												renderItem(item.label, item.count, this.state.currentValue === item.label)
											) : (
												<span>
													<span>{item.label}</span>
													{showCount && item.count && (
														<span
															className={
																getClassName(
																	this.props.innerClass,
																	'count',
																) || null
															}
														>
															{item.count}
														</span>
													)}
												</span>
											)}
										</label>
									</li>
								);
							}) // prettier-ignore
							: this.props.renderNoResults && this.props.renderNoResults()}
					</UL>
				)}
			</Container>
		);
	}
}

MultiDataList.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	selectedValue: types.selectedValue,
	options: types.options,
	setComponentProps: types.funcRequired,
	updateComponentProps: types.funcRequired,
	// component props
	beforeValueChange: types.func,
	children: types.func,
	className: types.string,
	componentId: types.stringRequired,
	customQuery: types.func,
	defaultQuery: types.func,
	data: types.data,
	dataField: types.stringRequired,
	defaultValue: types.stringArray,
	value: types.stringArray,
	filterLabel: types.string,
	innerClass: types.style,
	onQueryChange: types.func,
	onValueChange: types.func,
	onChange: types.func,
	placeholder: types.string,
	nestedField: types.string,
	queryFormat: types.queryFormatSearch,
	react: types.react,
	selectAllLabel: types.string,
	showCheckbox: types.boolRequired,
	showFilter: types.bool,
	showSearch: types.bool,
	style: types.style,
	themePreset: types.themePreset,
	title: types.title,
	URLParams: types.bool,
	showCount: types.bool,
	render: types.func,
	renderItem: types.func,
	renderNoResults: types.func,
};

MultiDataList.defaultProps = {
	className: null,
	placeholder: 'Search',
	queryFormat: 'or',
	showCheckbox: true,
	showFilter: true,
	showSearch: true,
	style: {},
	URLParams: false,
	showCount: false,
};

const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	themePreset: state.config.themePreset,
	options:
		props.nestedField && state.aggregations[props.componentId]
			? state.aggregations[props.componentId].reactivesearch_nested
			: state.aggregations[props.componentId],
});

const mapDispatchtoProps = dispatch => ({
	setComponentProps: (component, options) => dispatch(setComponentProps(component, options)),
	updateComponentProps: (component, options) =>
		dispatch(updateComponentProps(component, options)),
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => <MultiDataList ref={props.myForwardedRef} {...props} />);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, MultiDataList);

ForwardRefComponent.name = 'MultiDataList';
export default ForwardRefComponent;
