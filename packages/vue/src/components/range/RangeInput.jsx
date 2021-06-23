import VueTypes from 'vue-types';
import { helper } from '@appbaseio/reactivecore';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import Container from '../../styles/Container';
import { connect } from '../../utils/index';
import ComponentWrapper from '../basic/ComponentWrapper.jsx';
import types from '../../utils/vueTypes';
import { RangeConnected as RangeSlider } from './RangeSlider.jsx';
import Input from '../../styles/Input';
import Content from '../../styles/Content';
import Flex from '../../styles/Flex';

const { getClassName, isEqual } = helper;

const RangeInput = {
	name: 'RangeInput',
	components: {
		RangeSlider,
	},
	inject: {
		theme: {
			from: 'theme_reactivesearch',
		},
	},
	data() {
		const state = {
			currentValue: {
				start: this.$props.range ? this.$props.range.start : 0,
				end: this.$props.range ? this.$props.range.end : 10
			},
			isStartValid: true,
			isEndValid: true
		};
		return state;
	},

	props: {
		className: {
			types: types.string,
			default: ''
		},
		defaultValue: types.range,
		validateRange: types.func,
		value: types.range,
		dataField: types.stringRequired,
		innerClass: types.style,
		range: {
			types: types.range,
			default() {
				return {
					start: 0,
					end: 10
				}
			}
		},
		rangeLabels: types.rangeLabels,
		stepValue: types.number,
		componentStyle: types.style,
		componentId: types.stringRequired,
		includeNullValues: VueTypes.bool,
		beforeValueChange: types.func,
		customQuery: types.func,
		data: types.data,
		filterLabel: types.string,
		react: types.react,
		showFilter: VueTypes.bool.def(true),
		showCheckbox: VueTypes.bool.def(true),
		title: types.title,
		URLParams: VueTypes.bool.def(false),
		sliderOptions: VueTypes.object.def({}),
		nestedField: types.string,
	},

	methods: {
		shouldUpdate(value) {
			const { validateRange } = this.$props;
			if (validateRange && value) {
				return validateRange([value.start, value.end]);
			}
			if (value) {
				return value.start <= value.end;
			}
			return false;
		},
		isControlled() {
			if (this.$props.value && this.$listeners) {
				return true;
			}
			return false;
		},
		handleChange(value, event) {
			let currentValue = value;
			if (this.shouldUpdate(value) && !isEqual(value, this.currentValue)) {
				switch (event) {
					case 'change':
						if(!value) {
							currentValue = {
								start: this.$props.range ? this.$props.range.start : 0,
								end: this.$props.range ? this.$props.range.end : 10
							}
						}
						this.$data.currentValue = {...currentValue};
						this.$emit('change', this.$data.currentValue);
						break;
					case 'value-change':
						this.$emit('valueChange', this.$data.currentValue);
						this.$emit('value-change', this.$data.currentValue);
						break;
					default:
						this.$data.currentValue = {...currentValue};
						break;
				}
			}
		},
		handleOnChange(value) {
			this.handleChange(value, 'change');
		},
		handleValueChange(value) {
			this.handleChange(value, 'value-change');
		},
		handleInputChange(e) {
			const { name, value } = e.target;
			if (Number.isNaN(value)) {
				if (name === 'start') {
					this.$data.isStartValid = false;
				} else {
					this.$data.isEndValid = false;
				}
			} else if (name === 'start' && !this.$data.isStartValid) {
				this.$data.isStartValid = true;
			} else if (name === 'end' && !this.$data.isEndValid) {
				this.$data.isEndValid = true;
			}

			if (this.$data.isStartValid && this.$data.isEndValid) {
				if (name === 'start') {
					this.handleChange({
						start: Number(value),
						end: this.$data.currentValue.end
					}, 'change');
				} else {
					this.handleChange({
						start: this.$data.currentValue.start,
						end: Number(value)
					}, 'change');
				}
			}
		}
	},
	watch: {
		defaultValue(newVal, oldVal) {
			if (oldVal.start !== newVal.start || oldVal.end !== newVal.end) {
				this.handleChange(newVal)
			}
		},
		value(newVal, oldVal) {
			if (!isEqual(newVal, oldVal)) {
				if (this.isControlled()) {
					this.handleChange(newVal, 'change');
				}
			}
		},
	},
	created() {
		if (this.$props.defaultValue && this.$props.defaultValue.start && this.$props.defaultValue.end) {
			this.handleChange(this.$props.defaultValue)
		}
	},
	render() {
		const {
			className,
			dataField,
			range,
			rangeLabels,
			componentId,
			innerClass,
			stepValue,
			componentStyle,
			themePreset,
			includeNullValues,
			beforeValueChange,
			customQuery,
			data,
			filterLabel,
			react,
			showFilter,
			showCheckbox,
			title,
			URLParams,
			sliderOptions,
			nestedField,
		} = this.$props;
		return (
			<Container style={componentStyle} class={className}>
				<RangeSlider
					componentId={componentId}
					value={{
						start: this.currentValue.start,
						end: this.currentValue.end
					}}
					range={range}
					dataField={dataField}
					rangeLabels={rangeLabels}
					includeNullValues={includeNullValues}
					beforeValueChange={beforeValueChange}
					customQuery={customQuery}
					data={data}
					filterLabel={filterLabel}
					react={react}
					showFilter={showFilter}
					showCheckbox={showCheckbox}
					title={title}
					URLParams={URLParams}
					sliderOptions={sliderOptions}
					nestedField={nestedField}
					on-change={this.handleOnChange}
					on-value-change={this.handleValueChange}
				/>
				<Flex class={getClassName(innerClass, 'input-container') || ''}>
					<Flex direction="column" flex={2}>
						<Input
							key={`${componentId}-start-value`}
							name="start"
							type="number"
							onChange={this.handleInputChange}
							step={stepValue}
							themePreset={themePreset}
							aria-label={`${componentId}-start-input`}
							min={this.$props.range ? this.$props.range.start : 0}
							class={getClassName(innerClass, 'input') || ''}
							alert={!this.isStartValid}
							{
							...{
								domProps: {
									value: this.currentValue.start
								}
							}
							}
						/>
						{!this.isStartValid && (
							<Content alert>Input range is invalid</Content>
						)}
					</Flex>
					<Flex justifyContent="center" alignItems="center" flex={1}>
						-
					</Flex>
					<Flex direction="column" flex={2}>
						<Input
							key={`${componentId}-end-value`}
							name="end"
							type="number"
							onChange={this.handleInputChange}
							step={stepValue}
							themePreset={themePreset}
							aria-label={`${componentId}-end-input`}
							max={this.$props.range ? this.$props.range.end : 10}
							class={getClassName(innerClass, 'input') || ''}
							alert={!this.isEndValid}
							{
							...{
								domProps: {
									value: this.currentValue.end
								}
							}
							}
						/>
						{!this.isEndValid && <Content alert>Input range is invalid</Content>}
					</Flex>
				</Flex>
			</Container>
		);
	},
};

const mapStateToProps = (state) => ({
	themePreset: state.config.themePreset,
});

const RangeConnected = ComponentWrapper(connect(mapStateToProps, {})(RangeInput), {
	componentType: componentTypes.rangeInput,
});

RangeInput.install = function(Vue) {
	Vue.component(RangeInput.name, RangeConnected);
};

// Add componentType for SSR
RangeInput.componentType = componentTypes.rangeInput;

export default RangeInput;
