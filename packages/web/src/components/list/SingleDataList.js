import React, { Component } from 'react';

import {
	updateQuery,
	setQueryOptions,
	setCustomQuery,
	setDefaultQuery,
} from '@appbaseio/reactivecore/lib/actions';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {
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
import { replaceDiacritics } from '@appbaseio/reactivecore/lib/utils/suggestions';
import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import types from '@appbaseio/reactivecore/lib/utils/types';
import styled from '@emotion/styled';

import Title from '../../styles/Title';
import Input from '../../styles/Input';
import Container from '../../styles/Container';
import { UL, Radio } from '../../styles/FormControlList';
import { connect, isEvent, isQueryIdentical } from '../../utils';
import PreferencesConsumer from '../basic/PreferencesConsumer';
import ComponentWrapper from '../basic/ComponentWrapper';

const SingleDataListUL = styled(UL)`
	display: ${({ displayAsVertical }) => (displayAsVertical ? 'block' : 'flex')};
	white-space: nowrap;
`;

const Span = styled.span`
	width: auto !important;
`;
const Label = styled.label`
	::before {
		width: 16px !important;
	}
	margin: 0.4rem !important;
`;

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

		this.internalComponent = getInternalComponentID(props.componentId);

		// Set custom and default queries in store
		updateCustomQuery(props.componentId, props, currentValue);
		updateDefaultQuery(props.componentId, props, currentValue);
		const hasMounted = false;

		if (props.showCount) {
			this.updateQueryOptions(props);
		}

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

		// Treat defaultQuery and customQuery as reactive props
		if (!isQueryIdentical(this.state.currentValue, this.props, prevProps, 'defaultQuery')) {
			this.updateDefaultQuery();
			this.updateQuery('', this.props);
		}

		if (!isQueryIdentical(this.state.currentValue, this.props, prevProps, 'customQuery')) {
			this.updateQuery(this.state.currentValue, this.props);
		}

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

	updateDefaultQuery = (queryOptions) => {
		const { currentValue } = this.state;
		// Update default query for RS API
		updateDefaultQuery(this.props.componentId, this.props, currentValue);
		updateInternalQuery(
			this.internalComponent,
			queryOptions,
			currentValue,
			this.props,
			SingleDataList.generateQueryOptions(this.props, this.state),
			null,
		);
	};

	updateQuery = (value, props) => {
		const { customQuery } = props;
		let customQueryOptions;

		let currentValue = value;
		if (value !== props.selectAllLabel) {
			currentValue = props.data.find(item => item.label === value);
			currentValue = currentValue ? currentValue.value : null;
		} else {
			currentValue = props.selectAllLabel;
		}
		let query = SingleDataList.defaultQuery(currentValue, props);
		if (customQuery) {
			({ query } = customQuery(currentValue, props) || {});
			customQueryOptions = getOptionsFromQuery(customQuery(currentValue, props));
			updateCustomQuery(props.componentId, props, value);
		}
		props.setQueryOptions(props.componentId, customQueryOptions, false);

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
		return getAggsQuery(state.currentValue, queryOptions, props, includes);
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
					[item.key_as_string]: item.doc_count,
				}),
				{},
			);
			const { options } = this.state;
			const newOptions = options.map((item) => {
				if (bucketDictionary[item.value]) {
					return {
						...item,
						count: bucketDictionary[item.value] || 0,
					};
				}
				return {
					...item,
					count: 0,
				};
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
		return true;
	};

	getComponent() {
		const { currentValue } = this.state;
		const data = {
			value: currentValue,
			data: this.listItems,
			handleChange: this.handleClick,
			rawData: this.props.rawData,
			total: this.props.total,
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
		const {
			selectAllLabel, showCount, renderItem, total,
		} = this.props;
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
					<SingleDataListUL
						className={getClassName(this.props.innerClass, 'list') || null}
						aria-label={`${this.props.componentId}-items`}
						displayAsVertical={this.props.displayAsVertical}
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
								<Label
									className={getClassName(this.props.innerClass, 'label') || null}
									htmlFor={`${this.props.componentId}-${selectAllLabel}`}
								>
									<Span>
										{selectAllLabel}
										{showCount && total && (
											<span
												className={
													getClassName(this.props.innerClass, 'count')
													|| null
												}
											>
												&nbsp;({total})
											</span>
										)}
									</Span>
								</Label>
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
										<Label
											className={
												getClassName(this.props.innerClass, 'label') || null
											}
											htmlFor={`${this.props.componentId}-${item.label}`}
										>
											{renderItem ? (
												renderItem(item.label, item.count, isChecked)
											) : (
												<Span>
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
												</Span>
											)}
										</Label>
									</li>
								);
							}) // prettier-ignore
							: this.props.renderNoResults && this.props.renderNoResults()}
					</SingleDataListUL>
				)}
			</Container>
		);
	}
}

SingleDataList.propTypes = {
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	total: types.number,
	selectedValue: types.selectedValue,
	options: types.options,
	rawData: types.rawData,
	setCustomQuery: types.funcRequired,
	enableAppbase: types.bool,
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
	index: types.string,
	enableStrictSelection: types.bool,
	displayAsVertical: types.bool,
	endpoint: types.endpoint,
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
	enableStrictSelection: false,
	displayAsVertical: true,
};

// Add componentType for SSR
SingleDataList.componentType = componentTypes.singleDataList;

const mapStateToProps = (state, props) => ({
	rawData: state.rawData[props.componentId],
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	themePreset: state.config.themePreset,
	total: state.hits[props.componentId] && state.hits[props.componentId].total,
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

	setQueryOptions: (...args) => dispatch(setQueryOptions(...args)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => <SingleDataList ref={props.myForwardedRef} {...props} />);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<PreferencesConsumer userProps={props}>
		{preferenceProps => (
			<ComponentWrapper
				{...preferenceProps}
				internalComponent
				componentType={componentTypes.singleDataList}
			>
				{() => <ConnectedComponent {...preferenceProps} myForwardedRef={ref} />}
			</ComponentWrapper>
		)}
	</PreferencesConsumer>
));
hoistNonReactStatics(ForwardRefComponent, SingleDataList);

ForwardRefComponent.displayName = 'SingleDataList';
export default ForwardRefComponent;
