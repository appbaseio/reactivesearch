import { Actions, helper } from '@appbaseio/reactivecore';
import VueTypes from 'vue-types';
import types from '../../utils/vueTypes';
import { getAggsQuery, getCompositeAggsQuery } from './utils';
import Title from '../../styles/Title';
import Container from '../../styles/Container';
import Button, { loadMoreContainer } from '../../styles/Button';
import Dropdown from '../shared/DropDown.jsx';
import { connect } from '../../utils/index';

const {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
	setQueryListener
} = Actions;
const {
	isEqual,
	getQueryOptions,
	pushToAndClause,
	checkValueChange,
	checkPropChange,
	getClassName
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
			isLastBucket: false
		};
		this.locked = false;
		this.internalComponent = `${props.componentId}__internal`;
		return this.__state;
	},
	props: {
		beforeValueChange: types.func,
		className: VueTypes.string.def(''),
		componentId: types.stringRequired,
		customQuery: types.func,
		dataField: types.stringRequired,
		defaultSelected: types.stringArray,
		filterLabel: types.string,
		innerClass: types.style,
		placeholder: VueTypes.string.def('Select values'),
		queryFormat: VueTypes.oneOf(['and', 'or']).def('or'),
		react: types.react,
		renderListItem: types.func,
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
		loadMoreLabel: VueTypes.oneOfType([VueTypes.string, VueTypes.any]).def(
			'Load More'
		),
		nestedField: types.string
	},
	created() {
		const onQueryChange = (...args) => {
			this.$emit('queryChange', ...args);
		};
		this.setQueryListener(this.$props.componentId, onQueryChange, null);
	},

	beforeMount() {
		this.addComponent(this.internalComponent);
		this.addComponent(this.$props.componentId);
		this.updateQueryOptions(this.$props);
		this.setReact(this.$props);

		if (this.selectedValue) {
			this.setValue(this.selectedValue, true);
		} else if (this.$props.defaultSelected) {
			this.setValue(this.$props.defaultSelected, true);
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
		selectedValue(newVal) {
			let selectedValue = Object.keys(this.$data.currentValue);
			if (this.$props.selectAllLabel) {
				selectedValue = selectedValue.filter(
					val => val !== this.$props.selectAllLabel
				);
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
							doc_count: bucket.doc_count
						}))
					];
					const after = newVal[dataField].after_key; // detect the last bucket by checking if the next set of buckets were empty
					const isLastBucket = !buckets.length;
					this.after = {
						after
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
		defaultSelected(newVal) {
			this.setValue(newVal);
		}
	},

	render() {
		const { showLoadMore, loadMoreLabel, renderListItem } = this.$props;
		const renderListItemCalc
			= this.$scopedSlots.renderListItem || renderListItem;
		const { isLastBucket } = this.$data;
		let selectAll = [];

		if (this.$data.modifiedOptions.length === 0) {
			return null;
		}

		if (this.$props.selectAllLabel) {
			selectAll = [
				{
					key: this.$props.selectAllLabel
				}
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
								key: String(item.key)
							}))
					]}
					handleChange={this.setValue}
					selectedItem={this.$data.currentValue}
					placeholder={this.$props.placeholder}
					labelField="key"
					multi
					showCount={this.$props.showCount}
					themePreset={this.themePreset}
					renderListItem={renderListItemCalc}
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
					and: this.internalComponent
				});
			}
		},

		setValue(value, isDefaultValue = false, props = this.$props) {
			// ignore state updates when component is locked
			if (props.beforeValueChange && this.locked) {
				return;
			}

			this.locked = true;
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

				if (value) {
					value.forEach(item => {
						currentValue[item] = true;
					});
				}

				if (selectAllLabel && selectAllLabel in currentValue) {
					const { [selectAllLabel]: del, ...obj } = currentValue;
					currentValue = {
						...obj
					};
				}
			} else {
				if (currentValue[value]) {
					const { [value]: del, ...rest } = currentValue;
					currentValue = {
						...rest
					};
				} else {
					currentValue[value] = true;
				}

				if (selectAllLabel && selectAllLabel in currentValue) {
					const { [selectAllLabel]: del, ...obj } = currentValue;
					currentValue = {
						...obj
					};
				}

				finalValues = Object.keys(currentValue);
			}

			const performUpdate = () => {
				this.currentValue = currentValue;
				this.updateQueryHandler(finalValues, props);
				this.locked = false;
				this.$emit('valueChange', finalValues);
			};

			checkValueChange(
				props.componentId,
				finalValues,
				props.beforeValueChange,
				performUpdate
			);
		},

		updateQueryHandler(value, props) {
			const query = props.customQuery || MultiDropdownList.defaultQuery;
			this.updateQuery({
				componentId: props.componentId,
				query: query(value, props),
				value,
				label: props.filterLabel,
				showFilter: props.showFilter,
				URLParams: props.URLParams,
				componentType: 'MULTIDROPDOWNLIST'
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

			const queryOptions = MultiDropdownList.generateQueryOptions(
				props,
				addAfterKey ? this.$data.after : {}
			);
			this.setQueryOptions(this.internalComponent, queryOptions);
		},

		handleLoadMore() {
			this.updateQueryOptions(this.$props, true);
		}
	}
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
					field: props.dataField
				}
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
							[props.dataField]: value.filter(
								item => item !== props.missingLabel
							)
						}
					}
				];
				if (hasMissingTerm) {
					should = should.concat({
						bool: {
							must_not: {
								exists: { field: props.dataField }
							}
						}
					});
				}
				listQuery = {
					bool: {
						should
					}
				};
			} else {
				listQuery = {
					[type]: {
						[props.dataField]: value
					}
				};
			}
		} else {
			// adds a sub-query with must as an array of objects for each term/value
			const queryArray = value.map(item => ({
				[type]: {
					[props.dataField]: item
				}
			}));
			listQuery = {
				bool: {
					must: queryArray
				}
			};
		}

		query = value.length ? listQuery : null;
	}

	if (query && props.nestedField) {
		return {
			query: {
				nested: {
					path: props.nestedField,
					query
				}
			}
		};
	}
	return query;
};

MultiDropdownList.generateQueryOptions = (props, after) => {
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
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	themePreset: state.config.themePreset
});

const mapDispatchtoProps = {
	addComponent,
	removeComponent,
	setQueryOptions,
	setQueryListener,
	updateQuery,
	watchComponent
};

const ListConnected = connect(
	mapStateToProps,
	mapDispatchtoProps
)(MultiDropdownList);

MultiDropdownList.install = function(Vue) {
	Vue.component(MultiDropdownList.name, ListConnected);
};
export default MultiDropdownList;
