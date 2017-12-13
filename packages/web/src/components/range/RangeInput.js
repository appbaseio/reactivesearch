import React, { Component } from "react";
import types from "@appbaseio/reactivecore/lib/utils/types";
import {
	isEqual,
	getClassName
} from "@appbaseio/reactivecore/lib/utils/helper";

import RangeSlider from "./RangeSlider";
import Input from "../../styles/Input";
import Flex from "../../styles/Flex";
import Content from "../../styles/Content";

class RangeInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			start: this.props.defaultSelected ? this.props.defaultSelected.start : props.range.start,
			end: this.props.defaultSelected ? this.props.defaultSelected.end : props.range.end,
			isStartValid: true,
			isEndValid: true
		};
	}

	componentWillReceiveProps(nextProps) {
		if (!isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			this.handleSlider(nextProps.defaultSelected);
		}
	}

	handleInputChange = (e) => {
		const { name, value } = e.target;
		if (isNaN(value)) {
			// set errors for invalid inputs
			if (name === "start") {
				this.setState({
					isStartValid: false
				});
			} else {
				this.setState({
					isEndValid: false
				});
			}
		} else {
			// reset error states for valid inputs
			if (name === "start" && !this.state.isStartValid) {
				this.setState({
					isStartValid: true
				});
			} else if (name === "end" && !this.state.isEndValid) {
				this.setState({
					isEndValid: true
				});
			}
		}
		this.setState({
			[name]: value
		});
	};

	handleSlider = ({ start, end }) => {
		this.setState({
			start,
			end
		});
		if (this.props.onValueChange) {
			this.props.onValueChange({
				start,
				end
			});
		}
	}

	render() {
		return (
			<div>
				<RangeSlider
					{...this.props}
					defaultSelected={{
						start: this.state.isStartValid ? Number(this.state.start) : this.props.range.start,
						end: this.state.isEndValid ? Number(this.state.end) : this.props.range.end
					}}
					onValueChange={this.handleSlider}
				/>
				<Flex>
					<Flex direction="column" flex={2}>
						<Input
							name="start"
							type="number"
							onChange={this.handleInputChange}
							value={this.state.start}
							step={this.props.stepValue}
							alert={!this.state.isStartValid}
						/>
						{
							!this.state.isStartValid &&
							<Content alert>Input range is invalid</Content>
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
						/>
						{
							!this.state.isEndValid &&
							<Content alert>Input range is invalid</Content>
						}
					</Flex>
				</Flex>
			</div>
		);
	}
}

RangeInput.propTypes = {
	range: types.range,
	stepValue: types.number,
	defaultSelected: types.range,
	onValueChange: types.func
};

RangeInput.defaultProps = {
	range: {
		start: 0,
		end: 10
	},
	stepValue: 1
};

export default RangeInput;
