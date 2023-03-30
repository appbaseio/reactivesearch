import { keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import Button from './Button';
import Input from './Input';

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
`;
export const ChatContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;

	.--ai-answer-error-container {
		text-align: center;
	}
`;

export const MessagesContainer = styled.div`
	max-height: 400px;
    overflow-y: auto;
	padding: 10px;
	display: flex;
	flex-direction: column;
	min-height: 100px;

}};
`;

export const Message = styled.div`
	background-color: ${props =>
// eslint-disable-next-line no-nested-ternary
	(!props.isSender
		? props.themePreset !== 'dark'
			? props.theme.colors.primaryColor
			: props.theme.colors.borderColor
		: props.theme.colors.backgroundColor)};

	padding: 10px;
	border-radius: 7px;
	margin-bottom: 10px;
	max-width: 80%;
	align-self: ${props => (props.isSender ? 'flex-end' : 'flex-start')};
	display: inline-block;
	border: 1px solid;
	color: ${props =>
		// eslint-disable-next-line no-nested-ternary
			(!props.isSender
				? props.themePreset !== 'dark'
					? props.theme.colors.primaryTextColor
					: props.theme.colors.textColor
				: props.theme.colors.textColor)};
	position: relative;
	white-space: pre-wrap;
`;

export const MessageInputContainer = styled.form`
	display: flex;
	padding-top: 12px;
	align-items: stretch;
	margin-top: 10px;
`;

export const MessageInput = styled(Input)`
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
	margin: 5px;
`;

export const TypingDot = styled.div`
	width: 6px;
	height: 6px;
	background-color: ${props =>
	(props.themePreset !== 'dark'
		? props.theme.colors.primaryTextColor
		: props.theme.colors.textColor)};
	border-radius: 50%;
	margin: 0 2px;
	animation: ${typingDots} 1s infinite;
	&:nth-child(2) {
		animation-delay: 0.2s;
	}
	&:nth-child(3) {
		animation-delay: 0.4s;
	}
`;
