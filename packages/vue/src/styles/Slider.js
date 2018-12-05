
import styled from 'vue-emotion';

const Slider = styled('div')`
	margin-top: 30px;
	padding: 10px;

	.vue-slider-tooltip{
		background: #000;
		border-color: #000;
		padding: 4px 6px;
		color: #fff;
	}

	.vue-slider-tooltip::before{
		border-color: #000;
	}

	.vue-slider-component .vue-slider-dot{
		z-index: 2;
	}

	.vue-slider-component .vue-slider-tooltip-wrap{
		z-index: 2;
	}

	.vue-slider-component .vue-slider-dot .vue-slider-dot-handle{
		box-shadow: none;
		border: 1px solid #9a9a9a;
	}

	.vue-slider-component .vue-slider-process{
		background-color: #0b6aff;
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
