import styled from "react-emotion";

const SlopeWrapper = styled("div")`
	position: relative;
	padding: ${props => (props.small ? "0" : "180px 0")};
	margin-bottom: ${props => (props.small ? "0" : "150px")};
`;

const Slope = styled("div")`
	position: absolute;
	top: ${props => (props.degree ? (props.degree > 0 ? props.degree * -1 : props.degree) : -8)}vw;
	right: 0;
	bottom: 0;
	left: 0;
	overflow: hidden;
	transform: skewY(${props => (props.degree ? props.degree : -8)}deg);
	z-index: -1;
	background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

	${props =>
		props.border
			? `
		&:after {
			content: "";
			background: rgba(12,12,12,0.05);
			height: 50px;
			bottom: 0;
			left: 0;
			right: 0;
			position: absolute;
			-webkit-transform: skewY(0.5deg);
			-ms-transform: skewY(0.5deg);
			transform: skewY(0.5deg);
			-webkit-transform-origin: 0;
			-ms-transform-origin: 0;
			transform-origin: 0;
		}
	`
			: null};
`;

const WhiteBackdrop = styled("div")`
	height: calc((45vw));
	background-image: linear-gradient(90deg, rgba(12, 12, 12, 0.03), rgba(255, 255, 255, 0));
	position: absolute;
	left: 0;
	right: 0;
	transform: translate(0, 150px) skewY(${props => (props.degree ? props.degree : 8)}deg);
	z-index: -2;
`;

export { Slope, SlopeWrapper, WhiteBackdrop };
