import { css } from 'emotion';
import styled from 'react-emotion';

const primary = props => css`
	background-color: ${props.theme.primaryColor};
`;

const Slider = styled('div')`
	.rheostat {
		overflow: visible;
		margin: 24px 12px;
	}

	.rheostat-progress {
		background-color: #d8d8d8;
		position: absolute;

		${props => props.primary && primary}
	}

	.rheostat-handle {
		border: 1px solid #9a9a9a;
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

	.rheostat-background {
		height: 4px;
		background-color: #c7c7c7;
		top: 0px;
		width: 100%;
		position: relative;
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
