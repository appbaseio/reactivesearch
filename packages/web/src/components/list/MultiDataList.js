import React, { Component } from 'react';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryListener,
	setQueryOptions,
} from '@appbaseio/reactivecore/lib/actions';
import {
	isEqual,
	checkValueChange,
	checkPropChange,
	getClassName,
	pushToAndClause,
	getQueryOptions,
	getOptionsFromQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';

import Title from '../../styles/Title';
import Input from '../../styles/Input';
import Container from '../../styles/Container';
import { UL, Checkbox } from '../../styles/FormControlList';
import { connect } from '../../utils';
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
		checkPropChange(this.props.react, prevProps.react, () => this.setReact(this.props));

		checkPropChange(this.props.dataField, prevProps.dataField, () => {
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
			this.updateStateOptions(this.props.options[this.props.dataField].buckets);
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
			this.setValue(this.props.selectedValue || [], true);
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

	defaultQuery = (value, props) => {
		let query = null;
		const type = props.queryFormat === 'or' ? 'terms' : 'term';
		if (
			this.props.selectAllLabel
			&& Array.isArray(value)
			&& value.includes(this.props.selectAllLabel)
		) {
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

		this.queryOptions = {
			...this.queryOptions,
			...customQueryOptions,
		};
		let query = this.defaultQuery((queryValue, props));
		if (customQuery) {
			({ query } = customQuery((queryValue, props)));
			customQueryOptions = getOptionsFromQuery(customQuery((queryValue, props)));
		}
		props.setQueryOptions(props.componentId, this.queryOptions);

		props.updateQuery({
			componentId: props.componentId,
			query,
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: 'MULTIDATALIST',
		});
	};

	static generateQueryOptions(props, state) {
		const queryOptions = getQueryOptions(props);
		const includes = state.options.map(item => item.value);
		return getAggsQuery(queryOptions, props, includes);
	}

	updateQueryOptions = (props) => {
		const queryOptions = MultiDataList.generateQueryOptions(props, this.state);
		this.queryOptions = {
			...this.queryOptions,
			...queryOptions,
		};
		props.setQueryOptions(this.internalComponent, this.queryOptions);
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
			onChange(e);
		} else {
			this.setValue(listValue);
		}
	};

	render() {
		const { selectAllLabel, showCount, renderListItem } = this.props;
		const { options } = this.state;

		if (options.length === 0) {
			return null;
		}

		const listItems = options.filter((item) => {
			if (this.props.showSearch && this.state.searchTerm) {
				return item.label.toLowerCase().includes(this.state.searchTerm.toLowerCase());
			}
			return true;
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
							className={`${this.state.currentValue[selectAllLabel] ? 'active' : ''}`}
						>
							<Checkbox
								className={getClassName(this.props.innerClass, 'checkbox') || null}
								id={`${this.props.componentId}-${selectAllLabel}`}
								name={selectAllLabel}
								value={selectAllLabel}
								onChange={this.handleClick}
								checked={!!this.state.currentValue[selectAllLabel]}
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
						? listItems.map(item => (
							<li
								key={item.label}
								className={`${
									this.state.currentValue[item.label] ? 'active' : ''
								}`}
							>
								<Checkbox
									className={
										getClassName(this.props.innerClass, 'checkbox') || null
									}
									id={`${this.props.componentId}-${item.label}`}
									name={this.props.componentId}
									value={item.label}
									onChange={this.handleClick}
									checked={!!this.state.currentValue[item.label]}
									show={this.props.showCheckbox}
								/>
								<label
									className={
										getClassName(this.props.innerClass, 'label') || null
									}
									htmlFor={`${this.props.componentId}-${item.label}`}
								>
									{renderListItem ? (
										renderListItem(item.label, item.count)
									) : (
										<span>
											{item.label}
											{showCount && item.count && (
												<span
													className={
														getClassName(
															this.props.innerClass,
															'count',
														) || null
													}
												>
													&nbsp;({item.count})
												</span>
											)}
										</span>
									)}
								</label>
							</li>
						)) // prettier-ignore
						: this.props.renderNoResults && this.props.renderNoResults()}
				</UL>
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
	// component props
	beforeValueChange: types.func,
	className: types.string,
	componentId: types.stringRequired,
	customQuery: types.func,
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
	renderListItem: types.func,
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
	options: state.aggregations[props.componentId],
});

const mapDispatchtoProps = dispatch => ({
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

export default React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
