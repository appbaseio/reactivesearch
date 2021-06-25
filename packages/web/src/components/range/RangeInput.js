import React, { Component } from 'react';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { isEqual, getClassName } from '@appbaseio/reactivecore/lib/utils/helper';
import hoistNonReactStatics from 'hoist-non-react-statics';
import RangeSlider from './RangeSlider';
import Input from '../../styles/Input';
import Flex from '../../styles/Flex';
import Content from '../../styles/Content';
import Container from '../../styles/Container';

import { connect } from '../../utils';

class RangeInput extends Component {
	constructor(props) {
		super(props);

		let value = props.value || props.defaultValue || props.range;
		if (props.selectedValue) {
			value = {
				start: props.selectedValue[0],
				end: props.selectedValue[1],
			};
		}
		if (!this.shouldUpdate(value)) {
			// assign the range if not valid
			value = props.range;
		}
		this.state = {
			start: value.start,
			end: value.end,
			isStartValid: true,
			isEndValid: true,
		};
	}

	componentDidMount() {
		const { enableAppbase, index } = this.props;
		if (!enableAppbase && index) {
			console.warn(
				'Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.',
			);
		}
	}

	componentDidUpdate(prevProps) {
		if (!isEqual(this.props.value, prevProps.value)) {
			this.handleSlider(this.props.value);
		}
	}

	// for SSR
	static defaultQuery = RangeSlider.defaultQuery;
	static parseValue = RangeSlider.parseValue;

	handleInputChange = (e) => {
		const { name, value } = e.target;
		if (Number.isNaN(value)) {
			// set errors for invalid inputs
			if (name === 'start') {
				this.setState({
					isStartValid: false,
				});
			} else {
				this.setState({
					isEndValid: false,
				});
			}
		} else {
			// reset error states for valid inputs
			// eslint-disable-next-line
			if (name === 'start' && !this.state.isStartValid) {
				this.setState({
					isStartValid: true,
				});
			} else if (name === 'end' && !this.state.isEndValid) {
				this.setState({
					isEndValid: true,
				});
			}
		}

		const currentValue = {
			...this.value,
			[name]: value,
		};

		const { value: valueProp, onChange } = this.props;
		if (this.shouldUpdate(currentValue)) {
			if (valueProp === undefined) {
				this.setState({
					[name]: value,
				});
			} else if (onChange) {
				onChange(currentValue);
			}
		}
	};

	get isControlled() {
		return !!(this.props.value && this.props.onChange);
	}

	get value() {
		return {
			start: this.isControlled ? this.props.value.start : this.state.start,
			end: this.isControlled ? this.props.value.end : this.state.end,
		};
	}

	shouldUpdate = (value = {}) => {
		const { validateRange } = this.props;
		if (validateRange) {
			return validateRange([value.start, value.end]);
		}
		return true;
	}

	handleSliderChange = (sliderValue) => {
		const [start, end] = sliderValue || [this.props.range.start, this.props.range.end];
		const { value, onChange } = this.props;

		if (value === undefined) {
			this.handleSlider({ start, end });
		} else if (onChange) {
			onChange({ start, end });
		}
	};

	handleSlider = ({ start, end }) => {
		if (!this.isControlled) {
			this.setState({
				start,
				end,
			});
		}
		if (this.props.onValueChange) {
			this.props.onValueChange({
				start,
				end,
			});
		}
	};

	render() {
		const {
			className, style, themePreset, ...rest
		} = this.props;

		return (
			<Container style={style} className={className}>
				<RangeSlider
					{...rest}
					value={{
						start: this.state.isStartValid ? +this.value.start : this.props.range.start,
						end: this.state.isEndValid ? +this.value.end : this.props.range.end,
					}}
					onChange={this.handleSliderChange}
					className={getClassName(this.props.innerClass, 'slider-container') || null}
				/>
				<Flex className={getClassName(this.props.innerClass, 'input-container') || null}>
					<Flex direction="column" flex={2}>
						<Input
							name="start"
							type="number"
							onChange={this.handleInputChange}
							value={this.value.start}
							step={this.props.stepValue}
							alert={!this.state.isStartValid}
							className={getClassName(this.props.innerClass, 'input') || null}
							themePreset={themePreset}
							max={this.value.end}
							aria-label={`${this.props.componentId}-start-input`}
						/>
						{!this.state.isStartValid && (
							<Content alert>Input range is invalid</Content>
						)}
					</Flex>
					<Flex justifyContent="center" alignItems="center" flex={1}>
						-
					</Flex>
					<Flex direction="column" flex={2}>
						<Input
							name="end"
							type="number"
							onChange={this.handleInputChange}
							value={this.value.end}
							step={this.props.stepValue}
							min={this.value.start}
							alert={!this.state.isEndValid}
							className={getClassName(this.props.innerClass, 'input') || null}
							themePreset={themePreset}
							aria-label={`${this.props.componentId}-end-input`}
						/>
						{!this.state.isEndValid && <Content alert>Input range is invalid</Content>}
					</Flex>
				</Flex>
			</Container>
		);
	}
}

RangeInput.propTypes = {
	className: types.string,
	defaultValue: types.range,
	validateRange: types.func,
	value: types.range,
	selectedValue: types.selectedValue,
	innerClass: types.style,
	onValueChange: types.func,
	onChange: types.func,
	range: types.range,
	stepValue: types.number,
	style: types.style,
	themePreset: types.themePreset,
	componentId: types.stringRequired,
	includeNullValues: types.bool,
	enableAppbase: types.bool,
	index: types.string,
};

RangeInput.defaultProps = {
	range: {
		start: 0,
		end: 10,
	},
	stepValue: 1,
	includeNullValues: false,
};

const mapStateToProps = (state, props) => ({
	themePreset: state.config.themePreset,
	selectedValue: state.selectedValues[props.componentId]
		? state.selectedValues[props.componentId].value
		: null,
	enableAppbase: state.config.enableAppbase,
});

const ConnectedComponent = connect(
	mapStateToProps,
	null,
)(props => <RangeInput ref={props.myForwardedRef} {...props} />);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, RangeInput);

ForwardRefComponent.displayName = 'RangeInput';
export default ForwardRefComponent;
