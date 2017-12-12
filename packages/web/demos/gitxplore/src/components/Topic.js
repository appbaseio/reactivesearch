import React, { Component } from "react";
import PropTypes from "prop-types";

import StyledTopic from "../styles/Topic";

class Topic extends Component {
	render() {
		return (
			<StyledTopic>{this.props.children}</StyledTopic>
		);
	}
}

Topic.propTypes = {
	children: PropTypes.string
};

export default Topic;
