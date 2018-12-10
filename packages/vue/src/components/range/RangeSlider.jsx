import VueTypes from 'vue-types';
import { Actions, helper } from '@appbaseio/reactivecore';
import NoSSR from 'vue-no-ssr';
import Container from '../../styles/Container';
import { connect } from '../../utils/index';
import Title from '../../styles/Title';
import Slider from '../../styles/Slider';
import types from '../../utils/vueTypes';

const { addComponent, removeComponent, watchComponent, updateQuery, setQueryListener } = Actions;

const { checkValueChange, getClassName } = helper;

const getComponents = () => {
	const components = { NoSSR };
	if (process.browser) {
		// in older versions of nuxt, it's process.BROWSER_BUILD
		// eslint-disable-next-line
		const VueSlider = require('vue-slider-component');
		components['vue-slider'] = VueSlider;
	}
	return components;
};

const RangeSlider = {
	name: 'RangeSlider',
	components: getComponents(),
	data() {
		this.state = {
			currentValue: [this.$props.range.start, this.$props.range.end],
			stats: [],
		};
		this.locked = false;
		return this.state;
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
		tooltipTrigger: types.tooltipTrigger,
		mergeTooltip: VueTypes.bool.def(true),
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
				this.state.currentValue = currentValue;
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
			const query = props.customQuery || RangeSlider.defaultQuery;
			const {
				showFilter,
				range: { start, end },
			} = props;

			const [currentStart, currentEnd] = value;
			const isInitialValue = currentStart === start && currentEnd === end;

			this.updateQuery({
				componentId: props.componentId,
				query: query(value, props),
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
	},

	created() {
		const onQueryChange = (...args) => {
			this.$emit('queryChange', ...args);
		};
		this.setQueryListener(this.$props.componentId, onQueryChange, null);
	},
	beforeMount() {
		this.addComponent(this.$props.componentId);
		this.addComponent(this.internalComponent);
		this.setReact(this.$props);

		const { defaultSelected } = this.$props;
		const { selectedValue } = this;
		if (Array.isArray(selectedValue)) {
			this.handleChange(selectedValue);
		} else if (selectedValue) {
			this.handleChange(RangeSlider.parseValue(selectedValue, this.$props));
		} else if (defaultSelected) {
			this.handleChange(RangeSlider.parseValue(defaultSelected, this.$props));
		}
	},

	beforeDestroy() {
		this.removeComponent(this.$props.componentId);
	},

	render() {
		const tooltipTrigger
			= this.$props.tooltipTrigger === 'none' ? false : this.$props.tooltipTrigger;
		return (
			<Container class={this.$props.className}>
				{this.$props.title && (
					<Title class={getClassName(this.$props.innerClass, 'title')}>
						{this.$props.title}
					</Title>
				)}

				<NoSSR>
					<Slider class={getClassName(this.$props.innerClass, 'slider')}>
						<vue-slider
							ref="slider"
							value={this.state.currentValue}
							min={this.$props.range.start}
							max={this.$props.range.end}
							onDrag-end={this.handleSlider}
							dotSize={20}
							height={4}
							enable-cross={false}
							tooltip-merge={this.$props.mergeTooltip}
							tooltip={tooltipTrigger}
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
				</NoSSR>
			</Container>
		);
	},
};

RangeSlider.defaultQuery = (values, props) => {
	if (Array.isArray(values) && values.length) {
		return {
			range: {
				[props.dataField]: {
					gte: values[0],
					lte: values[1],
					boost: 2.0,
				},
			},
		};
	}
	return null;
};

RangeSlider.parseValue = (value, props) =>
	value ? [value.start, value.end] : [props.range.start, props.range.end];

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
};

const RangeConnected = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(RangeSlider);

RangeSlider.install = function(Vue) {
	Vue.component(RangeSlider.name, RangeConnected);
};
export default RangeSlider;
