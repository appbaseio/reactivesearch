import { Actions, helper } from '@appbaseio/reactivecore';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import VueTypes from 'vue-types';
import types from '../../utils/vueTypes';
import { getAggsQuery } from './utils';
import ComponentWrapper from '../basic/ComponentWrapper.jsx';
import Title from '../../styles/Title';
import Container from '../../styles/Container';
import Button, { loadMoreContainer } from '../../styles/Button';
import Dropdown from '../shared/DropDown.jsx';
import {
	getComponent,
	hasCustomRenderer,
	isFunction,
	connect,
	updateCustomQuery,
	updateDefaultQuery,
	isQueryIdentical,
} from '../../utils/index';

const {
	updateQuery,
	setQueryOptions,
	setCustomQuery,
	setDefaultQuery,
} = Actions;
const {
	getQueryOptions,
	checkValueChange,
	checkPropChange,
	getClassName,
	getOptionsFromQuery,
	isEqual,
	getCompositeAggsQuery
} = helper;
const SingleDropdownList = {
	name: 'SingleDropdownList',
	data() {
		const props = this.$props;
		this.__state = {
			currentValue: '',
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
		defaultQuery: types.func,
		defaultValue: types.string,
		value: types.value,
		filterLabel: types.string,
		innerClass: types.style,
		placeholder: VueTypes.string.def('Select a value'),
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
		const props = this.$props;
		this.modifiedOptions = this.options && this.options[props.dataField]
			? this.options[props.dataField].buckets
			: []
		// Set custom and default queries in store
		updateCustomQuery(this.componentId, this.setCustomQuery, this.$props, this.currentValue);
		updateDefaultQuery(this.componentId, this.setDefaultQuery, this.$props, this.currentValue);
	},
	beforeMount() {
		this.updateQueryOptions(this.$props);

		if (this.selectedValue) {
			this.setValue(this.selectedValue);
		} else if (this.$props.value) {
			this.setValue(this.$props.value);
		} else if (this.$props.defaultValue) {
			this.setValue(this.$props.defaultValue);
		}
	},
	watch: {
		options(newVal, oldVal) {
			if(newVal) {
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
			}

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
		const { showLoadMore, loadMoreLabel, renderItem, renderError, renderLabel } = this.$props;
		const { isLastBucket } = this.$data;
		let selectAll = [];
		const renderItemCalc = this.$scopedSlots.renderItem || renderItem;
		const renderErrorCalc = this.$scopedSlots.renderError || renderError;
		const renderLabelCalc = this.$scopedSlots.renderLabel || renderLabel;
		const renderNoResults = this.$scopedSlots.renderNoResults || this.$props.renderNoResults;

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
					handleChange={this.handleChange}
					selectedItem={this.$data.currentValue}
					placeholder={this.$props.placeholder}
					labelField="key"
					showCount={this.$props.showCount}
					hasCustomRenderer={this.hasCustomRenderer}
					customRenderer={this.getComponent}
					renderItem={renderItemCalc}
					renderNoResults={this.$scopedSlots.renderNoResults || this.$props.renderNoResults}
					themePreset={this.themePreset}
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
		setValue(value, props = this.$props) {
			const performUpdate = () => {
				this.currentValue = value;
				this.updateQueryHandler(value, props);
				this.$emit('valueChange', value);
				this.$emit('value-change', value);
			};

			checkValueChange(props.componentId, value, props.beforeValueChange, performUpdate);
		},

		handleChange(item) {
			const { value } = this.$props;
			if (value === undefined) {
				this.setValue(item);
			} else {
				this.$emit('change', item);
			}
		},

		updateDefaultQueryHandler(value, props) {
			let defaultQueryOptions;
			let query = SingleDropdownList.defaultQuery(value, props);
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
				componentType: componentTypes.singleDropdownList,
			});
		},

		updateQueryHandler(value, props) {
			const { customQuery } = props;
			let query = SingleDropdownList.defaultQuery(value, props);
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
				componentType: componentTypes.singleDropdownList,
			});
		},

		generateQueryOptions(props, after) {
			const queryOptions = getQueryOptions(props);
			return props.showLoadMore
				? getCompositeAggsQuery({
					query: queryOptions, props, after
				})
				: getAggsQuery(queryOptions, props);
		},

		updateQueryOptions(props, addAfterKey = false) {
			// when using composite aggs flush the current options for a fresh query
			if (props.showLoadMore && !addAfterKey) {
				this.modifiedOptions = [];
			} // for a new query due to other changes don't append after to get fresh results

			const queryOptions = SingleDropdownList.generateQueryOptions(
				props,
				addAfterKey ? this.$data.after : {},
			);
			if (props.defaultQuery) {
				const value = this.$data.currentValue;
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
SingleDropdownList.defaultQuery = (value, props) => {
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
SingleDropdownList.generateQueryOptions = (props, after) => {
	const queryOptions = getQueryOptions(props);
	return props.showLoadMore
		? getCompositeAggsQuery({
			query: queryOptions, props, after
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
		|| '',
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


const ListConnected = ComponentWrapper(connect(mapStateToProps, mapDispatchtoProps)(SingleDropdownList), {
	componentType: componentTypes.singleDropdownList,
	internalComponent: true,
});

SingleDropdownList.install = function(Vue) {
	Vue.component(SingleDropdownList.name, ListConnected);
};

// Add componentType for SSR
SingleDropdownList.componentType = componentTypes.singleDropdownList;

export default SingleDropdownList;
