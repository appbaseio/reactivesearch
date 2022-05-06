import { css } from '@emotion/core';
import styled from '@emotion/styled';

const alertBorder = ({ theme }) => css`
	border: 1px solid ${theme.colors.alertColor};
`;

const input = css`
	width: 100%;
	line-height: 1.5;
	min-height: 42px;
	padding: 8px 12px 9px;
	background-color: #fafafa;
	font-size: 0.9rem;
	outline: none;
	height: 100%;
	border: 1px solid transparent;
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
			padding-left: 36px;
		`};

	${props =>
			props.showIcon
		&& props.iconPosition === 'right'
		&& css`
			padding-right: 36px;
		`};

	${props =>
		// for clear icon
			props.showClear
		&& css`
			padding-right: 36px;
		`};
	${props =>
		// for voice search icon
			props.showVoiceSearch
		&& css`
			padding-right: 36px;
		`};
	${props =>
		// for clear icon with search icon
			props.showClear
		&& props.showIcon
		&& props.iconPosition === 'right'
		&& css`
			padding-right: 66px;
		`};
	${props =>
		// for voice search icon with clear icon
			props.showVoiceSearch
		&& props.showIcon
		&& css`
			padding-right: 66px;
		`};
	${props =>
		// for voice search icon with search icon
			props.showVoiceSearch
		&& props.showIcon
		&& props.iconPosition === 'right'
		&& css`
			padding-right: 66px;
		`};
	${props =>
		// for clear icon with search icon and voice search
			props.showClear
		&& props.showIcon
		&& props.showVoiceSearch
		&& props.iconPosition === 'right'
		&& css`
			padding-right: 90px;
		`};

	${props => props.alert && alertBorder};
`;
const noSuggestions = (themePreset, theme) => css`
	display: block;
	width: 100%;
	border: 1px solid #ccc;
	border-top: none;
	background-color: #fff;
	font-size: 0.9rem;
	z-index: 3;
	position: absolute;
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
	}

	${themePreset === 'dark' && dark(theme)}
`;

const suggestions = (themePreset, theme) => css`
	display: block;
	width: 100%;
	border: 1px solid #ccc;
	border-top: none;
	background-color: #fff;
	font-size: 0.9rem;
	z-index: 3;
	position: absolute;
	margin: 0;
	padding: 0;
	list-style: none;
	max-height: 375px;
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
		transition: background-color 0.4s ease-in;
		position: relative;
		.trim {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		&:after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100%;
			transform: scaleY(0);
			transform-origin: center;
			background-color: #2f84f7;
			z-index: -1;
			transition: transform 0.5s;
			transition-delay: 0.3s;
		}
		&:hover {
			&:after {
				transform: scaleY(1);
				transform-origin: center;
			}
		}
	}

	${themePreset === 'dark' && dark(theme)}
`;

const searchboxSuggestions = (themePreset, theme) => css`
	${suggestions(themePreset, theme)};

	max-height: min(100vh, 401px);
	border: none;
	border-radius: 6px;
	border-top-left-radius: 0;
	border-top-right-radius: 0;
	box-shadow: rgb(0 0 0 / 20%) 0px 10px 15px;

	li {
		.trim {
			line-height: 20px;
		}
	}

	.section-container {
		padding-bottom: 5px;
		border-bottom: 1px solid #f2f0f0;
		.section-header {
			padding: 10px;
			font-size: 12px;
			color: #7f7c7c;
			background: #f9f9f9;
			${themePreset === 'dark'
			&& css`
				color: #218fe7;
				background: #161616;
			`}
		}

		.section-list {
			padding-left: 0;
		}
		.section-list-item {
			&__label,
			&__description {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;

				* {
					margin: 0;
					padding: 0;
				}
			}

			&__label {
			}
			&__description {
				margin-top: 5px;
				opacity: 0.7;
				font-size: 12px;
			}
		}
	}
`;
const suggestionsContainer = css`
	position: relative;
	.cancel-icon {
		cursor: pointer;
	}
`;

export default Input;
export { suggestionsContainer, suggestions, input, noSuggestions, searchboxSuggestions };
