import React from "react";
import PropTypes from "prop-types";

export default function Bar(props) {
	const style = {
		display: "block",
		width: "100%",
		height: "100%"
	};

	const wrapperStyle = {
		height: `${props.element.height}%`,
		width: `${props.element.width}%`,
		display: "inline-block",
		background: "#efefef",
		position: "relative"
	};

	return (
		<span className="rbc-bar-item" style={wrapperStyle} >
			<span
				className="bar" style={style}
				title={props.element.count}
			/>
		</span>
	);
}

Bar.propTypes = {
	element: PropTypes.shape({
		width: PropTypes.number,
		height: PropTypes.number,
		count: PropTypes.number
	})
};
