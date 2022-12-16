import VueTypes from 'vue-types';
import NoSSR from 'vue-no-ssr';
import { Actions, helper } from '@appbaseio/reactivecore';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import Container from '../../styles/Container';
import PreferencesConsumer from '../basic/PreferencesConsumer.jsx';
import { connect, updateCustomQuery, getValidPropsKeys, isQueryIdentical } from '../../utils/index';
import Title from '../../styles/Title';
import Slider from '../../styles/Slider';
import types from '../../utils/vueTypes';
import { getComponents } from './addons/ssr';

const {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryListener,
	setQueryOptions,
	setComponentProps,
	setCustomQuery,
	updateComponentProps,
} = Actions;

const {
	checkValueChange,
	getClassName,
	isEqual,
	checkSomePropChange,
	extractQueryFromCustomQuery,
	getOptionsForCustomQuery,
} = helper;

const DynamicRangeSlider = {
	name: 'DynamicRangeSlider',

	components: getComponents(),

	props: {
		beforeValueChange: types.func,
		className: VueTypes.string.def(''),
		rangeLabels: types.func,
		componentId: types.stringRequired,
		customQuery: types.func,
		data: types.data,
		dataField: types.stringRequired,
		defaultValue: types.func,
		filterLabel: types.string,
		innerClass: types.style,
		react: types.react,
		showFilter: VueTypes.bool.def(true),
		destroyOnUnmount: VueTypes.bool,
		showCheckbox: VueTypes.bool.def(true),
		title: types.title,
		URLParams: VueTypes.bool.def(false),
		sliderOptions: VueTypes.object.def({}),
		nestedField: types.string,
		index: VueTypes.string,
		value: types.range,
		endpoint: types.endpointConfig,
	},

	data() {
		this.internalRangeComponent = `${this.$props.componentId}__range__internal`;

		return {
			currentValue: null,
			stats: [],
		};
	},

	created() {
		const onQueryChange = (...args) => {
			this.$emit('queryChange', ...args);
			this.$emit('query-change', ...args);
		};
		this.setQueryListener(this.$props.componentId, onQueryChange, null);
		// Update props in store
		this.setComponentProps(this.componentId, this.$props, componentTypes.dynamicRangeSlider);
		this.setComponentProps(
			this.internalRangeComponent,
			this.$props,
			componentTypes.dynamicRangeSlider,
		);
		if (!this.enableAppbase && this.$props.index) {
			console.warn(
				'Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.',
			);
		}
		// Set custom query in store
		updateCustomQuery(this.componentId, this.setCustomQuery, this.$props, this.currentValue);
	},
	mounted() {
		this.setReact();
	},
	beforeMount() {
		let components = [];
		if (this.$$store) {
			({ components } = this.$$store.getState());
		}
		const { value } = this.$props;
		if (this.destroyOnUnmount || components.indexOf(this.componentId) === -1) {
			this.addComponent(this.componentId);
			this.addComponent(this.internalRangeComponent);
			if (Array.isArray(this.selectedValue)) {
				this.handleChange(this.selectedValue);
			} else if (this.selectedValue) {
				this.handleChange(DynamicRangeSlider.parseValue(this.selectedValue, this.$props));
			} else if (value) {
				this.handleChange(DynamicRangeSlider.parseValue(value, this.$props));
			}

			// get range before executing other queries
			this.updateRangeQueryOptions();
		}
	},

	beforeUpdate() {
		if (!this.currentValue) {
			this.setDefaultValue(this.range);
		}
	},

	beforeDestroy() {
		if (this.destroyOnUnmount) {
			this.removeComponent(this.$props.componentId);
			this.removeComponent(this.internalRangeComponent);
		}
	},

	methods: {
		isControlled() {
			if (this.$props.value && this.$listeners) {
				return true;
			}
			return false;
		},
		setDefaultValue({ start, end }) {
			if (this.$props.defaultValue) {
				const { start: defaultStart, end: defaultEnd } = this.$props.defaultValue(
					start,
					end,
				);
				this.handleChange([defaultStart, defaultEnd]);
			} else if (this.isControlled()) {
				this.handleChange(DynamicRangeSlider.parseValue(this.$props.value), 'change');
			} else {
				this.currentValue = [start, end];
			}
		},

		setReact() {
			if (this.$props.react) {
				this.watchComponent(this.internalRangeComponent, this.$props.react);
				this.watchComponent(this.$props.componentId, this.$props.react);
			} else {
				this.watchComponent(this.internalRangeComponent, {});
				this.watchComponent(this.$props.componentId, {});
			}
		},

		rangeQuery() {
			return {
				min: { min: { field: this.$props.dataField } },
				max: { max: { field: this.$props.dataField } },
			};
		},

		updateRangeQueryOptions() {
			let aggs = {};

			if (this.$props.nestedField) {
				aggs = {
					[this.$props.nestedField]: {
						nested: {
							path: this.$props.nestedField,
						},
						aggs: this.rangeQuery(),
					},
				};
			} else {
				aggs = this.rangeQuery();
			}

			this.setQueryOptions(this.internalRangeComponent, { aggs });
		},

		handleSlider() {
			const sliderValues = this.$refs.slider.getValue();
			const { value } = this.$props;
			if (value === undefined) {
				this.handleChange(sliderValues);
			} else {
				this.$emit('change', {
					start: sliderValues[0],
					end: sliderValues[1],
				});
			}
		},

		handleChange(currentValue) {
			// Always keep the values within range
			const normalizedValue = [
				this.range ? Math.max(this.range.start, currentValue[0]) : currentValue[0],
				this.range ? Math.min(this.range.end, currentValue[1]) : currentValue[1],
			];

			const performUpdate = () => {
				this.currentValue = normalizedValue;
				this.updateQueryHandler(normalizedValue, this.$props);
				this.$emit('valueChange', { start: normalizedValue[0], end: normalizedValue[1] });
				this.$emit('value-change', { start: normalizedValue[0], end: normalizedValue[1] });
			};

			checkValueChange(
				this.$props.componentId,
				{
					start: normalizedValue[0],
					end: normalizedValue[1],
				},
				this.$props.beforeValueChange,
				performUpdate,
			);
		},

		updateQueryHandler(value) {
			let query = DynamicRangeSlider.defaultQuery(value, this.$props);

			if (this.$props.customQuery) {
				const customQueryTobeSet = this.$props.customQuery(value, this.$props);
				const queryTobeSet = extractQueryFromCustomQuery(customQueryTobeSet);
				if (queryTobeSet) {
					query = queryTobeSet;
				}
				const customQueryOptions = getOptionsForCustomQuery(customQueryTobeSet);
				updateCustomQuery(this.componentId, this.setCustomQuery, this.$props, value);

				this.setQueryOptions(this.$props.componentId, customQueryOptions, false);
			}

			const { start, end } = this.range || { start: value[0], end: value[1] };
			const [currentStart, currentEnd] = value;
			// check if the slider is at its initial position
			const isInitialValue = currentStart === start && currentEnd === end;

			this.updateQuery({
				componentId: this.$props.componentId,
				query,
				value,
				label: this.$props.filterLabel,
				showFilter: this.$props.showFilter && !isInitialValue,
				URLParams: this.$props.URLParams,
				componentType: componentTypes.dynamicRangeSlider,
			});
		},
	},

	computed: {
		labels() {
			if (!this.rangeLabels) return null;
			return this.rangeLabels(this.range.start, this.range.end);
		},
	},

	watch: {
		$props: {
			deep: true,
			handler(newVal) {
				const propsKeys = getValidPropsKeys(newVal);
				checkSomePropChange(newVal, this.componentProps, propsKeys, () => {
					this.updateComponentProps(
						this.componentId,
						newVal,
						componentTypes.dynamicRangeSlider,
					);
					this.updateComponentProps(
						this.internalRangeComponent,
						newVal,
						componentTypes.dynamicRangeSlider,
					);
				});
			},
		},
		react() {
			this.setReact();
		},

		selectedValue(newValue) {
			if (isEqual(newValue, this.currentValue)) return;

			const value = newValue || {
				start: this.range.start,
				end: this.range.end,
			};
			this.$emit('change', value);
			this.handleChange(DynamicRangeSlider.parseValue(value, this.$props));
		},

		range(newValue, oldValue) {
			if (isEqual(newValue, oldValue) || !this.currentValue) return;

			const [currentStart, currentEnd] = this.currentValue || [];
			const { start: oldStart, end: oldEnd } = oldValue || {};

			const newStart = currentStart === oldStart ? newValue.start : currentStart;
			const newEnd = currentEnd === oldEnd ? newValue.end : currentEnd;

			this.handleChange([newStart, newEnd]);
		},
		customQuery(newVal, oldVal) {
			if (!isQueryIdentical(newVal, oldVal, this.$data.currentValue, this.$props)) {
				this.updateQueryHandler(this.$data.currentValue);
			}
		},
		value(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				this.handleChange(DynamicRangeSlider.parseValue(newVal, this.$props));
			}
		},
	},

	render() {
		if (!this.range || !this.currentValue) {
			return null;
		}
		const { start, end } = this.range;
		return (
			<Container class={this.$props.className}>
				{this.$props.title && (
					<Title class={getClassName(this.$props.innerClass, 'title')}>
						{this.$props.title}
					</Title>
				)}
				<NoSSR>
					<Slider class={getClassName(this.$props.innerClass, 'slider')}>
						<vue-slider-component
							ref="slider"
							value={[
								Math.floor(Math.max(start, this.currentValue[0])),
								Math.ceil(Math.min(end, this.currentValue[1])),
							]}
							min={Math.floor(Math.min(start, this.currentValue[0]))}
							max={Math.ceil(Math.max(end, this.currentValue[1]))}
							onDrag-end={this.handleSlider}
							dotSize={20}
							height={4}
							enable-cross={false}
							tooltip="always"
							{...{ props: this.$props.sliderOptions }}
						/>

						{this.labels ? (
							<div class="label-container">
								<label
									class={
										getClassName(this.$props.innerClass, 'label')
										|| 'range-label-left'
									}
								>
									{this.labels.start}
								</label>
								<label
									class={
										getClassName(this.$props.innerClass, 'label')
										|| 'range-label-right'
									}
								>
									{this.labels.end}
								</label>
							</div>
						) : null}
					</Slider>
				</NoSSR>
			</Container>
		);
	},
};

DynamicRangeSlider.defaultQuery = (values, props) => {
	let query = null;

	if (Array.isArray(values) && values.length) {
		query = {
			range: {
				[props.dataField]: {
					gte: values[0],
					lte: values[1],
					boost: 2.0,
				},
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

DynamicRangeSlider.parseValue = (value) => {
	if (value) {
		return Array.isArray(value) ? value : [value.start, value.end];
	}
	return [];
};

DynamicRangeSlider.hasInternalComponent = () => true;

const mapStateToProps = (state, props) => {
	const componentId = state.aggregations[props.componentId];
	const internalRange = state.aggregations[`${props.componentId}__range__internal`];

	let options = componentId && componentId[props.dataField];
	let range = state.aggregations[`${props.componentId}__range__internal`];

	if (props.nestedField) {
		options
			= options
			&& componentId[props.dataField][props.nestedField]
			&& componentId[props.dataField][props.nestedField].buckets
				? componentId[props.dataField][props.nestedField].buckets
				: [];
		range
			= range && internalRange[props.nestedField].min
				? {
					start: internalRange[props.nestedField].min.value,
					end: internalRange[props.nestedField].max.value,
				  }
				: null;
	} else {
		options
			= options && componentId[props.dataField].buckets
				? componentId[props.dataField].buckets
				: [];
		range
			= range && internalRange.min
				? { start: internalRange.min.value, end: internalRange.max.value }
				: null;
	}

	return {
		options,
		range,
		selectedValue: state.selectedValues[props.componentId]
			? state.selectedValues[props.componentId].value
			: null,
		componentProps: state.props[props.componentId],
		enableAppbase: state.config.enableAppbase,
	};
};

const mapDispatchtoProps = {
	addComponent,
	removeComponent,
	updateQuery,
	watchComponent,
	setQueryListener,
	setQueryOptions,
	setComponentProps,
	setCustomQuery,
	updateComponentProps,
};

export const RangeConnected = PreferencesConsumer(
	connect(mapStateToProps, mapDispatchtoProps)(DynamicRangeSlider),
);

RangeConnected.name = DynamicRangeSlider.name;

RangeConnected.install = function (Vue) {
	Vue.component(RangeConnected.name, RangeConnected);
};

// Add componentType for SSR
RangeConnected.componentType = componentTypes.dynamicRangeSlider;

export default RangeConnected;
