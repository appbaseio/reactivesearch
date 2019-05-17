import VueTypes from 'vue-types';
import VueSlider from 'vue-slider-component'
import { Actions, helper } from '@appbaseio/reactivecore';
import NoSSR from 'vue-no-ssr';
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
		const state = {
			currentValue: null,
			stats: [],
		};
		this.locked = false;
		return state;
	},

	created() {
		const onQueryChange = (...args) => {
			this.$emit('queryChange', ...args);
		};
		this.setQueryListener(this.componentId, onQueryChange, null);
	},

	beforeMount() {
		this.updateRangeQueryOptions();
		this.addComponent(this.componentId);
		this.setReact();
		const { selectedValue } = this;

		if (Array.isArray(selectedValue)) {
			this.handleChange(selectedValue);
		} else if (selectedValue) {
			this.handleChange(DynamicRangeSlider.parseValue(selectedValue, this.$props));
		}
	},

	beforeUpdate() {
		if (!this.currentValue) {
			this.setRange(this.range);
		}
	},

	beforeDestroy() {
		this.removeComponent(this.componentId);
	},

	methods: {
		setRange({ start, end }) {
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
				this.watchComponent(this.componentId, this.react);
			} else {
				this.watchComponent(this.componentId, {});
			}
		},

		updateRange(range) {
			this.currentValue = range;
		},

		rangeQuery() {
			return {
				min: { min: { field: this.dataField } },
				max: { max: { field: this.dataField } },
			};
		},

		updateRangeQueryOptions() {
			let queryOptions = {};

			if (this.nestedField) {
				queryOptions = {
					aggs: {
						[this.nestedField]: {
							nested: {
								path: this.nestedField,
							},
							aggs: this.rangeQuery(),
						},
					},
				};
			} else {
				queryOptions = {
					aggs: this.rangeQuery(),
				};
			}

			this.setQueryOptions(this.componentId, queryOptions);
		},

		handleChange(currentValue) {
			if (this.beforeValueChange && this.locked) {
				return;
			}

			this.locked = true;
			const performUpdate = () => {
				this.currentValue = currentValue;
				this.updateQueryHandler([currentValue[0], currentValue[1]], this.$props);
				this.locked = false;
				this.$emit('valueChange', { start: currentValue[0], end: currentValue[1] });
			};

			checkValueChange(
				this.componentId,
				{
					start: currentValue[0],
					end: currentValue[1],
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

		getRangeLabels() {
			let { start: startLabel, end: endLabel } = this.range;

			if (this.rangeLabels) {
				const rangeLabels = this.rangeLabels(this.range.start, this.range.end);
				startLabel = rangeLabels.start;
				endLabel = rangeLabels.end;
			}

			return {
				startLabel,
				endLabel,
			};
		},
	},

	watch: {
		react() {
			this.setReact();
		},

		selectedValue(newVal) {
			if (!isEqual(this.currentValue, newVal)) {
				let value = newVal;
				if(!value){
					value = {
						start: this.range.start,
						end: this.range.end
					};
				}
				this.handleChange(DynamicRangeSlider.parseValue(value, this.$props));
			}
		},

	},

	render() {
		if (!this.range) {
			return null;
		}

		const { startLabel, endLabel } = this.getRangeLabels();
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
							{...{ props: this.sliderOptions }}
						/>

						{this.rangeLabels ? (
							<div class="label-container">
								<label
									class={
										getClassName(this.innerClass, 'label')
										|| 'range-label-left'
									}
								>
									{startLabel}
								</label>
								<label
									class={
										getClassName(this.innerClass, 'label')
										|| 'range-label-right'
									}
								>
									{endLabel}
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
	let options
		= state.aggregations[props.componentId]
		&& state.aggregations[props.componentId][props.dataField];
	let range = state.aggregations[props.componentId];
	if (props.nestedField) {
		options
			= options
			&& state.aggregations[props.componentId][props.dataField][props.nestedField]
			&& state.aggregations[props.componentId][props.dataField][props.nestedField].buckets
				? state.aggregations[props.componentId][props.dataField][props.nestedField].buckets
				: [];
		range
			= range && state.aggregations[props.componentId][props.nestedField].min
				? {
					start: state.aggregations[props.componentId][props.nestedField].min.value,
					end: state.aggregations[props.componentId][props.nestedField].max.value,
				} // prettier-ignore
				: null;
	} else {
		options
			= options && state.aggregations[props.componentId][props.dataField].buckets
				? state.aggregations[props.componentId][props.dataField].buckets
				: [];
		range
			= range && state.aggregations[props.componentId].min
				? {
					start: state.aggregations[props.componentId].min.value,
					end: state.aggregations[props.componentId].max.value,
				} // prettier-ignore
				: null;
	}
	return {
		options,
		selectedValue: state.selectedValues[props.componentId]
			? state.selectedValues[props.componentId].value
			: null,
		range,
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

DynamicRangeSlider.install = function(Vue) {
	Vue.component(DynamicRangeSlider.name, RangeConnected);
};
export default DynamicRangeSlider;
