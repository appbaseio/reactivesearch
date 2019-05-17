import VueTypes from 'vue-types';
import VueSlider from 'vue-slider-component'
import { Actions, helper } from '@appbaseio/reactivecore';
import Container from '../../styles/Container';
import { connect } from '../../utils/index';
import Title from '../../styles/Title';
import Slider from '../../styles/Slider';
import types from '../../utils/vueTypes';

const {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryListener,
	setQueryOptions,
} = Actions;

const { checkValueChange, getClassName, getOptionsFromQuery, isEqual } = helper;

const DynamicRangeSlider = {
	name: 'DynamicRangeSlider',

	components: { VueSlider },

	props: {
		beforeValueChange: types.func,
		className: VueTypes.string.def(''),
		rangeLabels: types.func,
		componentId: types.stringRequired,
		customQuery: types.func,
		data: types.data,
		dataField: types.stringRequired,
		defaultSelected: types.func,
		filterLabel: types.string,
		innerClass: types.style,
		react: types.react,
		showFilter: VueTypes.bool.def(true),
		showCheckbox: VueTypes.bool.def(true),
		title: types.title,
		URLParams: VueTypes.bool.def(false),
		sliderOptions: VueTypes.object.def({}),
		nestedField: types.string,
	},

	data() {
		this.internalRangeComponent = `${this.componentId}__range__internal`;
		this.locked = false;

		return {
			currentValue: null,
			stats: [],
		};
	},

	created() {
		const onQueryChange = (...args) => {
			this.$emit('queryChange', ...args);
		};
		this.setQueryListener(this.componentId, onQueryChange, null);
	},

	beforeMount() {
		this.addComponent(this.componentId);
		this.addComponent(this.internalRangeComponent);

		if (Array.isArray(this.selectedValue)) {
			this.handleChange(this.selectedValue);
		} else if (this.selectedValue) {
			this.handleChange(DynamicRangeSlider.parseValue(this.selectedValue, this.$props));
		}

		// get range before executing other queries
		this.updateRangeQueryOptions();
		this.setReact();
	},

	beforeUpdate() {
		if (!this.currentValue) {
			this.setDefaultValue(this.range);
		}
	},

	beforeDestroy() {
		this.removeComponent(this.componentId);
		this.removeComponent(this.internalRangeComponent);
	},

	methods: {
		setDefaultValue({ start, end }) {
			if (this.$props.defaultSelected) {
				const { start: defaultStart, end: defaultEnd } = this.defaultSelected(start, end);
				this.currentValue = [defaultStart, defaultEnd];
				this.handleChange(this.currentValue);
			} else {
				this.currentValue = [start, end];
			}
		},

		setReact() {
			if (this.react) {
				this.watchComponent(this.internalRangeComponent, this.react);
				this.watchComponent(this.componentId, this.react);
			} else {
				this.watchComponent(this.internalRangeComponent, {});
				this.watchComponent(this.componentId, {});
			}
		},

		rangeQuery() {
			return {
				min: { min: { field: this.dataField } },
				max: { max: { field: this.dataField } },
			};
		},

		updateRangeQueryOptions() {
      let aggs = {};

      if (this.nestedField) {
        aggs = {
          [this.nestedField]: {
            nested: {
              path: this.nestedField,
            },
            aggs: this.rangeQuery(),
          },
        };
      } else {
        aggs = this.rangeQuery();
      }

      this.setQueryOptions(this.internalRangeComponent, { aggs });
    },

		handleChange(currentValue) {
			if (this.beforeValueChange && this.locked) return;

			// Always keep the values within range
			const normalizedValue = [
				currentValue[0] < this.range.start ? this.range.start : currentValue[0],
				currentValue[1] > this.range.end ? this.range.end : currentValue[1],
			];

			this.locked = true;

			const performUpdate = () => {
				this.currentValue = normalizedValue;
				this.updateQueryHandler(normalizedValue, this.$props);
				this.locked = false;
				this.$emit('valueChange', { start: normalizedValue[0], end: normalizedValue[1] });
			};

			checkValueChange(
				this.componentId,
				{
					start: normalizedValue[0],
					end: normalizedValue[1],
				},
				this.beforeValueChange,
				performUpdate,
			);
		},

		updateQueryHandler(value) {
			let query = DynamicRangeSlider.defaultQuery(value, this.$props);
			let customQueryOptions;

			if (this.customQuery) {
				({ query } = this.customQuery(value, this.$props) || {});
				customQueryOptions = getOptionsFromQuery(this.customQuery(value, this.$props));
			}

			const { start, end } = this.range;
			const [currentStart, currentEnd] = value;
			// check if the slider is at its initial position
			const isInitialValue = currentStart === start && currentEnd === end;
			this.setQueryOptions(this.componentId, customQueryOptions);

			this.updateQuery({
				componentId: this.componentId,
				query,
				value,
				label: this.filterLabel,
				showFilter: this.showFilter && !isInitialValue,
				URLParams: this.URLParams,
				componentType: 'DYNAMICRANGESLIDER',
			});
		},
	},

	computed: {
		labels() {
			if (!this.rangeLabels) return null;

			return this.rangeLabels(this.range.start, this.range.end)
		},
	},

	watch: {
		react() {
			this.setReact();
		},

		selectedValue(newValue) {
			if (isEqual(newValue, this.currentValue)) return;

			const value = newValue || {
				start: this.range.start,
				end: this.range.end
			};

			this.handleChange(DynamicRangeSlider.parseValue(value, this.$props));
		},

		range(newValue, oldValue) {
			if (isEqual(newValue, oldValue)) return;

			const [currentStart, currentEnd] = this.currentValue || []
			const { start: oldStart, end: oldEnd } = oldValue || {}

			const newStart = currentStart === oldStart ? newValue.start : currentStart;
			const newEnd = currentEnd === oldEnd ? newValue.end : currentEnd;

			this.handleChange([newStart, newEnd])
		}
	},

	render() {
		if (!this.range) {
			return null;
		}

		return (
			<Container class={this.className}>
				{this.title && (
					<Title class={getClassName(this.innerClass, 'title')}>
						{this.title}
					</Title>
				)}
					<Slider class={getClassName(this.innerClass, 'slider')}>
						<VueSlider
							value={this.currentValue}
							min={this.range.start}
							max={this.range.end}
							onChange={this.handleChange}
							dotSize={20}
							height={4}
							enable-cross={false}
							lazy
							{...{ props: this.sliderOptions }}
						/>

						{this.labels ? (
							<div class="label-container">
								<label class={getClassName(this.innerClass, 'label') || 'range-label-left'}>
									{this.labels.start}
								</label>
								<label class={getClassName(this.innerClass, 'label') || 'range-label-right'}>
									{this.labels.end}
								</label>
							</div>
						) : null}
					</Slider>
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

DynamicRangeSlider.parseValue = (value, props) => [value.start, value.end]

const mapStateToProps = (state, props) => {
	const componentId = state.aggregations[props.componentId]
	const internalRange = state.aggregations[`${props.componentId}__range__internal`];

	let options = componentId && componentId[props.dataField];
	let range = state.aggregations[`${props.componentId}__range__internal`];

	if (props.nestedField) {
		options = options && componentId[props.dataField][props.nestedField] && componentId[props.dataField][props.nestedField].buckets
			? componentId[props.dataField][props.nestedField].buckets
			: [];
		range = range && internalRange[props.nestedField].min
			? { start: internalRange[props.nestedField].min.value, end: internalRange[props.nestedField].max.value }
			: null;
	} else {
		options = options && componentId[props.dataField].buckets
			? componentId[props.dataField].buckets
			: [];
		range = range && internalRange.min
			? { start: internalRange.min.value, end: internalRange.max.value }
			: null;
	}

	return {
		options,
		range,
		selectedValue: state.selectedValues[props.componentId]
			? state.selectedValues[props.componentId].value
			: null,
	};
};

const mapDispatchtoProps = {
	addComponent,
	removeComponent,
	updateQuery,
	watchComponent,
	setQueryListener,
	setQueryOptions,
};

const RangeConnected = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(DynamicRangeSlider);

DynamicRangeSlider.install = function (Vue) {
	Vue.component(DynamicRangeSlider.name, RangeConnected);
};
export default DynamicRangeSlider;
