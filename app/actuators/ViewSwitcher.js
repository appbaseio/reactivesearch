import React, { Component } from "react";

export default class ViewSwitcher extends Component {
	componentDidMount() {
		this.switchView(this.props.defaultSelected);
	}

	componentWillReceiveProps(nextProps) {
		this.switchView(nextProps.defaultSelected);
	}

	switchView(element) {
		this.props.data.forEach((item) => {
			const el = document.querySelector("." + item.value);
			if (el) {
				if (element === item.value) {
					document.querySelector("." + item.value).style.display = "block";
				} else {
					document.querySelector("." + item.value).style.display = "none";
				}
			}
		});
	}

	renderItems() {
		return this.props.data.map(item => (
			<div key={item.value} className="rbc-list-item" onClick={() => this.switchView(item.value)}>{item.label}</div>
		));
	}

	render() {
		return (
			<div className="rbc rbc-viewswitcher">
				<div className="rbc-list-container">
					{this.renderItems()}
				</div>
			</div>
		);
	}
}
