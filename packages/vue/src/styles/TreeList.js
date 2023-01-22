import { styled } from '@appbaseio/vue-emotion';

export const HierarchicalMenuList = styled('ul')`
	list-style: none;
	padding: 0;
	margin: 0;
	max-height: 0;
	overflow: hidden;

	&.--open {
		max-height: 100%;
	}
`;

export const HierarchicalMenuListItem = styled('li')`
	font-weight: 400;
	line-height: 1.5;
	box-sizing: border-box;

	a {
		color: #424242;
		text-decoration: none;
		gap: 5px;
		.--leaf-icon,
		.--folder-icon {
			line-height: 15px;
			svg {
				height: 15px;
			}
		}

		input {
			margin: 0;
			cursor: pointer;
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
			border-left: 1px solid #787878;
			width: 0;
			left: 19px;
			${(props) =>
		!props.showLine
				&& `
					display: none;
				`};
		}

		&.--show-switcher-icon {
			padding-left: 36px;
		}
	}
	.--list-item-label {
		line-height: 100%;
	}
	.--list-item-count {
		margin-left: 10px;
		padding: 0.1rem 0.4rem;
		font-size: 0.8rem;
		color: #424242;
		background-color: #dee1e6;
		border-radius: 8px;
	}
	&.-selected-item {
		font-weight: 700 !important;
	}
	&.-expanded-item {
		& > a {
			& div > .--switcher-icon {
				transform: rotate(90deg);
			}
		}
	}
	.--list-item-label-count-wrapper {
		display: flex;
		align-items: center;
		&:hover {
			.--list-item-count,
			.--list-item-label {
				font-weight: 700;
			}
		}
	}
`;
