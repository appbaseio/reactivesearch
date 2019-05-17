import styled from 'vue-emotion';

const Slider = styled('div')`
	margin-top: 30px;
	padding: 10px;

	/* component style */
	.vue-slider-disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* rail style */
	.vue-slider-rail {
		background-color: #ccc;
		border-radius: 15px;
		height: 4px;
	}

	/* process style */
	.vue-slider-process {
		background-color: #0b6aff;
		border-radius: 15px;
	}

	/* mark style */
	.vue-slider-mark {
		z-index: 4;
	}

	.vue-slider-mark:first-child .vue-slider-mark-step,
	.vue-slider-mark:last-child .vue-slider-mark-step {
		display: none;
	}

	.vue-slider-mark-step {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: rgba(0, 0, 0, 0.16);
	}

	.vue-slider-mark-label {
		font-size: 14px;
		white-space: nowrap;
	}

	/* dot style */
	.vue-slider-dot{
		z-index: 2;
	}

	.vue-slider-dot-handle {
		cursor: pointer;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: #fff;
		box-sizing: border-box;
		border: 1px solid #9a9a9a;
		z-index: 2;
	}

	.vue-slider-dot-handle-disabled {
		cursor: not-allowed;
		background-color: #ccc;
	}

	.vue-slider-dot-tooltip-inner {
		font-size: 14px;
		white-space: nowrap;
		padding: 2px 5px;
		min-width: 20px;
		text-align: center;
		color: #fff;
		border-radius: 5px;
		border-color: #000;
		background-color: #000;
		box-sizing: content-box;
	}

	.vue-slider-dot-tooltip-inner::after {
		content: "";
		position: absolute;
	}

	.vue-slider-dot-tooltip-inner-top::after {
		top: 100%;
		left: 50%;
		transform: translate(-50%, 0);
		height: 0;
		width: 0;
		border-color: transparent;
		border-style: solid;
		border-width: 5px;
		border-top-color: inherit;
	}

	.vue-slider-dot-tooltip-inner-bottom::after {
		bottom: 100%;
		left: 50%;
		transform: translate(-50%, 0);
		height: 0;
		width: 0;
		border-color: transparent;
		border-style: solid;
		border-width: 5px;
		border-bottom-color: inherit;
	}

	.vue-slider-dot-tooltip-inner-left::after {
		left: 100%;
		top: 50%;
		transform: translate(0, -50%);
		height: 0;
		width: 0;
		border-color: transparent;
		border-style: solid;
		border-width: 5px;
		border-left-color: inherit;
	}

	.vue-slider-dot-tooltip-inner-right::after {
		right: 100%;
		top: 50%;
		transform: translate(0, -50%);
		height: 0;
		width: 0;
		border-color: transparent;
		border-style: solid;
		border-width: 5px;
		border-right-color: inherit;
	}

	.vue-slider-dot-tooltip-wrapper {
		opacity: 0;
		transition: all 0.3s;
	}
	.vue-slider-dot-tooltip-wrapper-show {
		opacity: 1;
	}

	.label-container{
		margin: 10px 0;
		width: 100%;
	}

	.range-label-right{
		float: right;
	}
`;

export default Slider;
