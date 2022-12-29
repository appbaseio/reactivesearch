import { styled } from '@appbaseio/vue-emotion';

export const TagsContainer = styled('div')`
	display: flex;
	flex-wrap: wrap;
	margin-top: 10px;
	width: 100%;
`;

export const TagItem = styled('span')`
	cursor: default;
	box-sizing: border-box;
	margin: 0 4px 4px 0;
	color: #000000d9;
	font-size: 14px;
	font-variant: tabular-nums;
	line-height: 1.5715;
	list-style: none;
	font-feature-settings: 'tnum';
	display: inline-block;
	height: auto;
	padding: 0 2px 0 7px;
	font-size: 12px;
	line-height: 22px;
	white-space: nowrap;
	background: #fafafa;
	border: 1px solid #d9d9d9;
	border-radius: 2px;
	opacity: 1;
	transition: all 0.3s;

	span.close-icon {
		svg {
			cursor: pointer;
			height: 15px;
			position: relative;
			top: 4px;
			fill: #262626;
		}
	}
`;
