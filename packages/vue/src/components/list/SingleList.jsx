import { Actions, helper } from '@appbaseio/reactivecore';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import { replaceDiacritics } from '@appbaseio/reactivecore/lib/utils/suggestions';
import VueTypes from 'vue-types';
import Title from '../../styles/Title';
import Input from '../../styles/Input';
import Container from '../../styles/Container';
import {
	connect,
	getComponent,
	hasCustomRenderer,
	isEvent,
	isFunction,
	updateCustomQuery,
	updateDefaultQuery,
	isQueryIdentical,
} from '../../utils/index';
import ComponentWrapper from '../basic/ComponentWrapper.jsx';
import PreferencesConsumer from '../basic/PreferencesConsumer.jsx';
import types from '../../utils/vueTypes';
import { UL, Radio } from '../../styles/FormControlList';
import { getAggsQuery } from './utils';

const { updateQuery, setQueryOptions, setCustomQuery, setDefaultQuery } = Actions;
const {
	getQueryOptions,
	checkValueChange,
	getClassName,
	isEqual,
	extractQueryFromCustomQuery,
	getOptionsForCustomQuery,
} = helper;

const SingleList = {
	name: 'SingleList',
	props: {
		beforeValueChange: types.func,
		className: VueTypes.string.def(''),
		componentId: types.stringRequired,
		customQuery: types.func,
		dataField: types.stringRequired,
		defaultValue: types.string,
		value: types.value,
		defaultQuery: types.func,
		filterLabel: types.string,
		innerClass: types.style,
		placeholder: VueTypes.string.def('Search'),
		react: types.react,
		render: types.func,
		renderItem: types.func,
		renderNoResults: VueTypes.any,
		transformData: types.func,
		selectAllLabel: types.string,
		showCount: VueTypes.bool.def(true),
		showFilter: VueTypes.bool.def(true),
		showRadio: VueTypes.bool.def(true),
		showSearch: VueTypes.bool.def(true),
		size: VueTypes.number,
		sortBy: VueTypes.oneOf(['asc', 'desc', 'count']).def('count'),
		title: types.title,
		URLParams: VueTypes.bool.def(false),
		showMissing: VueTypes.bool.def(false),
		missingLabel: VueTypes.string.def('N/A'),
		nestedField: types.string,
		index: VueTypes.string,
		enableStrictSelection: VueTypes.bool.def(false),
		endpoint: types.endpointConfig,
	},
	data() {
		const props = this.$props;
		this.__state = {
			currentValue: '',
			modifiedOptions: [],
			searchTerm: '',
		};
		this.internalComponent = `${props.componentId}__internal`;
		return this.__state;
	},
	created() {
		const props = this.$props;
		this.modifiedOptions
			= this.options && this.options[props.dataField]
				? this.options[props.dataField].buckets
				: [];
		// Set custom and default queries in store
		updateCustomQuery(this.componentId, this.setCustomQuery, this.$props, this.currentValue);
		updateDefaultQuery(this.componentId, this.setDefaultQuery, this.$props, this.currentValue);
	},
	beforeMount() {
		this.updateQueryHandlerOptions(this.$props);

		if (this.selectedValue) {
			this.setValue(this.selectedValue);
		} else if (this.$props.value) {
			this.setValue(this.$props.value);
		} else if (this.$props.defaultValue) {
			this.setValue(this.$props.defaultValue);
		}
	},
	watch: {
		options(newVal) {
			if (newVal) {
				this.modifiedOptions = newVal[this.$props.dataField]
					? newVal[this.$props.dataField].buckets
					: [];
			}
		},
		size() {
			this.updateQueryHandlerOptions(this.$props);
		},
		sortBy() {
			this.updateQueryHandlerOptions(this.$props);
		},
		dataField() {
			this.updateQueryHandlerOptions(this.$props);
			this.updateQueryHandler(this.$data.currentValue, this.$props);
		},
		defaultValue(newVal) {
			this.setValue(newVal);
		},
		value(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.setValue(newVal);
			}
		},
		selectedValue(newVal) {
			if (this.$data.currentValue !== newVal) {
				this.setValue(newVal || '');
			}
		},
		defaultQuery(newVal, oldVal) {
			if (!isQueryIdentical(newVal, oldVal, this.$data.currentValue, this.$props)) {
				this.updateDefaultQueryHandler(this.$data.currentValue, this.$props);
			}
		},
		customQuery(newVal, oldVal) {
			if (!isQueryIdentical(newVal, oldVal, this.$data.currentValue, this.$props)) {
				this.updateQueryHandler(this.componentId, this.$data.currentValue, this.$props);
			}
		},
	},
	render() {
		const { selectAllLabel, renderItem, renderError } = this.$props;
		const renderItemCalc = this.$slots.renderItem || renderItem;
		const renderErrorCalc = this.$slots.renderError || renderError;

		if (renderErrorCalc && this.error) {
			return isFunction(renderErrorCalc) ? renderErrorCalc(this.error) : renderErrorCalc;
		}

		if (!this.hasCustomRenderer && this.modifiedOptions.length === 0 && !this.isLoading) {
			if (this.renderNoResults) {
				this.renderNoResult();
			} else {
				return null;
			}
		}

		let itemsToRender = this.$data.modifiedOptions;

		if (this.$props.transformData) {
			itemsToRender = this.$props.transformData(itemsToRender);
		}

		const filteredItemsToRender = itemsToRender.filter((item) => {
			if (String(item.key).length) {
				if (this.$props.showSearch && this.$data.searchTerm) {
					return replaceDiacritics(String(item.key))
						.toLowerCase()
						.includes(replaceDiacritics(this.$data.searchTerm.toLowerCase()));
				}
				return true;
			}
			return false;
		});

		return (
			<Container class={this.$props.className}>
				{this.$props.title && (
					<Title class={getClassName(this.$props.innerClass, 'title') || ''}>
						{this.$props.title}
					</Title>
				)}
				{this.renderSearch()}
				{this.hasCustomRenderer ? (
					this.getComponent()
				) : (
					<UL class={getClassName(this.$props.innerClass, 'list') || ''}>
						{selectAllLabel ? (
							<li
								key={selectAllLabel}
								class={`${
									this.$data.currentValue === selectAllLabel ? 'active' : ''
								}`}
							>
								<Radio
									class={getClassName(this.$props.innerClass, 'radio')}
									id={`${this.$props.componentId}-${selectAllLabel}`}
									name={this.$props.componentId}
									value={selectAllLabel}
									onClick={this.handleClick}
									readOnly
									type="radio"
									show={this.$props.showRadio}
									checked={this.$data.currentValue === selectAllLabel}
								/>
								<label
									class={getClassName(this.$props.innerClass, 'label') || null}
									for={`${this.$props.componentId}-${selectAllLabel}`}
								>
									<span>
										{selectAllLabel}
										{this.$props.showCount && (
											<span
												class={
													getClassName(this.$props.innerClass, 'count')
													|| null
												}
											>
												&nbsp;(
												{this.totalDocumentCount})
											</span>
										)}
									</span>
								</label>
							</li>
						) : null}
						{!this.hasCustomRenderer
						&& filteredItemsToRender.length === 0
						&& !this.isLoading
							? this.renderNoResult()
							: filteredItemsToRender.map((item) => (
								<li
									key={item.key}
									class={`${
										this.currentValue === String(item.key) ? 'active' : ''
									}`}
								>
									<Radio
										class={getClassName(this.$props.innerClass, 'radio')}
										id={`${this.$props.componentId}-${item.key}`}
										name={this.$props.componentId}
										value={item.key}
										readOnly
										onClick={this.handleClick}
										type="radio"
										show={this.$props.showRadio}
										checked={this.currentValue === String(item.key)}
									/>
									<label
										class={
											getClassName(this.$props.innerClass, 'label')
												|| null
										}
										for={`${this.$props.componentId}-${item.key}`}
									>
										{renderItemCalc ? (
											renderItemCalc({
												label: item.key,
												count: item.doc_count,
												isChecked:
														this.currentValue === String(item.key),
											})
										) : (
											<span>
												{item.key}
												{this.$props.showCount && (
													<span
														class={
															getClassName(
																this.$props.innerClass,
																'count',
															) || null
														}
													>
															&nbsp;(
														{item.doc_count})
													</span>
												)}
											</span>
										)}
									</label>
								</li>
							  ))}
					</UL>
				)}
			</Container>
		);
	},

	methods: {
		setValue(nextValue, props = this.$props) {
			let value = nextValue;

			if (nextValue === this.$data.currentValue) {
				value = '';
			}
			const performUpdate = () => {
				this.currentValue = value;
				this.updateQueryHandler(value, props);
				this.$emit('valueChange', value);
				this.$emit('value-change', value);
			};

			checkValueChange(props.componentId, value, props.beforeValueChange, performUpdate);
		},

		updateDefaultQueryHandler(value, props) {
			let query = SingleList.defaultQuery(value, props);

			if (this.defaultQuery) {
				const defaultQueryToBeSet = this.defaultQuery(value, props) || {};
				const defaultQueryObj = extractQueryFromCustomQuery(defaultQueryToBeSet);
				if (defaultQueryObj) {
					query = defaultQueryObj;
				}

				// Update calculated default query in store
				updateDefaultQuery(props.componentId, this.setDefaultQuery, props, value);

				const defaultQueryOptions = getOptionsForCustomQuery(defaultQueryToBeSet);

				this.setQueryOptions(this.internalComponent, defaultQueryOptions, false);
			}
			this.updateQuery({
				componentId: this.internalComponent,
				query,
				value,
				componentType: componentTypes.singleList,
			});
		},

		updateQueryHandler(value, props) {
			const { customQuery } = props;
			let query = SingleList.defaultQuery(value, props);
			if (customQuery) {
				const customQueryCalc = customQuery(value, props);
				query = extractQueryFromCustomQuery(customQueryCalc);
				const customQueryOptions = getOptionsForCustomQuery(customQueryCalc);
				updateCustomQuery(props.componentId, this.setCustomQuery, props, value);

				this.setQueryOptions(props.componentId, customQueryOptions, false);
			}
			this.updateQuery({
				componentId: props.componentId,
				query,
				value,
				label: props.filterLabel,
				showFilter: props.showFilter,
				URLParams: props.URLParams,
				componentType: componentTypes.singleList,
			});
		},

		generateQueryOptions(props) {
			const queryOptions = getQueryOptions(props);
			return getAggsQuery(queryOptions, props);
		},

		updateQueryHandlerOptions(props) {
			const queryOptions = SingleList.generateQueryOptions(props);
			if (props.defaultQuery) {
				const value = this.$data.currentValue;
				const defaultQueryOptions = getOptionsForCustomQuery(
					props.defaultQuery(value, props),
				);
				this.setQueryOptions(this.internalComponent, {
					...queryOptions,
					...defaultQueryOptions,
				});
			} else {
				this.setQueryOptions(this.internalComponent, queryOptions);
			}
		},

		handleInputChange(e) {
			const { value } = e.target;
			this.searchTerm = value;
		},

		renderSearch() {
			if (this.$props.showSearch) {
				return (
					<Input
						class={getClassName(this.$props.innerClass, 'input') || ''}
						onInput={this.handleInputChange}
						value={this.$data.searchTerm}
						placeholder={this.$props.placeholder}
						style={{
							margin: '0 0 8px',
						}}
						themePreset={this.$props.themePreset}
					/>
				);
			}

			return null;
		},

		getComponent() {
			const { currentValue, modifiedOptions } = this.$data;
			const { transformData } = this.$props;
			let itemsToRender = modifiedOptions;
			if (transformData) {
				itemsToRender = transformData(itemsToRender);
			}
			const data = {
				error: this.error,
				loading: this.isLoading,
				value: currentValue,
				data: itemsToRender,
				rawData: this.rawData,
				handleChange: this.handleClick,
			};
			return getComponent(data, this);
		},

		handleClick(e) {
			let currentValue = e;
			if (isEvent(e)) {
				currentValue = e.target.value;
			}
			if (this.enableStrictSelection && currentValue === this.currentValue) {
				return false;
			}
			const { value } = this.$props;
			if (value === undefined) {
				this.setValue(currentValue);
			} else {
				this.$emit('change', currentValue);
			}
			return true;
		},

		renderNoResult() {
			const renderNoResults = this.$slots.renderNoResults || this.$props.renderNoResults;
			return (
				<p class={getClassName(this.$props.innerClass, 'noResults') || null}>
					{isFunction(renderNoResults) ? renderNoResults() : renderNoResults}
				</p>
			);
		},
	},
	computed: {
		hasCustomRenderer() {
			return hasCustomRenderer(this);
		},
	},
};

SingleList.generateQueryOptions = (props) => {
	const queryOptions = getQueryOptions(props);
	return getAggsQuery(queryOptions, props);
};
SingleList.defaultQuery = (value, props) => ({
	query: {
		queryFormat: props.queryFormat,
		dataField: props.dataField,
		value,
		nestedField: props.nestedField,
		selectAllLabel: props.selectAllLabel,
		showMissing: props.showMissing,
	},
});
SingleList.hasInternalComponent = () => true;

const mapStateToProps = (state, props) => ({
	options:
		props.nestedField && state.aggregations[props.componentId]
			? state.aggregations[props.componentId].reactivesearch_nested
			: state.aggregations[props.componentId],
	rawData: state.rawData[props.componentId],
	isLoading: state.isLoading[props.componentId],
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| '',
	totalDocumentCount: state.hits[props.componentId] && state.hits[props.componentId].total,
	themePreset: state.config.themePreset,
	error: state.error[props.componentId],
	componentProps: state.props[props.componentId],
});

const mapDispatchtoProps = {
	setQueryOptions,
	updateQuery,
	setCustomQuery,
	setDefaultQuery,
};

export const ListConnected = PreferencesConsumer(
	ComponentWrapper(connect(mapStateToProps, mapDispatchtoProps)(SingleList), {
		componentType: componentTypes.singleList,
		internalComponent: SingleList.hasInternalComponent(),
	}),
);
ListConnected.name = SingleList.name;

ListConnected.defaultQuery = SingleList.defaultQuery;
ListConnected.generateQueryOptions = SingleList.generateQueryOptions;
ListConnected.hasInternalComponent = SingleList.hasInternalComponent;
// Add componentType for SSR
ListConnected.componentType = componentTypes.singleList;

ListConnected.install = function (Vue) {
	Vue.component(ListConnected.name, ListConnected);
};

export default ListConnected;
