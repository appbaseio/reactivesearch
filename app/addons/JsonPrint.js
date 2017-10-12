import React, { Component } from "react";

export default class JsonPrint extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		};
	}

	render() {
		let tree = null;
		if (this.state.open) {
			tree = JSON.stringify(this.props.data, null, 2);
		} else {
			tree = JSON.stringify(this.props.data);
		}
		return (
			<div className="row rbc-json-print">
				<span
					className={`head ${this.state.open ? null : "collapsed"}`}
					onClick={() => this.setState({ open: !this.state.open })}
				>Object</span>
				<pre>{tree}</pre>
			</div>
		);
	}
}
