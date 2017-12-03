import { css } from "emotion";
import styled from "react-emotion";

const primary = props => css`
	background-color: ${props.theme.primaryColor};
	border-color: ${props.theme.primaryColor};
`;

const Slider = styled("div")`
	.rheostat {
		overflow: visible;
		margin: 12px;
	}

	.rheostat-background {
		background-color: #fcfcfc;
		border: 1px solid #eee;
		position: relative;
	}

	.rheostat-progress {
		background-color: #d8d8d8;
		position: absolute;

		${props => props.primary && primary}
	}

	.rheostat-handle {
		border: 1px solid #d8d8d8;
		${props => props.primary && primary}
		background-color: #fff;
		border-radius: 50%;
		height: 24px;
		outline: none;
		z-index: 2;
		width: 24px;
		cursor: pointer;
	}

	.rheostat-horizontal {
		height: 24px;
	}

	.rheostat-horizontal .rheostat-background {
		height: 4px;
		background-color: #eee;
		top: 0px;
		width: 100%;
	}

	.rheostat-horizontal .rheostat-progress {
		height: 4px;
		top: 0;
	}

	.rheostat-horizontal .rheostat-handle {
		margin-left: -12px;
		top: -10px;
	}
`;

export default Slider;
