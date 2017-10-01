import React, { Component } from "react";
import PropTypes from 'prop-types';

export default class ViewSwitcher extends Component {
	constructor(props) {
		super(props);

		this.state = {
			active: this.props.defaultSelected || this.props.data[0].value
		};
	}

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
					this.setState({
						active: item.value
					});
					document.querySelector("." + item.value).style.display = "block";
				} else {
					document.querySelector("." + item.value).style.display = "none";
				}
			}
		});
	}

	renderItems() {
		return this.props.data.map((item) => {
			let cx = "";

			if (item.value === this.state.active) {
				cx = "active";
			}

			return (
				<div key={item.value} className={`rbc-list-item ${cx}`} onClick={() => this.switchView(item.value)}>{item.label}</div>
			);
		});
	}

	render() {
		return (
			<div className="rbc rbc-viewswitcher" className={`${this.props.className ? this.props.className : ""}`} style={this.props.style}>
				<div className="rbc-list-container">
					{this.renderItems()}
				</div>
			</div>
		);
	}
}

ViewSwitcher.propTypes = {
	style: PropTypes.object,
	className: PropTypes.string
};

ViewSwitcher.defaultProps = {
	style: {}
};
