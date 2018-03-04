import React, { Component } from 'react';
import types from '@appbaseio/reactivecore/lib/utils/types';
import {
	isEqual,
	getClassName,
} from '@appbaseio/reactivecore/lib/utils/helper';

import RangeSlider from './RangeSlider';
import Input from '../../styles/Input';
import Flex from '../../styles/Flex';
import Content from '../../styles/Content';
import Container from '../../styles/Container';

import { connect } from '../../utils';

class RangeInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			start: this.props.defaultSelected ? this.props.defaultSelected.start : props.range.start,
			end: this.props.defaultSelected ? this.props.defaultSelected.end : props.range.end,
			isStartValid: true,
			isEndValid: true,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (!isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			this.handleSlider(nextProps.defaultSelected);
		}
	}

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
		this.setState({
			[name]: value,
		});
	};

	handleSlider = ({ start, end }) => {
		this.setState({
			start,
			end,
		});
		if (this.props.onValueChange) {
			this.props.onValueChange({
				start,
				end,
			});
		}
	}

	render() {
		const {
			className, style, themePreset, ...rest
		} = this.props;
		return (
			<Container style={style} className={className}>
				<RangeSlider
					{...rest}
					defaultSelected={{
						start: this.state.isStartValid ? Number(this.state.start) : this.props.range.start,
						end: this.state.isEndValid ? Number(this.state.end) : this.props.range.end,
					}}
					onValueChange={this.handleSlider}
					className={getClassName(this.props.innerClass, 'slider-container') || null}
				/>
				<Flex className={getClassName(this.props.innerClass, 'input-container') || null}>
					<Flex direction="column" flex={2}>
						<Input
							name="start"
							type="number"
							onChange={this.handleInputChange}
							value={this.state.start}
							step={this.props.stepValue}
							alert={!this.state.isStartValid}
							className={getClassName(this.props.innerClass, 'input') || null}
							themePreset={themePreset}
						/>
						{
							!this.state.isStartValid
							&& <Content alert>Input range is invalid</Content>
						}
					</Flex>
					<Flex justifyContent="center" alignItems="center" flex={1}>-</Flex>
					<Flex direction="column" flex={2}>
						<Input
							name="end"
							type="number"
							onChange={this.handleInputChange}
							value={this.state.end}
							step={this.props.stepValue}
							alert={!this.state.isEndValid}
							className={getClassName(this.props.innerClass, 'input') || null}
							themePreset={themePreset}
						/>
						{
							!this.state.isEndValid
							&& <Content alert>Input range is invalid</Content>
						}
					</Flex>
				</Flex>
			</Container>
		);
	}
}

RangeInput.propTypes = {
	className: types.string,
	defaultSelected: types.range,
	innerClass: types.style,
	onValueChange: types.func,
	range: types.range,
	stepValue: types.number,
	style: types.style,
	themePreset: types.themePreset,
};

RangeInput.defaultProps = {
	range: {
		start: 0,
		end: 10,
	},
	stepValue: 1,
};

const mapStateToProps = state => ({
	themePreset: state.config.themePreset,
});

export default connect(mapStateToProps, null)(RangeInput);
