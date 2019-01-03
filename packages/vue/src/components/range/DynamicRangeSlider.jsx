import VueTypes from 'vue-types';
import { Actions, helper } from '@appbaseio/reactivecore';
import NoSSR from 'vue-no-ssr';
import Container from '../../styles/Container';
import { connect } from '../../utils/index';
import Title from '../../styles/Title';
import Slider from '../../styles/Slider';
import types from '../../utils/vueTypes';
import { getComponents } from './addons/ssr';

const { addComponent, removeComponent, watchComponent, updateQuery, setQueryListener,setQueryOptions } = Actions;

const { checkValueChange, getClassName } = helper;

const DynamicRangeSlider = {
	name: 'DynamicRangeSlider',
	components: getComponents(),
	data() {
		this.state = {
			currentValue: null,
			stats: [],
		};
		this.locked = false;
		return this.state;
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
		sliderOptions: VueTypes.object.def({})
	},

	methods: {
		setRange({start, end}){
			if(this.$props.defaultSelected){
				const {start : defaultStart, end: defaultEnd} = this.$props.defaultSelected(start,end);
				this.state.currentValue = [defaultStart,defaultEnd];
			}else{
				this.state.currentValue = [start,end] ;
			}
		},

		setReact(props) {
			if (props.react) {
				this.watchComponent(props.componentId, props.react);
			}else{
				this.watchComponent(props.componentId, {})
			}
		},

		updateRange(range){
			this.currentValue = range;
		},

		rangeQuery(props){
			return {
				min: { min: { field: props.dataField } },
				max: { max: { field: props.dataField } },
			}
		},

		updateRangeQueryOptions(props){
			const queryOptions = {
				aggs: this.rangeQuery(props),
			};

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
			const query = props.customQuery || DynamicRangeSlider.defaultQuery;
			const {
				showFilter,
			} = props;

			const {start, end} = this.range;

			const [currentStart, currentEnd] = value;
			const isInitialValue = currentStart === start && currentEnd === end;

			this.updateQuery({
				componentId: props.componentId,
				query: query(value, props),
				value,
				label: props.filterLabel,
				showFilter: showFilter && !isInitialValue,
				URLParams: props.URLParams,
				componentType: 'DYNAMICRANGESLIDER',
			});
		},

		getRangeLabels(){
			let { start: startLabel, end: endLabel } = this.range;

			if (this.$props.rangeLabels) {
				const rangeLabels = this.$props.rangeLabels(
					this.range.start,
					this.range.end,
				);
				startLabel = rangeLabels.start;
				endLabel = rangeLabels.end;
			}

			return {
				startLabel,
				endLabel,
			};
		}
	},

	watch: {
		react() {
			this.setReact(this.$props);
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
		this.setReact(this.$props)
		const { selectedValue } = this;

		if (Array.isArray(selectedValue)) {
			this.handleChange(selectedValue);
		} else if (selectedValue) {
			this.handleChange(DynamicRangeSlider.parseValue(selectedValue, this.$props));
		}
	},

	beforeUpdate(){
		if(!this.state.currentValue){
			this.setRange(this.range);
		}
	},

	beforeDestroy() {
		this.removeComponent(this.$props.componentId);
	},

	render() {
		if(!this.range){
			return null;
		}

		const { startLabel, endLabel} = this.getRangeLabels();
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
							min={this.range.start}
							max={this.range.end}
							onDrag-end={this.handleSlider}
							dotSize={20}
							height={4}
							enable-cross={false}
							{...{ props: this.$props.sliderOptions }}
						/>

						{this.$props.rangeLabels ? <div class="label-container">
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
						</div>: null}
					</Slider>
				</NoSSR>
			</Container>
		);
	},
};

DynamicRangeSlider.defaultQuery = (values, props) => {
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

DynamicRangeSlider.parseValue = (value, props) =>
	value ? [value.start, value.end] : [props.range.start, props.range.end];

const mapStateToProps = (state, props) => ({
	options: state.aggregations[props.componentId]
		? state.aggregations[props.componentId][props.dataField]
		&& state.aggregations[props.componentId][props.dataField].buckets // eslint-disable-line
		: [],
	selectedValue: state.selectedValues[props.componentId]
		? state.selectedValues[props.componentId].value
		: null,
	range:
		state.aggregations[props.componentId]
			&& state.aggregations[props.componentId].min
			? {
				start: state.aggregations[props.componentId].min.value,
				end: state.aggregations[props.componentId].max.value,
			} // prettier-ignore
			: null,
});

const mapDispatchtoProps = {
	addComponent,
	removeComponent,
	updateQuery,
	watchComponent,
	setQueryListener,
	setQueryOptions
};

const RangeConnected = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(DynamicRangeSlider);

DynamicRangeSlider.install = function (Vue) {
	Vue.component(DynamicRangeSlider.name, RangeConnected);
};
export default DynamicRangeSlider;
