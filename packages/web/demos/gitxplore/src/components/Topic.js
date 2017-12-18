import React, { Component } from "react";
import PropTypes from "prop-types";

import StyledTopic from "../styles/Topic";

class Topic extends Component {
	handleClick = () => {
		this.props.toggleTopic(this.props.children);
	}
	render() {
		return (
			<StyledTopic active={this.props.active} onClick={this.handleClick}>
				#{this.props.children}
			</StyledTopic>
		);
	}
}

Topic.propTypes = {
	children: PropTypes.string,
	active: PropTypes.bool,
	toggleTopic: PropTypes.func
};

export default Topic;
