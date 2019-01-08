import { css } from 'emotion';
import styled from 'vue-emotion';
import { lighten } from 'polished';

const item = {
	width: '15px',
	height: '15px',
	scale: '4px'
};

const vh = css`
	border: 0;
	clip: rect(1px, 1px, 1px, 1px);
	clip-path: inset(50%);
	height: 1px;
	overflow: hidden;
	padding: 0;
	position: absolute;
	width: 1px;
	white-space: nowrap;
`;

const hideInputControl = css`
	+ label {
		padding-left: 0;

		&::before,
		&::after {
			width: 0;
			height: 0;
			border: 0;
			margin: 0;
			visibility: hidden;
		}
	}

	&:checked {
		+ label {
			font-weight: bold;
		}
	}
`;

const formItem = ({ theme }) => css`
	${vh};

	&:focus {
		+ label {
			&::before {
				box-shadow: 0 0 0 2px ${lighten(0.4, theme.colors.primaryColor)};
			}
		}
	}

	&:hover {
		+ label {
			&::before {
				border-color: ${theme.colors.primaryColor};
			}
		}
	}

	&:active {
		+ label {
			&::before {
				transition-duration: 0;
			}
		}
	}

	+ label {
		position: relative;
		user-select: none;
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
		cursor: pointer;

		&::before {
			background-color: #fff;
			border: 1px solid
				${theme.colors.borderColor || lighten(0.1, theme.colors.textColor)};
			box-sizing: content-box;
			content: '';
			color: ${theme.colors.primaryColor};
			margin-right: calc(${item.width} * 0.5);
			top: 50%;
			left: 0;
			width: ${item.width};
			height: ${item.height};
			display: inline-block;
			vertical-align: middle;
		}

		&::after {
			box-sizing: content-box;
			content: '';
			background-color: ${theme.colors.primaryColor};
			position: absolute;
			top: 50%;
			left: calc(1px + ${item.scale} / 2);
			width: calc(${item.width} - ${item.scale});
			height: calc(${item.height} - ${item.scale});
			margin-top: calc(${item.height} / -2 - ${item.scale} / -2);
			transform: scale(0);
			transform-origin: 50%;
			transition: transform 200ms ease-out;
		}
	}
`;

const Radio = styled('input')`
	${formItem};
	${props => (props.show ? null : hideInputControl)};

	+ label {
		&::before,
		&::after {
			border-radius: 50%;
		}
	}

	&:checked {
		&:active,
		&:focus {
			+ label {
				color: ${({ theme }) => theme.colors.primaryColor};

				&::before {
					animation: none;
					filter: none;
					transition: none;
				}
			}
		}

		+ label {
			&::before {
				animation: none;
				background-color: #fff;
				border-color: ${({ theme }) => theme.colors.primaryColor};
		}

		&::after {
			transform: scale(1);
		}
	}
`;

const Checkbox = styled('input')`
	${formItem};
	${props => (props.show ? null : hideInputControl)};

	+ label {
		&::before,
		&::after {
			border-radius: 0;
		}

		&::after {
			background-color: transparent;
			top: 50%;
			left: calc(1px + ${item.width} / 5);
			width: calc(${item.width} / 2);
			height: calc(${item.width} / 5);
			margin-top: calc(${item.height} / -2 / 2 * 0.8);
			border-style: solid;
			border-color: ${({ theme }) => theme.colors.primaryColor};
			border-width: 0 0 2px 2px;
			border-radius: 0;
			border-image: none;
			transform: rotate(-45deg) scale(0);
			transition: none;
		}
	}

	&:checked {
		+ label {
			&::before {
				border-color: ${({ theme }) => theme.colors.primaryColor};
			}

			&::after {
				content: '';
				transform: rotate(-45deg) scale(1);
				transition: transform 200ms ease-out;
			}
		}
	}
`;

const UL = styled('ul')`
	list-style: none;
	padding: 0;
	margin: 0;
	max-height: 240px;
	position: relative;
	overflow-y: auto;
	padding-bottom: 12px;

	li {
		height 30px;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-left: 2px;
	}
`;

export { UL, Radio, Checkbox };
