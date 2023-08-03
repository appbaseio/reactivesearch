import { css, keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import { lighten } from 'polished';
import Button from './Button';
import { TextArea } from './Input';

export const Chatbox = styled.div`
	position: relative;
	margin: 0 auto;
	padding: 10px;
	background-color: #fafafa;
	width: 100%;
	box-shadow: rgb(0 0 0 / 20%) 0px 0px 6px;
	border-radius: 6px;
	margin-bottom: 20px;
	background-color: ${props =>
	(props.theme && props.theme.colors ? props.theme.colors.backgroundColor : '#fff')};

	.--trigger-message-wrapper {
		cursor: pointer;
	}
`;
export const ChatContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	position: relative;
	.--ai-answer-error-container {
		text-align: center;
		position: absolute;
		bottom: 0px;
		${props => (props.showInput ? 'bottom: 48px;' : '')};
		z-index: 1;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;

		.--default-error-element {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 10px;
			background-color: ${props =>
	(props.theme && props.theme.colors && props.theme.colors.backgroundColor
		? props.theme.colors.backgroundColor
		: '#fff')};
			box-shadow: 0 -5px 5px -2px
				${props =>
			(props.theme && props.theme.colors && props.theme.colors.backgroundColor
				? props.theme.colors.backgroundColor
				: '#fff')};

			span {
				margin-bottom: 5px;
			}

			button {
			}
		}
	}

	${props =>
					(props.showInput
						? `.--ai-answer-feedback-container {
		margin-top: 15px;
		margin-bottom: -10px;
	}`
						: '')};
`;

export const MessagesContainer = styled.div`
	max-height: 400px;
    overflow-y: auto;
	padding: 10px;
	display: flex;
	flex-direction: column;
	min-height: 200px;
}};
`;
const typingDots = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-70%);
  }
  100% {
    transform: translateY(0);
  }
`;

export const TypingIndicator = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 5px !important;
`;

export const TypingDot = styled.div`
	width: 6px;
	height: 6px;
	background-color: ${(props) => {
	let finalColor;

	if (props.isSender) {
		finalColor
				= props.themePreset !== 'dark'
				? props.theme.colors.primaryTextColor
				: props.theme.colors.textColor;
	} else {
		finalColor
				= props.themePreset !== 'dark'
				? props.theme.colors.borderColor
				: props.theme.colors.textColor;
	}

	return finalColor;
}};
	border-radius: 50%;
	margin: 0 2px !important;
	animation: ${typingDots} 1s infinite;
	&:nth-child(2) {
		animation-delay: 0.2s;
	}
	&:nth-child(3) {
		animation-delay: 0.4s;
	}
`;

export const resetCSS = props => css`
	html,
	body,
	div,
	span,
	applet,
	object,
	iframe,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	p,
	blockquote,
	pre,
	a,
	abbr,
	acronym,
	address,
	big,
	cite,
	code,
	del,
	dfn,
	em,
	img,
	ins,
	kbd,
	q,
	s,
	samp,
	small,
	strike,
	strong,
	sub,
	sup,
	tt,
	var,
	b,
	u,
	i,
	center,
	dl,
	dt,
	dd,
	ol,
	ul,
	li,
	fieldset,
	form,
	label,
	legend,
	table,
	caption,
	tbody,
	tfoot,
	thead,
	tr,
	th,
	td,
	article,
	aside,
	canvas,
	details,
	embed,
	figure,
	figcaption,
	footer,
	header,
	hgroup,
	menu,
	nav,
	output,
	ruby,
	section,
	summary,
	time,
	mark,
	audio,
	video {
		margin: 0;
		padding: 0;
		border: 0;
		font-size: 100%;
		font: inherit;
		vertical-align: baseline;
	}
	pre {
		margin: 10px auto;
	}
	table {
		margin: 10px auto;
		border-collapse: collapse;
		border-spacing: 0;
	}
	tr {
		border-bottom: 1px solid #ccc;
	}
	th,
	td {
		text-align: left;
		padding: 4px;
		border: 1px solid;
		border-collapse: collapse;
	}
	pre,
	code {
		padding: 0.6em 0.4em;
		background: ${
	// eslint-disable-next-line no-nested-ternary
	props.isSender
		? props.themePreset !== 'dark'
			? props.theme.colors.primaryColor
			: props.theme.colors.borderColor
		: props.theme.colors.borderColor
	};
	}
	pre {
		color: ${
	// eslint-disable-next-line no-nested-ternary
	props.isSender
		? props.themePreset !== 'dark'
			? props.theme.colors.primaryTextColor
			: props.theme.colors.textColor
		: props.theme.colors.primaryTextColor
	};
		white-space: pre-wrap;
	}
	code {
		line-height: normal;
		color: ${
	// eslint-disable-next-line no-nested-ternary
	props.isSender
		? props.themePreset !== 'dark'
			? props.theme.colors.primaryTextColor
			: props.theme.colors.textColor
		: props.theme.colors.primaryTextColor
	};
		border-radius: 3px;
		font-size: 85%;
		padding: 0.2em 0.4em;
		margin-top: 5px;
		display: inline-block;
		overflow: auto;
		width: fit-content;
		max-width: 100%;
	}

	code[class*='language-'],
	pre[class*='language-'] {
		color: ${
	// eslint-disable-next-line no-nested-ternary
	props.isSender
		? props.themePreset !== 'dark'
			? props.theme.colors.primaryTextColor
			: props.theme.colors.textColor
		: props.theme.colors.primaryTextColor
	};
		text-shadow: none;
	}
	ul,
	ol {
		padding-left: 1rem;
	}
	p {
		margin: 8px auto;
	}

	${
	// eslint-disable-next-line no-nested-ternary
	props.themePreset === 'dark'
	&& `a{
	color: cornflowerblue
	}
		`
	};
`;

const messageBGColor = (props) => {
	let finalBGColor;
	if (props.isSender) {
		finalBGColor
			= props.themePreset !== 'dark'
				? props.theme.colors.primaryColor
				: lighten(0.1, props.theme.colors.backgroundColor);
	} else {
		finalBGColor
			= props.themePreset !== 'dark'
				? lighten(0.53, props.theme.colors.borderColor)
				: props.theme.colors.backgroundColor;
	}
	return finalBGColor;
};
export const Message = styled.div`
	background-color: ${props => messageBGColor(props)};
	color: ${(props) => {
	let finalColor;

	if (props.isSender) {
		finalColor
				= props.themePreset !== 'dark'
				? props.theme.colors.primaryTextColor
				: props.theme.colors.textColor;
	} else {
		finalColor
				= props.themePreset !== 'dark'
				? props.theme.colors.borderColor
				: props.theme.colors.textColor;
	}

	return finalColor;
}};
	border: 1px solid
		${props => (props.themePreset === 'dark' ? 'currentColor' : messageBGColor(props))};
	padding: 10px;
	border-radius: 7px;
	margin-bottom: 10px;
	max-width: 80%;
	align-self: ${props => (props.isSender ? 'flex-end' : 'flex-start')};
	display: inline-block;
	position: relative;

	${props => resetCSS(props)}
	overflow-wrap: anywhere;
`;

export const MessageInputContainer = styled.form`
	display: flex;
	padding-top: 12px;
	align-items: stretch;
	margin-top: 10px;

	.ai-enter-button-wrapper {
		align-self: baseline;
		height: 41px;
	}
`;

export const MessageInput = styled(TextArea)`
	width: 100%;
	border-radius: 5px;
	border: 1px solid #ccc;
	color: ${props => props.theme.colors.textColor};

	::placeholder {
		color: ${props => props.theme.colors.textColor};
	}

	:-ms-input-placeholder {
		color: ${props => props.theme.colors.textColor};
	}

	::-ms-input-placeholder {
		color: ${props => props.theme.colors.textColor};
	}

	${({ enterButton }) =>
	enterButton
		&& `
		    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
	`}

	&:disabled {
		cursor: not-allowed;
	}
`;

export const SendButton = styled(Button)`
	border: none;
	color: #ffffff;
	cursor: pointer;
	font-size: 16px;
	margin-left: 8px;
	outline: none;
	padding: 10px;
	text-align: center;

	${({ disabled }) => disabled && 'cursor: not-allowed;'}
`;

export const AIFeedbackContainer = styled.div`
	.--feedback-svgs-wrapper {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 5px;

		svg {
			cursor: pointer;
			transition: all ease-in 0.1s;
			&.selected {
				transform: scale(1.1);
				cursor: default;
			}

			&:hover {
				transform: scale(1.1);
			}
		}
	}

	.--feedback-input-wrapper {
		display: flex;
		gap: 7px;
	}
`;
