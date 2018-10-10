import { css } from 'emotion';
import styled from 'react-emotion';

const primary = ({ theme }) => css`
	background-color: ${theme.colors.primaryColor};
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

	.slider-tooltip,.slider-tooltip-focus,.slider-tooltip-visible {
    visibility: hidden;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 6px 8px;
    position: absolute;
    z-index: 1;
		transform: translate(-50%,-170%); /* Positions Tooltip Container */
	}

	.slider-tooltip-visible {
		visibility: visible;
	}

	.slider-tooltip:after,.slider-tooltip-focus:after,.slider-tooltip-visible:after{
		content: '';
    position: absolute;
    top: 98%; /* Positions Tooltip Arrow */
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
	}

	.rheostat-handle:hover .slider-tooltip,
	.rheostat-handle:focus .slider-tooltip,
	.rheostat-handle:active .slider-tooltip {
    visibility: visible;
	}

	.rheostat-handle:hover .slider-tooltip-focus,{
    visibility: hidden;
	}

	.rheostat-handle:focus .slider-tooltip-focus,
	.rheostat-handle:active .slider-tooltip-focus {
		visibility: visible;
	}

	${({ theme }) => theme.component};
`;

export default Slider;
