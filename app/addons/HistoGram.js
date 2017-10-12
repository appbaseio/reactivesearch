import React, { Component } from "react";
import PropTypes from "prop-types";
import Bar from "./Bar";

const _ = require("lodash");

export default class HistoGramComponent extends Component {
	constructor(props) {
		super(props);
		this.style = {
			barContainer: {
				position: "relative",
				height: "50px",
				width: "100%"
			}
		};
	}

	createBars() {
		const max = _.max(this.props.data);
		const dataLength = this.props.data.length;
		let bars = null;
		const data = this.props.data.map((val) => {
			const res = {
				height: 0,
				count: 0,
				width: 100 / dataLength
			};
			try {
				res.height = (100 * val) / max;
				res.count = val;
				res.width = 100 / dataLength;
			} catch (e) {
				console.log(e);
			}
			return res;
		});
		if (dataLength) {
			bars = data.map((val, index) => (<Bar key={index} element={val} />));
		}
		return bars;
	}

	render() {
		const bars = this.createBars();
		return (
			<div className="rbc-bar-container col s12 col-xs-12" style={this.style.barContainer}>
				{bars}
			</div>
		);
	}
}

HistoGramComponent.propTypes = {
	data: PropTypes.array
};
