import { Actions, helper } from '@appbaseio/reactivecore';
import VueTypes from 'vue-types';
import types from '../../utils/vueTypes';
import { getAggsQuery, getCompositeAggsQuery } from './utils';
import Title from '../../styles/Title';
import Container from '../../styles/Container';
import Button, { loadMoreContainer } from '../../styles/Button';
import Dropdown from '../shared/DropDown.jsx';
import {
	getComponent,
	hasCustomRenderer,
	isFunction,
	connect,
	getValidPropsKeys,
} from '../../utils/index';

const {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
	setQueryListener,
	updateComponentProps,
} = Actions;
const {
	getQueryOptions,
	pushToAndClause,
	checkValueChange,
	checkPropChange,
	getClassName,
	getOptionsFromQuery,
	isEqual,
	checkSomePropChange,
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
		const onQueryChange = (...args) => {
			this.$emit('queryChange', ...args);
		};
		this.setQueryListener(this.$props.componentId, onQueryChange, e => {
			this.$emit('error', e);
		});
	},
	mounted() {
		const propsKeys = getValidPropsKeys(this.$props);
		this.updateComponentProps(this.componentId, this.$props);
		this.$watch(propsKeys.join('.'), (newVal, oldVal) => {
			checkSomePropChange(newVal, oldVal, propsKeys, () => {
				this.updateComponentProps(this.componentId, this.$props);
			});
		});
	},
	beforeMount() {
		this.addComponent(this.internalComponent);
		this.addComponent(this.$props.componentId);
		this.updateQueryOptions(this.$props);
		this.setReact(this.$props);

		if (this.selectedValue) {
			this.setValue(this.selectedValue);
		} else if (this.$props.value) {
			this.setValue(this.$props.value);
		} else if (this.$props.defaultValue) {
			this.setValue(this.$props.defaultValue);
		}
	},

	beforeDestroy() {
		this.removeComponent(this.$props.componentId);
		this.removeComponent(this.internalComponent);
	},
	watch: {
		react() {
			this.setReact(this.$props);
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
	},

	render() {
		const { showLoadMore, loadMoreLabel, renderItem, renderError, renderLabel } = this.$props;
		const { isLastBucket } = this.$data;
		let selectAll = [];
		const renderItemCalc = this.$scopedSlots.renderItem || renderItem;
		const renderErrorCalc = this.$scopedSlots.renderError || renderError;
		const renderLabelCalc = this.$scopedSlots.renderLabel || renderLabel;

		if (renderErrorCalc && this.error) {
			return isFunction(renderErrorCalc) ? renderErrorCalc(this.error) : renderErrorCalc;
		}

		if (!this.hasCustomRenderer && this.$data.modifiedOptions.length === 0) {
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
		setReact(props) {
			const { react } = props;

			if (react) {
				const newReact = pushToAndClause(react, this.internalComponent);
				this.watchComponent(props.componentId, newReact);
			} else {
				this.watchComponent(props.componentId, {
					and: this.internalComponent,
				});
			}
		},

		setValue(value, props = this.$props) {
			const performUpdate = () => {
				this.currentValue = value;
				this.updateQueryHandler(value, props);
				this.$emit('valueChange', value);
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

		updateQueryHandler(value, props) {
			const { customQuery } = props;
			let query = SingleDropdownList.defaultQuery(value, props);
			let customQueryOptions;
			if (customQuery) {
				({ query } = customQuery(value, props) || {});
				customQueryOptions = getOptionsFromQuery(customQuery(value, props));
			}
			this.setQueryOptions(props.componentId, customQueryOptions);
			this.updateQuery({
				componentId: props.componentId,
				query,
				value,
				label: props.filterLabel,
				showFilter: props.showFilter,
				URLParams: props.URLParams,
				componentType: 'SINGLEDROPDOWNLIST',
			});
		},

		generateQueryOptions(props, after) {
			const queryOptions = getQueryOptions(props);
			return props.showLoadMore
				? getCompositeAggsQuery(queryOptions, props, after)
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
		? getCompositeAggsQuery(queryOptions, props, after)
		: getAggsQuery(queryOptions, props);
};

const mapStateToProps = (state, props) => ({
	options:
		props.nestedField && state.aggregations[props.componentId]
			? state.aggregations[props.componentId].reactivesearch_nested
			: state.aggregations[props.componentId],
	isLoading: state.isLoading[props.componentId],
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| '',
	themePreset: state.config.themePreset,
	error: state.error[props.componentId],
});

const mapDispatchtoProps = {
	addComponent,
	removeComponent,
	setQueryOptions,
	setQueryListener,
	updateQuery,
	watchComponent,
	updateComponentProps,
};

const ListConnected = connect(mapStateToProps, mapDispatchtoProps)(SingleDropdownList);

SingleDropdownList.install = function(Vue) {
	Vue.component(SingleDropdownList.name, ListConnected);
};
export default SingleDropdownList;
