import { Actions } from '@appbaseio/reactivecore';
import {
	componentTypes,
	TREELIST_VALUES_PATH_SEPARATOR,
} from '@appbaseio/reactivecore/lib/utils/constants';

import VueTypes from 'vue-types';
import {
	recLookup,
	setDeep,
	updateCustomQuery as updateCustomQueryHelper,
	updateDefaultQuery as updateDefaultQueryHelper,
	transformTreeListLocalStateIntoQueryComptaibleFormat,
	getQueryOptions,
	getAggsQuery,
	updateInternalQuery,
	checkValueChange,
	getOptionsFromQuery,
	getClassName,
	transformRawTreeListData,
	getComponent as getComponentHelper,
	isEqual,
} from '@appbaseio/reactivecore/lib/utils/helper';
import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';
import { replaceDiacritics } from '@appbaseio/reactivecore/lib/utils/suggestions';
import ComponentWrapper from '../../basic/ComponentWrapper.jsx';
import PreferencesConsumer from '../../basic/PreferencesConsumer.jsx';

import Container from '../../../styles/Container';
import { connect, hasCustomRenderer } from '../../../utils/index';
import types from '../../../utils/vueTypes';
import Title from '../../../styles/Title';
import Input from '../../../styles/Input';
import { sanitizeObject } from '../utils';
import HierarchicalMenuComponent from './HierarchicalMenuComponent.jsx';

const { updateQuery: updateQueryAction, setQueryOptions } = Actions;

const transformValueIntoLocalState = (valueArray) => {
	let valueToSet = {};
	if (valueArray.length) {
		const newSelectedValues = {};
		valueArray.forEach((valueItem) => {
			setDeep(
				newSelectedValues,
				valueItem.split(' > '),
				!recLookup(
					newSelectedValues,
					valueItem.split(' > '),
					TREELIST_VALUES_PATH_SEPARATOR,
				),
				true,
			);
		});
		valueToSet = newSelectedValues;
	}
	return valueToSet;
};

const TreeList = {
	name: 'TreeList',
	props: {
		selectedValue: types.selectedValue,
		error: types.title,
		rawData: types.rawData,
		aggregationData: types.rawData,
		themePreset: types.themePreset,
		updateQueryAction: types.funcRequired,
		setQueryOptions: types.funcRequired,
		// component props
		componentId: types.string.isRequired,
		className: types.string,
		style: types.style,
		showRadio: {
			type: types.bool,
		},
		showCheckbox: types.bool.def(false),
		mode: VueTypes.oneOf(['single', 'multiple']).def('multiple'),
		showCount: {
			type: types.bool,
		},
		showSearch: {
			type: types.bool,
		},
		showIcon: {
			type: types.bool,
		},
		icon: types.children,
		showLeafIcon: {
			type: types.bool,
		},
		leafIcon: types.children,
		showLine: {
			type: types.bool,
		},
		switcherIcon: types.func,
		render: types.func,
		renderItem: types.func,
		innerClass: types.style,
		placeholder: types.string,
		title: types.title,
		isLoading: types.bool,
		dataField: types.stringArray.isRequired,
		onQueryChange: types.func,
		defaultValue: types.stringArray,
		value: types.stringArray,
		customQuery: types.func,
		defaultQuery: types.func,
		enableAppbase: types.bool,
		index: types.string,
		showFilter: types.bool,
		URLParams: types.bool,
		filterLabel: types.string,
		onChange: types.func,
		onValueChange: types.func,
		beforeValueChange: types.func,
		sortBy: types.sortByWithCount.def('count'),
		onError: types.func,
		showSwitcherIcon: types.bool.def(true),
		renderError: types.title,
		renderNoResults: types.func,
		loader: types.title,
		aggergationSize: types.number,
		endpoint: types.endpoint,
		queryFormat: types.queryFormatSearch.def('or'),
		size: types.number.def(100),
		nestedField: types.string,
		react: types.react,
		transformData: types.func,
		selectAllLabel: types.string,
		showMissing: VueTypes.bool.def(false),
		missingLabel: VueTypes.string.def('N/A'),
	},
	data() {
		const props = this.$props;
		this.__state = {
			selectedValues: {},
			searchTerm: '',
			aggregationData: [],
		};
		this.internalComponent = `${props.componentId}__internal`;
		return this.__state;
	},
	created() {
		const props = this.$props;
		const { componentId } = props;
		const defaultValue = this.defaultValue || this.value;
		const currentValueArray = this.selectedValue || defaultValue || [];
		// update local state for selected values
		if (currentValueArray.length) {
			const newSelectedValues = transformValueIntoLocalState(currentValueArray);
			this.setValue(newSelectedValues, true);
		}

		// Set custom and default queries in store
		updateCustomQueryHelper(componentId, props, currentValueArray);
		updateDefaultQueryHelper(componentId, props, currentValueArray);

		this.updateQueryOptions();
	},
	mounted() {
		const { enableAppbase, index } = this.$props;
		if (!enableAppbase && index) {
			console.warn(
				'Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.',
			);
		}
	},
	watch: {
		defaultQuery() {
			this.updateDefaultQuery();
			this.updateQuery([]);
		},
		customQuery() {
			const valueArray
				= transformTreeListLocalStateIntoQueryComptaibleFormat(this.$data.selectedValues)
				|| [];
			this.updateQuery(valueArray);
		},
		sortBy() {
			this.updateQueryOptions();
		},
		dataField() {
			const valueArray
				= transformTreeListLocalStateIntoQueryComptaibleFormat(this.$data.selectedValues)
				|| [];
			this.updateQueryOptions();
			this.updateQuery(valueArray);
		},
		value(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.setValue(newVal);
			}
		},
		selectedValue(newVal) {
			if (
				!isEqual(
					transformTreeListLocalStateIntoQueryComptaibleFormat(this.$data.selectedValues),
					newVal,
				)
			) {
				const { value, onChange } = this.$props;
				let valueToSet = [];
				if (Array.isArray(newVal) && newVal.length) {
					valueToSet = newVal;
				}
				if (value === undefined) {
					this.setValue(valueToSet);
				} else if (onChange && !isEqual(value, valueToSet)) {
					onChange(valueToSet);
				}
			}
		},
		aggregationData(newVal, oldVal) {
			if (newVal && !isEqual(newVal, oldVal)) {
				this.$data.aggregationData = newVal;
			}
		},
	},
	computed: {
		hasCustomRenderer() {
			return hasCustomRenderer(this);
		},
	},
	methods: {
		renderIcon(isLeafNode) {
			const { showIcon, showLeafIcon, icon } = this.$props;

			if (isLeafNode) {
				if (!showLeafIcon) return null;

				const { leafIcon } = this.$slots || this.$props;
				if (leafIcon) return leafIcon();

				return (
					<span role="img" aria-label="file" class="--leaf-icon">
						<svg
							viewBox="64 64 896 896"
							focusable="false"
							data-icon="file"
							width="1em"
							height="1em"
							fill="currentColor"
							aria-hidden="true"
						>
							<path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494z" />
						</svg>
					</span>
				);
			}
			if (!showIcon) return null;

			if (icon) {
				return icon;
			}
			if (this.$slots.icon) {
				return this.$slots.icon();
			}
			return (
				<span role="img" aria-label="folder-open" class="--folder-icon">
					<svg
						viewBox="64 64 896 896"
						focusable="false"
						data-icon="folder-open"
						width="1em"
						height="1em"
						fill="currentColor"
						aria-hidden="true"
					>
						<path d="M928 444H820V330.4c0-17.7-14.3-32-32-32H473L355.7 186.2a8.15 8.15 0 00-5.5-2.2H96c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h698c13 0 24.8-7.9 29.7-20l134-332c1.5-3.8 2.3-7.9 2.3-12 0-17.7-14.3-32-32-32zM136 256h188.5l119.6 114.4H748V444H238c-13 0-24.8 7.9-29.7 20L136 643.2V256zm635.3 512H159l103.3-256h612.4L771.3 768z" />
					</svg>
				</span>
			);
		},
		getTransformedData() {
			const { dataField, showSearch } = this.$props;
			const transformedData = transformRawTreeListData(this.$data.aggregationData, dataField);

			let filteredData = [];
			if (showSearch && this.$data.searchTerm) {
				filteredData = this.filterDataBasedOnSearchTerm(transformedData, '');
			}
			return filteredData.length ? filteredData : transformedData;
		},
		handleInputChange(e) {
			const { value } = e.target;
			this.$data.searchTerm = value;
		},
		renderSearch() {
			const { showSearch, innerClass, placeholder, componentId, themePreset } = this.$props;
			if (showSearch) {
				return (
					<Input
						class={getClassName(innerClass, 'input') || null}
						onChange={this.handleInputChange}
						value={this.$data.searchTerm}
						placeholder={placeholder || 'Search'}
						style={{
							margin: '0 0 8px',
						}}
						aria-label={`${componentId}-search`}
						themePreset={themePreset}
					/>
				);
			}
			return null;
		},
		handleListItemClick(key, parentPath) {
			let path = key;
			if (parentPath) {
				path = `${parentPath}${TREELIST_VALUES_PATH_SEPARATOR}${key}`;
			}
			let newSelectedValues = { ...this.selectedValues };
			if (this.$props.mode === 'single') {
				newSelectedValues = {};
				setDeep(newSelectedValues, path.split(TREELIST_VALUES_PATH_SEPARATOR), true, true);
			} else {
				const newValue = !recLookup(
					newSelectedValues,
					path,
					TREELIST_VALUES_PATH_SEPARATOR,
				);

				setDeep(
					newSelectedValues,
					path.split(TREELIST_VALUES_PATH_SEPARATOR),
					newValue,
					true,
				);
			}
			newSelectedValues = sanitizeObject({ ...newSelectedValues });
			if (this.$props.value === undefined) {
				this.setValue(newSelectedValues);
			} else if (this.$props.onChange) {
				const valueToSet
					= transformTreeListLocalStateIntoQueryComptaibleFormat(newSelectedValues);

				this.$props.onChange(valueToSet);
			}
		},
		filterDataBasedOnSearchTerm(listArray, parentPath) {
			if (!(listArray && Array.isArray(listArray) && listArray.length)) {
				return null;
			}
			const result = [];
			listArray.forEach((ele) => {
				const isLeafItem = !ele.list;
				let newParentPath = ele.key;
				if (parentPath) {
					newParentPath = `${parentPath}.${ele.key}`;
				}
				const keyHasSearchTerm
					= replaceDiacritics(ele.key)
						.toLowerCase()
						.includes(replaceDiacritics(this.$data.searchTerm).toLowerCase())
					|| recLookup(
						this.$data.selectedValues,
						newParentPath,
						TREELIST_VALUES_PATH_SEPARATOR,
					);

				if (isLeafItem && keyHasSearchTerm) {
					result.push({
						...ele,
						initiallyExpanded: keyHasSearchTerm,
					});
				} else if (!isLeafItem) {
					const filteredChildrenItems = this.filterDataBasedOnSearchTerm(
						ele.list,
						newParentPath,
					);
					if (keyHasSearchTerm || !!filteredChildrenItems.length) {
						result.push({
							...ele,
							initiallyExpanded: keyHasSearchTerm || !!filteredChildrenItems.length,
							list: filteredChildrenItems,
						});
					}
				}
			});

			return result;
		},
		getComponent() {
			const { rawData, error, isLoading } = this.$props;
			const data = {
				data: this.getTransformedData(),
				rawData,
				error,
				handleClick: this.handleListItemClick,
				value: this.$data.selectedValues,
				loading: isLoading,
			};
			return getComponentHelper(data, this.$props);
		},
		getDefaultQuery(value) {
			let query = null;
			const type = 'term';
			const booleanAggregator = this.$props.queryFormat === 'or' ? 'should' : 'must';

			if (!Array.isArray(value) || value.length === 0) {
				return null;
			}

			if (value) {
				// adds a sub-query with must as an array of objects for each term/value
				const queryArray = value.map((item) => ({
					bool: {
						must: item.split(' > ').map((subItem, i) => ({
							[type]: {
								[this.$props.dataField[i]]: subItem,
							},
						})),
					},
				}));
				const listQuery = {
					bool: {
						[booleanAggregator]: queryArray,
					},
				};

				query = value.length ? listQuery : null;
			}

			if (query && this.$props.nestedField) {
				return {
					nested: {
						path: this.$props.nestedField,
						query,
					},
				};
			}

			return query;
		},
		updateQuery(value) {
			const { customQuery } = this.$props;
			let query = this.getDefaultQuery(value);
			let customQueryOptions;
			if (customQuery) {
				({ query } = customQuery(value, this.$props) || {});
				customQueryOptions = getOptionsFromQuery(customQuery(value, this.$props));
				updateCustomQueryHelper(this.$props.componentId, this.$props, value);
			}
			this.setQueryOptions(this.$props.componentId, {
				...this.generateQueryOptions(),
				...customQueryOptions,
			});

			this.updateQueryAction({
				componentId: this.$props.componentId,
				query,
				value,
				label: this.$props.filterLabel,
				showFilter: this.$props.showFilter,
				URLParams: this.$props.URLParams,
				componentType: componentTypes.treeList,
			});
		},
		setValue(value, hasMountedParam = true) {
			const finalValues
				= Array.isArray(value) === false
					? transformTreeListLocalStateIntoQueryComptaibleFormat(value)
					: value;
			const performUpdate = () => {
				const handleUpdates = () => {
					this.updateQuery(finalValues);
					if (this.$props.onValueChange) this.$props.onValueChange(finalValues);
				};

				if (hasMountedParam) {
					this.selectedValues = Array.isArray(value)
						? transformValueIntoLocalState(value)
						: value;

					handleUpdates();
				} else {
					handleUpdates();
				}
			};

			checkValueChange(
				this.$props.componentId,
				finalValues,
				this.$props.beforeValueChange,
				performUpdate,
			);
		},
		generateQueryOptions() {
			const queryOptions = getQueryOptions(this.$props);
			const valueArray = transformTreeListLocalStateIntoQueryComptaibleFormat(
				this.selectedValues,
			);

			return getAggsQuery(valueArray, queryOptions, this.$props);
		},
		updateDefaultQuery(queryOptions) {
			const value = transformTreeListLocalStateIntoQueryComptaibleFormat(this.selectedValues);
			// Update default query for RS API
			updateDefaultQueryHelper(this.$props.componentId, this.$props, value);
			updateInternalQuery(
				getInternalComponentID(this.$props.componentId),
				queryOptions,
				value,
				this.$props,
				this.generateQueryOptions(),
				null,
			);
		},
		updateQueryOptions() {
			// for a new query due to other changes don't append after to get fresh results
			const queryOptions = this.generateQueryOptions(
				this.$props,
				{},
				transformTreeListLocalStateIntoQueryComptaibleFormat(this.$data.selectedValues),
			);
			if (this.$props.defaultQuery) {
				// eslint-disable-next-line no-use-before-define
				this.updateDefaultQuery(queryOptions);
			} else {
				this.setQueryOptions(getInternalComponentID(this.$props.componentId), queryOptions);
			}
		},
	},
	render() {
		const props = this.$props;
		const {
			style,
			className,
			mode,
			searchTerm,
			showLine,
			renderItem,
			showCheckbox,
			innerClass,
			showRadio,
			showCount,
			showSwitcherIcon,
			switcherIcon,
			title,
		} = props;
		return (
			<Container style={style} class={className}>
				{props.title && (
					<Title class={getClassName(innerClass, 'title') || null}>{title}</Title>
				)}
				{this.renderSearch()}
				{this.hasCustomRenderer ? (
					this.getComponent()
				) : (
					<HierarchicalMenuComponent
						key="initial-node"
						listArray={this.getTransformedData()}
						parentPath=""
						isExpanded={true}
						listItemProps={{
							mode,
							selectedValues: this.selectedValues,
							searchTerm,
							showLine,
							renderItem,
							handleListItemClick: this.handleListItemClick,
							showCheckbox,
							innerClass,
							showRadio,
							renderIcon: this.renderIcon,
							showCount,
							showSwitcherIcon,
							switcherIcon,
						}}
					/>
				)}
			</Container>
		);
	},
};

const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	rawData: state.rawData[props.componentId] || {},
	aggregationData:
		props.nestedField && state.aggregations[props.componentId]
			? state.aggregations[props.componentId].reactivesearch_nested
			: state.aggregations[props.componentId] || {},
	themePreset: state.config.themePreset,
	error: state.error[props.componentId],
	isLoading: state.isLoading[props.componentId],
	enableAppbase: state.config.enableAppbase,
});

const mapDispatchtoProps = {
	setQueryOptions,
	updateQueryAction,
};

TreeList.hasInternalComponent = () => true;

export const TreeListConnected = PreferencesConsumer(
	ComponentWrapper(connect(mapStateToProps, mapDispatchtoProps)(TreeList), {
		componentType: componentTypes.treeList,
		internalComponent: TreeList.hasInternalComponent(),
	}),
);
TreeListConnected.name = TreeList.name;
TreeListConnected.install = function (Vue) {
	Vue.component(TreeListConnected.name, TreeListConnected);
};

// Add componentType for SSR
TreeListConnected.componentType = componentTypes.treeList;

export default TreeListConnected;
