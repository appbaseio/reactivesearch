import VueTypes from 'vue-types';
import VueSlider from 'vue-slider-component'
import { Actions, helper } from '@appbaseio/reactivecore';
import Container from '../../styles/Container';
import { connect } from '../../utils/index';
import Title from '../../styles/Title';
import Slider from '../../styles/Slider';
import types from '../../utils/vueTypes';

const { addComponent, removeComponent, watchComponent, updateQuery, setQueryListener, setQueryOptions } = Actions;

const { checkValueChange, getClassName, getOptionsFromQuery, isEqual } = helper;

const RangeSlider = {
	name: 'RangeSlider',

	components: { VueSlider },

	data() {
		const state = {
			currentValue: this.$props.range ? [this.$props.range.start, this.$props.range.end] : [],
			stats: [],
		};
		this.locked = false;
		return state;
	},

	props: {
		beforeValueChange: types.func,
		className: VueTypes.string.def(''),
		range: VueTypes.shape({
			start: VueTypes.integer.def(0),
			end: VueTypes.integer.def(10),
		}),
		rangeLabels: types.rangeLabels,
		componentId: types.stringRequired,
		customQuery: types.func,
		data: types.data,
		dataField: types.stringRequired,
		defaultSelected: types.range,
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
		setReact(props) {
			if (props.react) {
				this.watchComponent(props.componentId, props.react);
			}
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
			let query = RangeSlider.defaultQuery(value, props);
			let customQueryOptions;
			if (customQuery) {
				({ query } = customQuery(value, props) || {});
				customQueryOptions = getOptionsFromQuery(customQuery(value, props));
			}
			const {
				showFilter,
				range: { start, end },
			} = props;
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
				componentType: 'RANGESLIDER',
			});
		},
	},
	watch: {
		react() {
			this.setReact(this.$props);
		},

		defaultSelected(newVal) {
			this.handleChange(RangeSlider.parseValue(newVal, this.$props));
		},

		selectedValue(newVal) {
			if (!isEqual(this.$data.currentValue, newVal)) {
				this.handleChange(RangeSlider.parseValue(newVal, this.$props));
			}
		},
	},

	created() {
		const onQueryChange = (...args) => {
			this.$emit('queryChange', ...args);
		};
		if (!this.$props.range) {
			console.error(
				'%crange is not defined. Read more about this at https://opensource.appbase.io/reactive-manual/vue/range-components/rangeslider.html#props',
				'font-size: 12.5px;',
			);
		}
		this.setQueryListener(this.$props.componentId, onQueryChange, null);
	},

	beforeMount() {
		this.addComponent(this.$props.componentId);
		this.setReact(this.$props);

		const { defaultSelected } = this.$props;
		const { selectedValue } = this;
		if (this.$props.range) {
			if (Array.isArray(selectedValue)) {
				this.handleChange(selectedValue);
			} else if (selectedValue) {
				this.handleChange(RangeSlider.parseValue(selectedValue, this.$props));
			} else if (defaultSelected) {
				this.handleChange(RangeSlider.parseValue(defaultSelected, this.$props));
			}
		}
	},

	beforeDestroy() {
		this.removeComponent(this.$props.componentId);
	},

	render() {
		return (
			<Container class={this.$props.className}>
				{this.$props.title && (
					<Title class={getClassName(this.$props.innerClass, 'title')}>
						{this.$props.title}
					</Title>
				)}
				{this.$props.range ? (
						<Slider class={getClassName(this.$props.innerClass, 'slider')}>
							<VueSlider
								ref="slider"
								value={this.currentValue}
								min={this.$props.range.start}
								max={this.$props.range.end}
								onDrag-end={this.handleSlider}
								dotSize={20}
								height={4}
								enable-cross={false}
								{...{ props: this.$props.sliderOptions }}
							/>
							{this.$props.rangeLabels && (
								<div class="label-container">
									<label
										class={
											getClassName(this.$props.innerClass, 'label')
											|| 'range-label-left'
										}
									>
										{this.$props.rangeLabels.start}
									</label>
									<label
										class={
											getClassName(this.$props.innerClass, 'label')
											|| 'range-label-right'
										}
									>
										{this.$props.rangeLabels.end}
									</label>
								</div>
							)}
						</Slider>
				) : null}
			</Container>
		);
	},
};

RangeSlider.defaultQuery = (values, props) => {
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

RangeSlider.parseValue = (value, props) => {
	if (value) {
		return [value.start, value.end];
	} else if (props.range) {
		return [props.range.start, props.range.end];
	}
	return [];
};

const mapStateToProps = (state, props) => ({
	options: state.aggregations[props.componentId]
		? state.aggregations[props.componentId][props.dataField]
		  && state.aggregations[props.componentId][props.dataField].buckets // eslint-disable-line
		: [],
	selectedValue: state.selectedValues[props.componentId]
		? state.selectedValues[props.componentId].value
		: null,
});

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
)(RangeSlider);

RangeSlider.install = function(Vue) {
	Vue.component(RangeSlider.name, RangeConnected);
};
export default RangeSlider;
