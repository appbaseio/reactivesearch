import VueTypes from 'vue-types';
import { Actions, helper } from '@appbaseio/reactivecore';
import NoSSR from 'vue-no-ssr';
import Container from '../../styles/Container';
import { connect } from '../../utils/index';
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
} = Actions;

const { checkValueChange, getClassName, getOptionsFromQuery, isEqual } = helper;

const DynamicRangeSlider = {
	name: 'DynamicRangeSlider',
	components: getComponents(),
	data() {
		const state = {
			currentValue: null,
			stats: [],
		};
		this.locked = false;
		return state;
	},

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

	methods: {
		setRange({ start, end }) {
			if (this.$props.defaultSelected) {
				const { start: defaultStart, end: defaultEnd } = this.$props.defaultSelected(
					start,
					end,
				);
				this.currentValue = [defaultStart, defaultEnd];
				this.handleChange(this.currentValue);
			} else {
				this.currentValue = [start, end];
			}
		},

		setReact(props) {
			if (props.react) {
				this.watchComponent(props.componentId, props.react);
			} else {
				this.watchComponent(props.componentId, {});
			}
		},

		updateRange(range) {
			this.currentValue = range;
		},

		rangeQuery(props) {
			return {
				min: { min: { field: props.dataField } },
				max: { max: { field: props.dataField } },
			};
		},

		updateRangeQueryOptions(props) {
			let queryOptions = {};
			const { nestedField } = props;
			if (nestedField) {
				queryOptions = {
					aggs: {
						[nestedField]: {
							nested: {
								path: nestedField,
							},
							aggs: this.rangeQuery(props),
						},
					},
				};
			} else {
				queryOptions = {
					aggs: this.rangeQuery(props),
				};
			}

			this.setQueryOptions(this.componentId, queryOptions);
		},

		handleSlider(values) {
			this.handleChange(values.currentValue);
		},

		handleChange(currentValue, props = this.$props) {
			if (props.beforeValueChange && this.locked) {
				return;
			}

			this.locked = true;
			const performUpdate = () => {
				this.currentValue = currentValue;
				this.updateQueryHandler([currentValue[0], currentValue[1]], props);
				this.locked = false;
				this.$emit('valueChange', { start: currentValue[0], end: currentValue[1] });
			};

			checkValueChange(
				props.componentId,
				{
					start: currentValue[0],
					end: currentValue[1],
				},
				props.beforeValueChange,
				performUpdate,
			);
		},

		updateQueryHandler(value, props) {
			const { customQuery } = props;
			let query = DynamicRangeSlider.defaultQuery(value, props);
			let customQueryOptions;
			if (customQuery) {
				({ query } = customQuery(value, props) || {});
				customQueryOptions = getOptionsFromQuery(customQuery(value, props));
			}
			const { showFilter } = props;
			const { start, end } = this.range;
			const [currentStart, currentEnd] = value;
			// check if the slider is at its initial position
			const isInitialValue = currentStart === start && currentEnd === end;
			this.setQueryOptions(props.componentId, customQueryOptions);

			this.updateQuery({
				componentId: props.componentId,
				query,
				value,
				label: props.filterLabel,
				showFilter: showFilter && !isInitialValue,
				URLParams: props.URLParams,
				componentType: 'DYNAMICRANGESLIDER',
			});
		},

		getRangeLabels() {
			let { start: startLabel, end: endLabel } = this.range;

			if (this.$props.rangeLabels) {
				const rangeLabels = this.$props.rangeLabels(this.range.start, this.range.end);
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
			this.setReact(this.$props);
		},

		selectedValue(newVal) {
			if (!isEqual(this.$data.currentValue, newVal)) {
				let value = newVal;
				if (!value) {
					value = {
						start: this.range.start,
						end: this.range.end,
					};
				}
				this.handleChange(DynamicRangeSlider.parseValue(value, this.$props));
			}
		},
	},

	created() {
		const onQueryChange = (...args) => {
			this.$emit('queryChange', ...args);
		};
		this.setQueryListener(this.$props.componentId, onQueryChange, null);
	},

	beforeMount() {
		this.updateRangeQueryOptions(this.$props);
		this.addComponent(this.$props.componentId);
		this.setReact(this.$props);
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
		this.removeComponent(this.$props.componentId);
	},

	render() {
		if (!this.range) {
			return null;
		}

		const { startLabel, endLabel } = this.getRangeLabels();
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
							value={this.currentValue}
							min={this.range.start}
							max={this.range.end}
							onDrag-end={this.handleSlider}
							dotSize={20}
							height={4}
							enable-cross={false}
							{...{ props: this.$props.sliderOptions }}
						/>

						{this.$props.rangeLabels ? (
							<div class="label-container">
								<label
									class={
										getClassName(this.$props.innerClass, 'label')
										|| 'range-label-left'
									}
								>
									{startLabel}
								</label>
								<label
									class={
										getClassName(this.$props.innerClass, 'label')
										|| 'range-label-right'
									}
								>
									{endLabel}
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

DynamicRangeSlider.parseValue = value => [value.start, value.end];

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
