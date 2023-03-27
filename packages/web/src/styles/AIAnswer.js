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
`;
export const ChatContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
`;

export const MessagesContainer = styled.div`
	max-height: 400px;
	overflow-y: scroll;
	padding: 10px;
	display: flex;
	flex-direction: column;
`;

export const Message = styled.div`
	background-color: ${props =>
	(props.isSender ? props.theme.colors.primaryColor : props.theme.colors.primaryTextColor)};
	padding: 10px;
	border-radius: 7px;
	margin-bottom: 10px;
	max-width: 80%;
	align-self: ${props => (props.isSender ? 'flex-end' : 'flex-start')};
	display: inline-block;
	border: 1px solid;
	color: ${props =>
		(props.isSender ? props.theme.colors.primaryTextColor : props.theme.colors.primaryColor)};
	position: relative;
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
	background-color: #333;
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
