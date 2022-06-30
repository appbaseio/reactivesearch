import React, { Component } from 'react';
import {
	updateQuery,
	setQueryOptions,
	setCustomQuery,
	setDefaultQuery,
} from '@appbaseio/reactivecore/lib/actions';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import { replaceDiacritics } from '@appbaseio/reactivecore/lib/utils/suggestions';
import {
	isEqual,
	checkValueChange,
	checkPropChange,
	getClassName,
	checkSomePropChange,
	getQueryOptions,
	getOptionsFromQuery,
	getAggsQuery,
	updateCustomQuery,
	updateDefaultQuery,
	updateInternalQuery,
	getComponent,
	hasCustomRenderer,
} from '@appbaseio/reactivecore/lib/utils/helper';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';
import types from '@appbaseio/reactivecore/lib/utils/types';

import Title from '../../styles/Title';
import Input from '../../styles/Input';
import Container from '../../styles/Container';
import { UL, Checkbox } from '../../styles/FormControlList';
import { connect, isEvent, parseValueArray, isQueryIdentical } from '../../utils';
import PreferencesConsumer from '../basic/PreferencesConsumer';
import ComponentWrapper from '../basic/ComponentWrapper';

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
		this.internalComponent = getInternalComponentID(props.componentId);
		this.type = 'term';
		// Set custom and default queries in store
		updateCustomQuery(props.componentId, props, currentValue);
		updateDefaultQuery(props.componentId, props, currentValue);

		const hasMounted = false;

		if (props.showCount) {
			this.updateQueryOptions(props);
		}
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
		const valueArray
			= typeof this.state.currentValue === 'object' ? Object.keys(this.state.currentValue) : [];

		checkSomePropChange(this.props, prevProps, ['dataField', 'nestedField'], () => {
			this.updateQuery(valueArray, this.props);

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

		// Treat defaultQuery and customQuery as reactive props
		if (!isQueryIdentical(valueArray, this.props, prevProps, 'defaultQuery')) {
			this.updateDefaultQuery();
			this.updateQuery([], this.props);
		}

		if (!isQueryIdentical(valueArray, this.props, prevProps, 'customQuery')) {
			this.updateQuery(valueArray, this.props);
		}

		let selectedValue = valueArray;
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
				const selectedListItems = valueArray;
				this.setValue(selectedListItems, true);
			}
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

	updateDefaultQuery = (queryOptions) => {
		const valueArray
			= typeof this.state.currentValue === 'object' ? Object.keys(this.state.currentValue) : [];
		// Update default query for RS API
		updateDefaultQuery(this.props.componentId, this.props, valueArray);
		updateInternalQuery(
			this.internalComponent,
			queryOptions,
			valueArray,
			this.props,
			MultiDataList.generateQueryOptions(this.props, this.state),
			null,
		);
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
			customQueryOptions = getOptionsFromQuery(customQuery(queryValue, props));
			updateCustomQuery(props.componentId, props, value);
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
		const valueArray
			= typeof state.currentValue === 'object' ? Object.keys(state.currentValue) : [];
		const includes = state.options.map(item => item.value);
		return getAggsQuery(valueArray, queryOptions, props, includes);
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
			updateDefaultQuery(props.componentId, props, value);
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
			onChange(parseValueArray(this.props.value, currentValue));
		}
	};

	getComponent() {
		const { currentValue } = this.state;
		const data = {
			value: currentValue,
			data: this.listItems,
			handleChange: this.handleClick,
			rawData: this.props.rawData,
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
				return replaceDiacritics(item.label)
					.toLowerCase()
					.includes(replaceDiacritics(this.state.searchTerm).toLowerCase());
			}
			return true;
		});
		return listItems;
	}

	render() {
		const { selectAllLabel, showCount, renderItem } = this.props;
		const { options } = this.state;

		if (!this.hasCustomRenderer && options.length === 0) {
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
								const isChecked = !!this.state.currentValue[item.label];
								return (
									<li
										key={item.label}
										className={`${isChecked ? 'active' : ''}`}
										role="option"
										aria-checked={isChecked}
										aria-selected={isChecked}
									>
										<Checkbox
											className={
												getClassName(this.props.innerClass, 'checkbox')
												|| null
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
												renderItem(item.label, item.count, isChecked)
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
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	selectedValue: types.selectedValue,
	rawData: types.rawData,
	options: types.options,
	enableAppbase: types.bool,

	setCustomQuery: types.funcRequired,
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
	index: types.string,
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

// Add componentType for SSR
MultiDataList.componentType = componentTypes.multiDataList;

const mapStateToProps = (state, props) => ({
	rawData: state.rawData[props.componentId],
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	themePreset: state.config.themePreset,
	options:
		props.nestedField && state.aggregations[props.componentId]
			? state.aggregations[props.componentId].reactivesearch_nested
			: state.aggregations[props.componentId],
	enableAppbase: state.config.enableAppbase,
});

const mapDispatchtoProps = dispatch => ({
	setCustomQuery: (component, query) => dispatch(setCustomQuery(component, query)),
	setDefaultQuery: (component, query) => dispatch(setDefaultQuery(component, query)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => (
	<ComponentWrapper {...props} internalComponent componentType={componentTypes.multiDataList}>
		{() => <MultiDataList ref={props.myForwardedRef} {...props} />}
	</ComponentWrapper>
));

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<PreferencesConsumer userProps={props}>
		{preferenceProps => <ConnectedComponent {...preferenceProps} myForwardedRef={ref} />}
	</PreferencesConsumer>
));
hoistNonReactStatics(ForwardRefComponent, MultiDataList);

ForwardRefComponent.displayName = 'MultiDataList';
export default ForwardRefComponent;
