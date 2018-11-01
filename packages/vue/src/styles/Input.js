import { css } from 'emotion';
import styled from 'vue-emotion';

const alertBorder = ({ theme }) => css`
	border: 1px solid ${theme.colors.alertColor};
`;

const input = css`
	width: 100%;
	height: 42px;
	padding: 8px 12px;
	border: 1px solid #ccc;
	background-color: #fafafa;
	font-size: 0.9rem;
	outline: none;

	&:focus {
		background-color: #fff;
	}
`;

const dark = theme => css`
	border-color: ${theme.colors.borderColor};
`;

const darkInput = ({ theme }) => css`
	background-color: ${theme.colors.backgroundColor};
	color: ${theme.colors.textColor};
	${dark(theme)};

	&:focus {
		background-color: ${theme.colors.backgroundColor};
	}
`;

const Input = styled('input')`
	${input};
	${({ themePreset }) => themePreset === 'dark' && darkInput};

	${props =>
		props.showIcon
		&& props.iconPosition === 'left'
		&& css`
			padding-left: 32px;
		`};

	${props =>
		props.showIcon
		&& props.iconPosition === 'right'
		&& css`
			padding-right: 32px;
		`};

	${props =>
		// for clear icon
		props.showClear
		&& css`
			padding-right: 32px;
		`};

	${props =>
		// for clear icon with search icon
		props.showClear
		&& props.showIcon
		&& props.iconPosition === 'right'
		&& css`
			padding-right: 48px;
		`};

	${props => props.alert && alertBorder};
`;

const suggestions = (themePreset, theme) => css`
	display: block;
	width: 100%;
	border: 1px solid #ccc;
	background-color: #fff;
	font-size: 0.9rem;
	z-index: 3;
	position: absolute;
	top: 41px;
	margin: 0;
	padding: 0;
	list-style: none;
	max-height: 260px;
	overflow-y: auto;

	&.small {
		top: 30px;
	}

	li {
		display: flex;
		justify-content: space-between;
		cursor: pointer;
		padding: 10px;
		user-select: none;

		& > .trim {
			display: block;
			display: -webkit-box;
			width: 100%;
			max-height: 2.3rem;
			line-height: 1.2rem;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		&:hover,
		&:focus {
			background-color: #eee;
		}
	}

	${themePreset === 'dark' && dark(theme)};
`;

const suggestionsContainer = css`
	position: relative;
	.cancel-icon {
		cursor: pointer;
	}
`;

export default Input;
export { suggestionsContainer, suggestions, input };
