import { css } from '@emotion/core';
import styled from '@emotion/styled';

export const HierarchicalMenuList = styled('ul')`
	list-style: none;
	padding: 0;
	margin: 0;
	position: relative;
	overflow-y: auto;

	${props =>
	props.isSelected === false
		&& css`
			max-height: 0;
		`};
`;

export const HierarchicalMenuListItem = styled('li')`
	font-weight: 400;
	line-height: 1.5;
	box-sizing: border-box;

	a {
		text-decoration: none;
		gap: 5px;
		.--leaf-icon,
		.--folder-icon {
			line-height: 15px;
			svg {
				height: 15px;
			}
		}
	}

	.--switcher-icon {
		transition: all 0.2s ease-in;
		margin-right: 2px;
	}
	.--list-child {
		padding-left: 1rem;
		position: relative;
		&:before {
			height: 100%;
			content: '';
			position: absolute;
			border-left: 1px solid #1a73e840;
			width: 0;
			left: 19px;
			${props =>
	!props.showLine
				&& css`
					display: none;
				`};
		}
	}
	.--list-item-label {
	}
	.--list-item-count {
		margin-left: 10px;
		padding: 0.1rem 0.4rem;
		font-size: 0.8rem;
		color: #3a4570;
		background-color: #dfe2ee;
		border-radius: 8px;
	}
	&.-selected-item {
		font-weight: 700;

		& > a {
			& > .--switcher-icon {
				transform: rotate(90deg);
			}
		}
	}
`;
