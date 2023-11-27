import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Flex from './Flex';

const alertBorder = ({ theme }) => `
	border: 1px solid ${theme.colors.alertColor};
`;

const input = searchBox => `
width: 100%;
line-height: 1.5;
min-height: 42px;
padding: 8px 12px;
border: 1px solid #ccc;
background-color: #fafafa;
font-size: 0.9rem;
outline: none;
&:focus {
	background-color: #fff;
}
${
	searchBox
	&& `
	padding: 8px 12px 9px;
	border: 1px solid transparent;
	border-radius: 6px;
	min-height: unset;
`
};
`;

const dark = theme => `
	border-color: ${theme.colors.borderColor};
`;

const darkInput = ({ theme }) => `
	background-color: ${theme.colors.backgroundColor};
	color: ${theme.colors.textColor};
	${dark(theme)};

	&:focus {
		background-color: ${theme.colors.backgroundColor};
	}

`;

const Input = styled('input')`
	${props => input(props.searchBox)};
	${({ themePreset }) => themePreset === 'dark' && darkInput};

	${props =>
	props.showIcon
		&& props.iconPosition === 'left'
		&& `
			padding-left: 36px;
		`};

	${props =>
			props.showIcon
		&& props.iconPosition === 'right'
		&& `
			padding-right: 36px;
		`};

	${props =>
		// for clear icon
			props.showClear
		&& `
			padding-right: 36px;
		`};
	${props =>
		// for voice search icon
			props.showVoiceSearch
		&& `
			padding-right: 36px;
		`};
	${props =>
		// for clear icon with search icon
			props.showClear
		&& props.showIcon
		&& props.iconPosition === 'right'
		&& `
			padding-right: 66px;
		`};
	${props =>
		// for voice search icon with clear icon
			props.showVoiceSearch
		&& props.showIcon
		&& `
			padding-right: 66px;
		`};
	${props =>
		// for voice search icon with search icon
			props.showVoiceSearch
		&& props.showIcon
		&& props.iconPosition === 'right'
		&& `
			padding-right: 66px;
		`};
	${props =>
		// for clear icon with search icon and voice search
			props.showClear
		&& props.showIcon
		&& props.showVoiceSearch
		&& props.iconPosition === 'right'
		&& `
			padding-right: 90px;
		`};

	${props => props.alert && alertBorder};

	${props =>
			props.isOpen
		&& `
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
		`};

	&[type='search']::-webkit-search-decoration,
	&[type='search']::-webkit-search-cancel-button,
	&[type='search']::-webkit-search-results-button,
	&[type='search']::-webkit-search-results-decoration {
		display: none;
	}
`;
const noSuggestions = (themePreset, theme) => css`
	display: block;
	width: 100%;
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
	border-radius: 6px;
	border-top-left-radius: 0;
	border-top-right-radius: 0;
	box-shadow: rgb(0 0 0 / 20%) 0px 10px 15px;
	border-top: 1px solid #f2f0f0;

	&.small {
		top: 30px;
	}

	li {
		display: flex;
		justify-content: space-between;
		padding: 10px;
		user-select: none;

		& > .trim {
			display: -webkit-box;
			display: block;
			width: 100%;
			max-height: 2.3rem;
			line-height: 1.2rem;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	${themePreset === 'dark' && theme && dark(theme)}
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
	max-height: min(100vh, 402px);
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
		width: 100%;
		overflow: hidden;

		&:hover,
		&:focus {
			background-color: #eee;
		}
	}

	${themePreset === 'dark' && theme && dark(theme)};
`;

const TrimmedText = styled.div`
	display: -webkit-box;
	width: 100%;
	-webkit-line-clamp: ${props => props.lines || 2};
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const searchboxSuggestions = (themePreset, theme) => css`
	${suggestions(themePreset, theme)};

	max-height: min(100vh, 401px);
	border: none;
	border-radius: 6px;
	border-top-left-radius: 0;
	border-top-right-radius: 0;
	box-shadow: rgb(0 0 0 / 20%) 0px 10px 15px;
	border-top: 1px solid #f2f0f0;
	li {
		transition: all 0.3s ease-in;
		position: relative;
		&:hover,
		&:focus {
			background-color: unset;
		}
		.trim {
			line-height: 20px;
		}
		&.li-item {
			background-color: ${themePreset === 'dark' ? '#424242' : '#fff'};

			${themePreset
			&& theme
			&& `svg {
				fill: ${theme.colors ? theme.colors.primaryColor : '#707070'};
			}`}
		}
		&.active-li-item {
			background-color: ${themePreset === 'dark' ? '#555' : '#2d84f6'};
			color: #fff;
			svg {
				transition: fill 0.3s ease-in;
				fill: #fff !important;
			}
		}
	}

	.section-container {
		padding-bottom: 5px;
		border-bottom: 1px solid #f2f0f0;
		${themePreset === 'dark'
		&& css`
			background: #424242;
		`};
		.section-header {
			padding: 10px;
			font-size: 12px;
			color: #7f7c7c;
			background: #f9f9f9;
			${themePreset === 'dark'
			&& css`
				color: #218fe7;
				background: #161616;
			`};
		}

		.section-list {
			padding-left: 0;
		}
	}
`;
const Suggestion = styled(Flex)`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	width: 100%;
`;

const SuggestionDescription = styled(TrimmedText)`
	overflow: hidden;
	text-overflow: ellipsis;
	margin-top: 5px;
	opacity: 0.7;
	font-size: 12px;
`;

const suggestionsContainer = css`
	position: relative;
	.cancel-icon {
		cursor: pointer;
	}
`;

const TextArea = styled('textarea')`
	${props => input(props.searchBox)};
	${({ themePreset, theme }) => themePreset === 'dark' && darkInput({ theme })};

	${props => props.alert && alertBorder};
	${props => (props.isOpen
		&& `
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
		`)};
	&::-webkit-search-decoration,
	&::-webkit-search-cancel-button,
	&::-webkit-search-results-button,
	&::-webkit-search-results-decoration {
		display: none;
	}
	resize: none;
	overflow: hidden;
	height: 42px;
	padding-left: 0;
	padding-right: 0;
	border-color: transparent;
`;

const Actions = styled('div')`
	display: flex;
`;

export default Input;
export {
	suggestionsContainer,
	suggestions,
	input,
	noSuggestions,
	searchboxSuggestions,
	TextArea,
	Actions,
	TrimmedText,
	Suggestion,
	SuggestionDescription,
};
