import React, { Component } from 'react';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { isEqual, getClassName } from '@appbaseio/reactivecore/lib/utils/helper';

import DynamicRangeSlider from './DynamicRangeSlider';
import Input from '../../styles/Input';
import Flex from '../../styles/Flex';
import Content from '../../styles/Content';
import Container from '../../styles/Container';

import { connect } from '../../utils';

class DynamicRangeInput extends Component {
	constructor(props) {
		super(props);
		const defaultStart = props.defaultSelected
			? props.defaultSelected.start
			: props.range.start;
		const defaultEnd = props.defaultSelected ? props.defaultSelected.end : props.range.end;
		this.state = {
			start: defaultStart,
			end: defaultEnd,
			maskedstart: props.inputFormat ? props.inputFormat(defaultStart) : defaultStart,
			maskedend: props.inputFormat ? props.inputFormat(defaultEnd) : defaultEnd,
			isStartValid: true,
			isEndValid: true,
		};

		this.startInputRef = React.createRef();
		this.endInputRef = React.createRef();
	}

	componentWillReceiveProps(nextProps) {
		if (!isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			this.handleSlider(nextProps.defaultSelected);
		}
	}

	// for SSR
	static defaultQuery = DynamicRangeSlider.defaultQuery;

	static parseValue = DynamicRangeSlider.parseValue;

	handleInputBlur = (e) => {
		const { name, value } = e.target;
		const { inputUnformat, inputFormat } = this.props;
		const val = Number(inputUnformat ? inputUnformat(value) : value);
		if (name === 'start' && val > this.state.end) {
			return this.setState(state => ({
				maskedstart: inputFormat ? inputFormat(state.end) : state.end,
				start: state.end,
			}));
		}
		if (name === 'end' && val < this.state.start) {
			return this.setState(state => ({
				maskedend: inputFormat ? inputFormat(state.start) : state.start,
				end: state.start,
			}));
		}
		return this.setState(state => ({
			[`masked${name}`]: inputFormat ? inputFormat(state[name]) : state[name],
		}));
	}

	handleInputChange = (e) => {
		const { name, value } = e.target;
		const val = this.props.inputUnformat ? this.props.inputUnformat(value) : value;

		if (Number.isNaN(val)) {
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
			this.setState({
				[`masked${name}`]: value,
			});
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
			this.setState({
				[name]: val,
				[`masked${name}`]: value,
			});
		}
	};

	handleSlider = ([start, end]) => {
		const { onValueChange, inputFormat } = this.props;
		if (
			document.activeElement !== this.startInputRef.current
			&& document.activeElement !== this.endInputRef.current
		) {
			this.setState({
				start,
				end,
				maskedstart: inputFormat ? inputFormat(start) : start,
				maskedend: inputFormat ? inputFormat(end) : end,
			});
		}
		if (onValueChange) {
			onValueChange({
				start,
				end,
				maskedstart: inputFormat ? inputFormat(start) : start,
				maskedend: inputFormat ? inputFormat(end) : end,
			});
		}
	};

	render() {
		const {
			className, style, themePreset, ...rest
		} = this.props;
		const {
			start,
			end,
			isStartValid,
			isEndValid,
			maskedstart,
			maskedend,
		} = this.state;

		return (
			<Container style={style} className={className}>
				<DynamicRangeSlider
					{...rest}
					defaultSelected={() => ({
						start: isStartValid ? Number(start) : this.props.range.start,
						end: isEndValid ? Number(end) : this.props.range.end,
					})}
					onDrag={([newStart, newEnd]) => {
						const { inputFormat } = this.props;
						const newStartInput = inputFormat ? inputFormat(newStart) : newStart;
						const newEndInput = inputFormat ? inputFormat(newEnd) : newEnd;
						this.startInputRef.current.value = newStartInput;
						this.endInputRef.current.value = newEndInput;
					}}
					onValueChange={this.handleSlider}
					className={getClassName(this.props.innerClass, 'slider-container') || null}
				/>
				{
					this.props.inputs ? this.props.inputs({
						innerClass: {
							'input-container': getClassName(this.props.innerClass, 'input-container'),
							input: getClassName(this.props.innerClass, 'input'),
						},
						value: {
							start,
							end,
							maskedstart,
							maskedend,
						},
						inputFormat: this.props.inputFormat,
						prefix: this.props.prefix,
						suffix: this.props.suffix,
						onChange: this.handleInputChange,
						onBlur: this.handleInputBlur,
						themePreset,
						alert: {
							start: this.state.isStartValid,
							end: this.state.isEndValid,
						},
						innerRef: {
							start: this.startInputRef,
							end: this.endInputRef,
						},
					}) : (
						<Flex className={getClassName(this.props.innerClass, 'input-container') || null}>
							<Flex flex={2}>
								{this.props.prefix ? this.props.prefix : null}
								<Input
									name="start"
									type="number"
									onChange={this.handleInputChange}
									onBlur={this.handleInputBlur}
									value={this.props.inputFormat ? this.props.inputFormat(start) : start}
									alert={!this.state.isStartValid}
									className={getClassName(this.props.innerClass, 'input') || null}
									themePreset={themePreset}
									innerRef={this.startInputRef}
									id="startInput"
								/>
								{this.props.suffix ? this.props.suffix : null}
								{!this.state.isStartValid && (
									<Content alert>Input range is invalid</Content>
								)}
							</Flex>
							<Flex alignItems="end" justifyContent="flex-end" flex={2}>
								{this.props.prefix ? this.props.prefix : null}
								<Input
									name="end"
									type="number"
									onChange={this.handleInputChange}
									onBlur={this.handleInputBlur}
									value={this.props.inputFormat ? this.props.inputFormat(end) : end}
									alert={!this.state.isEndValid}
									className={getClassName(this.props.innerClass, 'input') || null}
									themePreset={themePreset}
									innerRef={this.endInputRef}
									id="endInput"
								/>
								{this.props.suffix ? this.props.suffix : null}
								{!this.state.isEndValid && <Content alert>Input range is invalid</Content>}
							</Flex>
						</Flex>
					)
				}
			</Container>
		);
	}
}

DynamicRangeInput.propTypes = {
	className: types.string,
	defaultSelected: types.range,
	innerClass: types.style,
	onValueChange: types.func,
	inputs: types.func,
	inputFormat: types.func,
	inputUnformat: types.func,
	range: types.range,
	stepValue: types.number,
	style: types.style,
	themePreset: types.themePreset,
};

DynamicRangeInput.defaultProps = {
	range: {
		start: 0,
		end: 9999999999,
	},
	stepValue: 1,
};

const mapStateToProps = state => ({
	themePreset: state.config.themePreset,
});

export default connect(
	mapStateToProps,
	null,
)(DynamicRangeInput);
