import React, { Component } from 'react';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryListener,
	setQueryOptions,
	setComponentProps,
	setCustomQuery,
	setDefaultQuery,
	updateComponentProps,
} from '@appbaseio/reactivecore/lib/actions';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {
	checkValueChange,
	checkPropChange,
	getClassName,
	pushToAndClause,
	checkSomePropChange,
	getQueryOptions,
	getOptionsFromQuery,
	getAggsQuery,
	updateCustomQuery,
	updateDefaultQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import types from '@appbaseio/reactivecore/lib/utils/types';

import Title from '../../styles/Title';
import Input from '../../styles/Input';
import Container from '../../styles/Container';
import { UL, Radio } from '../../styles/FormControlList';
import { connect, getComponent, hasCustomRenderer, isEvent, getValidPropsKeys } from '../../utils';

class SingleDataList extends Component {
	constructor(props) {
		super(props);

		const defaultValue = props.defaultValue || props.value;
		const currentValue = props.selectedValue || defaultValue || '';
		this.state = {
			currentValue,
			searchTerm: '',
			options: props.data || [],
		};

		this.internalComponent = `${props.componentId}__internal`;

		props.addComponent(props.componentId);
		props.addComponent(this.internalComponent);
		props.setQueryListener(props.componentId, props.onQueryChange, null);
		// Update props in store
		props.setComponentProps(props.componentId, props, componentTypes.singleDataList);
		props.setComponentProps(this.internalComponent, props, componentTypes.singleDataList);
		// Set custom and default queries in store
		updateCustomQuery(props.componentId, props, currentValue);
		updateDefaultQuery(props.componentId, props, currentValue);
		this.setReact(props);
		const hasMounted = false;

		if (props.showCount) {
			this.updateQueryOptions(props);
		}

		this.setReact(props);

		if (currentValue) {
			this.setValue(currentValue, true, props, hasMounted);
		}
	}

	componentDidUpdate(prevProps) {
		checkSomePropChange(this.props, prevProps, getValidPropsKeys(this.props), () => {
			this.props.updateComponentProps(
				this.props.componentId,
				this.props,
				componentTypes.singleDataList,
			);
			this.props.updateComponentProps(
				this.internalComponent,
				this.props,
				componentTypes.singleDataList,
			);
		});
		checkPropChange(this.props.react, prevProps.react, () => this.setReact(this.props));

		checkSomePropChange(this.props, prevProps, ['dataField', 'nestedField'], () => {
			this.updateQuery(this.state.currentValue, this.props);

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

	setReact(props) {
		const { react } = props;
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
		if (props.selectAllLabel && props.selectAllLabel === value) {
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
		let customQueryOptions;

		let currentValue = value;
		if (value !== props.selectAllLabel) {
			currentValue = props.data.find(item => item.label === value);
			currentValue = currentValue ? currentValue.value : null;
		}
		let query = SingleDataList.defaultQuery(currentValue, props);
		if (customQuery) {
			({ query } = customQuery(currentValue, props) || {});
			customQueryOptions = getOptionsFromQuery(customQuery(currentValue, props));
			updateCustomQuery(props.componentId, props, value);
		}
		props.setQueryOptions(props.componentId, customQueryOptions);

		props.updateQuery({
			componentId: props.componentId,
			query,
			value: currentValue ? value : null,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: componentTypes.singleDataList,
		});
	};

	static generateQueryOptions(props, state) {
		const queryOptions = getQueryOptions(props);
		const includes = state.options.map(item => item.value);
		return getAggsQuery(queryOptions, props, includes);
	}

	updateQueryOptions = (props) => {
		const queryOptions = SingleDataList.generateQueryOptions(props, this.state);
		if (props.defaultQuery) {
			const value = this.state.currentValue;
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
			onChange(currentValue);
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
			return this.props.renderNoResults ? this.props.renderNoResults() : null;
		}

		const listItems = this.listItems;

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
						aria-label={`${this.props.componentId}-items`}
						role="radiogroup"
					>
						{selectAllLabel && (
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
									onChange={this.handleClick}
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
						)}
						{listItems.length
							? listItems.map((item) => {
								const isChecked = this.state.currentValue === item.label;
								return (
									<li
										key={item.label}
										className={`${
											isChecked ? 'active' : ''
										}`}
										role="radio"
										aria-checked={isChecked}
									>
										<Radio
											className={getClassName(this.props.innerClass, 'radio')}
											id={`${this.props.componentId}-${item.label}`}
											tabIndex={isChecked ? '-1' : '0'}
											value={item.label}
											onClick={this.handleClick}
											readOnly
											checked={isChecked}
											show={this.props.showRadio}
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
								);
							}) // prettier-ignore
							: this.props.renderNoResults && this.props.renderNoResults()}
					</UL>
				)}
			</Container>
		);
	}
}

SingleDataList.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	selectedValue: types.selectedValue,
	options: types.options,
	rawData: types.rawData,
	setComponentProps: types.funcRequired,
	setCustomQuery: types.funcRequired,
	updateComponentProps: types.funcRequired,
	// component props
	beforeValueChange: types.func,
	children: types.func,
	className: types.string,
	componentId: types.stringRequired,
	customQuery: types.func,
	data: types.data,
	dataField: types.stringRequired,
	defaultValue: types.string,
	value: types.string,
	filterLabel: types.string,
	innerClass: types.style,
	onQueryChange: types.func,
	onValueChange: types.func,
	onChange: types.func,
	placeholder: types.string,
	nestedField: types.string,
	react: types.react,
	selectAllLabel: types.string,
	showFilter: types.bool,
	showRadio: types.boolRequired,
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

SingleDataList.defaultProps = {
	className: null,
	placeholder: 'Search',
	showFilter: true,
	showRadio: true,
	showSearch: true,
	style: {},
	URLParams: false,
	showCount: false,
};

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
});

const mapDispatchtoProps = dispatch => ({
	setComponentProps: (component, options, componentType) =>
		dispatch(setComponentProps(component, options, componentType)),
	setCustomQuery: (component, query) => dispatch(setCustomQuery(component, query)),
	setDefaultQuery: (component, query) => dispatch(setDefaultQuery(component, query)),
	updateComponentProps: (component, options, componentType) =>
		dispatch(updateComponentProps(component, options, componentType)),
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
)(props => <SingleDataList ref={props.myForwardedRef} {...props} />);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, SingleDataList);

ForwardRefComponent.name = 'SingleDataList';
export default ForwardRefComponent;
