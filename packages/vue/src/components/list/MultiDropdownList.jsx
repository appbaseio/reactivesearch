import { Actions, helper } from '@appbaseio/reactivecore';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import VueTypes from 'vue-types';
import types from '../../utils/vueTypes';
import { getAggsQuery } from './utils';
import Title from '../../styles/Title';
import Container from '../../styles/Container';
import ComponentWrapper from '../basic/ComponentWrapper.jsx';
import Button, { loadMoreContainer } from '../../styles/Button';
import Dropdown from '../shared/DropDown.jsx';
import {
	connect,
	hasCustomRenderer,
	getComponent,
	isFunction,
	parseValueArray,
	updateCustomQuery,
	updateDefaultQuery,
	isQueryIdentical,
} from '../../utils/index';

const { updateQuery, setQueryOptions, setCustomQuery, setDefaultQuery } = Actions;
const {
	isEqual,
	getQueryOptions,
	checkValueChange,
	checkPropChange,
	getClassName,
	getOptionsFromQuery,
	getCompositeAggsQuery,
} = helper;
const MultiDropdownList = {
	name: 'MultiDropdownList',
	data() {
		const props = this.$props;
		this.__state = {
			currentValue: {},
			modifiedOptions: [],
			after: {},
			// for composite aggs
			isLastBucket: false,
		};
		this.internalComponent = `${props.componentId}__internal`;
		return this.__state;
	},
	props: {
		beforeValueChange: types.func,
		className: VueTypes.string.def(''),
		componentId: types.stringRequired,
		customQuery: types.func,
		dataField: types.stringRequired,
		defaultValue: types.stringArray,
		value: types.stringArray,
		defaultQuery: types.func,
		filterLabel: types.string,
		innerClass: types.style,
		placeholder: VueTypes.string.def('Select values'),
		queryFormat: VueTypes.oneOf(['and', 'or']).def('or'),
		react: types.react,
		renderLabel: types.func,
		render: types.func,
		renderItem: types.func,
		renderError: types.title,
		renderNoResults: VueTypes.any,
		transformData: types.func,
		selectAllLabel: types.string,
		showCount: VueTypes.bool.def(true),
		showFilter: VueTypes.bool.def(true),
		size: VueTypes.number.def(100),
		sortBy: VueTypes.oneOf(['asc', 'desc', 'count']).def('count'),
		title: types.title,
		URLParams: VueTypes.bool.def(false),
		showMissing: VueTypes.bool.def(false),
		missingLabel: VueTypes.string.def('N/A'),
		showSearch: VueTypes.bool.def(false),
		showLoadMore: VueTypes.bool.def(false),
		loadMoreLabel: VueTypes.oneOfType([VueTypes.string, VueTypes.any]).def('Load More'),
		nestedField: types.string,
	},
	created() {
		// Set custom and default queries in store
		updateCustomQuery(this.componentId, this.setCustomQuery, this.$props, this.currentValue);
		updateDefaultQuery(this.componentId, this.setDefaultQuery, this.$props, this.currentValue);
	},
	beforeMount() {
		this.updateQueryOptions(this.$props);

		if (this.selectedValue) {
			this.setValue(this.selectedValue, true);
		} else if (this.$props.value) {
			this.setValue(this.$props.value, true);
		} else if (this.$props.defaultValue) {
			this.setValue(this.$props.defaultValue, true);
		}
	},
	watch: {
		selectedValue(newVal) {
			let selectedValue = Object.keys(this.$data.currentValue);
			if (this.$props.selectAllLabel) {
				selectedValue = selectedValue.filter(val => val !== this.$props.selectAllLabel);
				if (this.$data.currentValue[this.$props.selectAllLabel]) {
					selectedValue = [this.$props.selectAllLabel];
				}
			}
			if (!isEqual(selectedValue, newVal)) {
				this.setValue(newVal || [], true);
			}
		},
		options(newVal, oldVal) {
			checkPropChange(oldVal, newVal, () => {
				const { showLoadMore, dataField } = this.$props;
				const { modifiedOptions } = this.$data;
				if (showLoadMore) {
					// append options with showLoadMore
					const { buckets } = newVal[dataField];
					const nextOptions = [
						...modifiedOptions,
						...buckets.map(bucket => ({
							key: bucket.key[dataField],
							doc_count: bucket.doc_count,
						})),
					];
					const after = newVal[dataField].after_key; // detect the last bucket by checking if the next set of buckets were empty
					const isLastBucket = !buckets.length;
					this.after = {
						after,
					};
					this.isLastBucket = isLastBucket;
					this.modifiedOptions = nextOptions;
				} else {
					this.modifiedOptions = newVal[this.$props.dataField]
						? newVal[this.$props.dataField].buckets
						: [];
				}
			});
		},
		size() {
			this.updateQueryOptions(this.$props);
		},
		sortBy() {
			this.updateQueryOptions(this.$props);
		},
		dataField() {
			this.updateQueryOptions(this.$props);
			this.updateQueryHandler(this.$data.currentValue, this.$props);
		},
		defaultValue(newVal) {
			this.setValue(newVal, true);
		},
		value(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.setValue(newVal, true);
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
		const { showLoadMore, loadMoreLabel, renderItem, renderError, renderLabel } = this.$props;
		const renderItemCalc = this.$scopedSlots.renderItem || renderItem;
		const renderErrorCalc = this.$scopedSlots.renderError || renderError;
		const renderLabelCalc = this.$scopedSlots.renderLabel || renderLabel;
		const { isLastBucket } = this.$data;
		const renderNoResults = this.$scopedSlots.renderNoResults || this.$props.renderNoResults;
		let selectAll = [];

		if (renderErrorCalc && this.error) {
			return isFunction(renderErrorCalc) ? renderErrorCalc(this.error) : renderErrorCalc;
		}

		if (!this.hasCustomRenderer && this.$data.modifiedOptions.length === 0 && !this.isLoading) {
			if(renderNoResults && isFunction(renderNoResults)) {
				return (<div>{renderNoResults()}</div>);
			} else if (renderNoResults && !isFunction(renderNoResults)) {
				return renderNoResults;
			} 
			return null;
			
		}

		if (this.$props.selectAllLabel) {
			selectAll = [
				{
					key: this.$props.selectAllLabel,
				},
			];
		}

		return (
			<Container class={this.$props.className}>
				{this.$props.title && (
					<Title class={getClassName(this.$props.innerClass, 'title') || ''}>
						{this.$props.title}
					</Title>
				)}
				<Dropdown
					innerClass={this.$props.innerClass}
					items={[
						...selectAll,
						...this.$data.modifiedOptions
							.filter(item => String(item.key).trim().length)
							.map(item => ({
								...item,
								key: String(item.key),
							})),
					]}
					hasCustomRenderer={this.hasCustomRenderer}
					customRenderer={this.getComponent}
					handleChange={this.handleChange}
					selectedItem={this.$data.currentValue}
					placeholder={this.$props.placeholder}
					labelField="key"
					multi
					showCount={this.$props.showCount}
					themePreset={this.themePreset}
					renderItem={renderItemCalc}
					renderNoResults={
						this.$scopedSlots.renderNoResults || this.$props.renderNoResults
					}
					showSearch={this.$props.showSearch}
					transformData={this.$props.transformData}
					footer={
						showLoadMore
						&& !isLastBucket && (
							<div css={loadMoreContainer}>
								<Button onClick={this.handleLoadMore}>{loadMoreLabel}</Button>
							</div>
						)
					}
					customLabelRenderer={renderLabelCalc}
				/>
			</Container>
		);
	},

	methods: {
		handleChange(item) {
			const { value } = this.$props;
			if (value === undefined) {
				this.setValue(item);
			} else {
				const values = parseValueArray(this.currentValue, item);
				this.$emit('change', values);
			}
		},

		setValue(value, isDefaultValue = false, props = this.$props) {
			const { selectAllLabel } = this.$props;
			let { currentValue } = this.$data;
			let finalValues = null;

			if (selectAllLabel && value.includes(selectAllLabel)) {
				if (currentValue[selectAllLabel]) {
					currentValue = {};
					finalValues = [];
				} else {
					this.$data.modifiedOptions.forEach(item => {
						currentValue[item.key] = true;
					});
					currentValue[selectAllLabel] = true;
					finalValues = [selectAllLabel];
				}
			} else if (isDefaultValue) {
				finalValues = value;
				currentValue = {};
				if (Array.isArray(value)) {
					value.forEach(item => {
						currentValue[item] = true;
					});
				}

				if (selectAllLabel && selectAllLabel in currentValue) {
					const { [selectAllLabel]: del, ...obj } = currentValue;
					currentValue = {
						...obj,
					};
				}
			} else {
				if (currentValue[value]) {
					const { [value]: del, ...rest } = currentValue;
					currentValue = {
						...rest,
					};
				} else {
					currentValue[value] = true;
				}

				if (selectAllLabel && selectAllLabel in currentValue) {
					const { [selectAllLabel]: del, ...obj } = currentValue;
					currentValue = {
						...obj,
					};
				}

				finalValues = Object.keys(currentValue);
			}

			const performUpdate = () => {
				this.currentValue = currentValue;
				this.updateQueryHandler(finalValues, props);
				this.$emit('valueChange', finalValues);
				this.$emit('value-change', finalValues);
			};

			checkValueChange(
				props.componentId,
				finalValues,
				props.beforeValueChange,
				performUpdate,
			);
		},

		updateDefaultQueryHandler(value, props) {
			let defaultQueryOptions;
			let query = MultiDropdownList.defaultQuery(value, props);
			if (this.defaultQuery) {
				const defaultQueryToBeSet = this.defaultQuery(value, props) || {};
				if (defaultQueryToBeSet.query) {
					({ query } = defaultQueryToBeSet);
				}
				defaultQueryOptions = getOptionsFromQuery(defaultQueryToBeSet);
				// Update calculated default query in store
				updateDefaultQuery(props.componentId, this.setDefaultQuery, props, value);
			}
			this.setQueryOptions(this.internalComponent, defaultQueryOptions);
			this.updateQuery({
				componentId: this.internalComponent,
				query,
				value,
				componentType: componentTypes.multiDropdownList,
			});
		},

		updateQueryHandler(value, props) {
			const { customQuery } = props;
			let query = MultiDropdownList.defaultQuery(value, props);
			let customQueryOptions;
			if (customQuery) {
				({ query } = customQuery(value, props) || {});
				customQueryOptions = getOptionsFromQuery(customQuery(value, props));
				updateCustomQuery(props.componentId, this.setCustomQuery, props, value);
			}
			this.setQueryOptions(props.componentId, customQueryOptions);
			this.updateQuery({
				componentId: props.componentId,
				query,
				value,
				label: props.filterLabel,
				showFilter: props.showFilter,
				URLParams: props.URLParams,
				componentType: componentTypes.multiDropdownList,
			});
		},

		generateQueryOptions(props, after) {
			const queryOptions = getQueryOptions(props);
			return props.showLoadMore
				? getCompositeAggsQuery({
					query: queryOptions,
					props,
					after,
				  })
				: getAggsQuery(queryOptions, props);
		},

		updateQueryOptions(props, addAfterKey = false) {
			// when using composite aggs flush the current options for a fresh query
			if (props.showLoadMore && !addAfterKey) {
				this.modifiedOptions = [];
			} // for a new query due to other changes don't append after to get fresh results

			const queryOptions = MultiDropdownList.generateQueryOptions(
				props,
				addAfterKey ? this.$data.after : {},
			);
			if (props.defaultQuery) {
				const value = Object.keys(this.$data.currentValue);
				const defaultQueryOptions = getOptionsFromQuery(props.defaultQuery(value, props));
				this.setQueryOptions(this.internalComponent, {
					...queryOptions,
					...defaultQueryOptions,
				});
			} else {
				this.setQueryOptions(this.internalComponent, queryOptions);
			}
		},

		handleLoadMore() {
			this.updateQueryOptions(this.$props, true);
		},
		getComponent(items, downshiftProps = {}) {
			const { currentValue } = this.$data;
			const data = {
				error: this.error,
				loading: this.isLoading,
				value: currentValue,
				data: items || [],
				rawData: this.rawData,
				handleChange: this.handleChange,
				downshiftProps,
			};
			return getComponent(data, this);
		},
	},

	computed: {
		hasCustomRenderer() {
			return hasCustomRenderer(this);
		},
	},
};

MultiDropdownList.defaultQuery = (value, props) => {
	let query = null;
	const type = props.queryFormat === 'or' ? 'terms' : 'term';

	if (!Array.isArray(value) || value.length === 0) {
		return null;
	}

	if (props.selectAllLabel && value.includes(props.selectAllLabel)) {
		if (props.showMissing) {
			query = { match_all: {} };
		} else {
			query = {
				exists: {
					field: props.dataField,
				},
			};
		}
	} else if (value) {
		let listQuery;
		if (props.queryFormat === 'or') {
			if (props.showMissing) {
				const hasMissingTerm = value.includes(props.missingLabel);
				let should = [
					{
						[type]: {
							[props.dataField]: value.filter(item => item !== props.missingLabel),
						},
					},
				];
				if (hasMissingTerm) {
					should = should.concat({
						bool: {
							must_not: {
								exists: { field: props.dataField },
							},
						},
					});
				}
				listQuery = {
					bool: {
						should,
					},
				};
			} else {
				listQuery = {
					[type]: {
						[props.dataField]: value,
					},
				};
			}
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

MultiDropdownList.generateQueryOptions = (props, after) => {
	const queryOptions = getQueryOptions(props);
	return props.showLoadMore
		? getCompositeAggsQuery({
			query: queryOptions,
			props,
			after,
		  })
		: getAggsQuery(queryOptions, props);
};
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
		|| null,
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

const ListConnected = ComponentWrapper(
	connect(mapStateToProps, mapDispatchtoProps)(MultiDropdownList),
	{
		componentType: componentTypes.multiDropdownList,
		internalComponent: true,
	},
);

MultiDropdownList.install = function(Vue) {
	Vue.component(MultiDropdownList.name, ListConnected);
};

// Add componentType for SSR
MultiDropdownList.componentType = componentTypes.multiDropdownList;

export default MultiDropdownList;
