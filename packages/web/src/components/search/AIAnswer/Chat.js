import React from 'react';

import types from '@appbaseio/reactivecore/lib/utils/types';
import PropTypes from 'prop-types';
import xss from 'xss';
import { getClassName } from '@appbaseio/reactivecore/lib/utils/helper';
import {
	ChatContainer,
	Message,
	MessageInput,
	MessageInputContainer,
	MessagesContainer,
	SendButton,
	TypingDot,
	TypingIndicator,
} from '../../../styles/AIAnswer';
import InputWrapper from '../../../styles/InputWrapper';
import InputGroup from '../../../styles/InputGroup';
import SearchSvg from '../../shared/SearchSvg';
import IconGroup from '../../../styles/IconGroup';
import IconWrapper from '../../../styles/IconWrapper';
import Mic from '../addons/Mic';

const Chat = (props) => {
	const { messages, onSendMessage } = props;
	const [inputMessage, setInputMessage] = React.useState('');
	const messagesContainerRef = React.useRef(null);

	const handleMessageInputChange = (e) => {
		setInputMessage(e.target.value);
	};

	const handleSendMessage = (e) => {
		e.preventDefault();
		if (inputMessage.trim()) {
			onSendMessage(inputMessage);
			setInputMessage('');
		}
	};
	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleSendMessage(e);
		}
	};
	const renderIcon = () => {
		if (props.showIcon) {
			if (props.icon) {
				return props.icon;
			}
			if (props.iconURL) {
				return (
					<img style={{ maxHeight: '25px' }} src={xss(props.iconURL)} alt="search-icon" />
				);
			}
			return <SearchSvg />;
		}
		return null;
	};

	const handleVoiceResults = ({ results }) => {
		if (
			results
			&& results[0]
			&& results[0].isFinal
			&& results[0][0]
			&& results[0][0].transcript
			&& results[0][0].transcript.trim()
		) {
			onSendMessage(results[0][0].transcript.trim());
			setInputMessage('');
		}
	};
	const shouldMicRender = (showVoiceSearch) => {
		// checks for SSR
		if (typeof window === 'undefined') return false;
		return showVoiceSearch && (window.webkitSpeechRecognition || window.SpeechRecognition);
	};
	const renderIcons = () => {
		const {
			renderMic, getMicInstance, enableVoiceInput, iconPosition, innerClass,
		} = props;
		return (
			<div>
				<IconGroup groupPosition="right" positionType="absolute">
					{shouldMicRender(enableVoiceInput) && (
						<Mic
							getInstance={getMicInstance}
							render={renderMic}
							onResult={handleVoiceResults}
							className={getClassName(innerClass, 'ai-search-mic') || null}
						/>
					)}
					{iconPosition === 'right' && <IconWrapper>{renderIcon()}</IconWrapper>}
				</IconGroup>

				<IconGroup groupPosition="left" positionType="absolute">
					{iconPosition === 'left' && <IconWrapper>{renderIcon()}</IconWrapper>}
				</IconGroup>
			</div>
		);
	};
	React.useEffect(() => {
		if (messagesContainerRef.current) {
			messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<ChatContainer>
			<MessagesContainer ref={messagesContainerRef}>
				{messages.map((message, index) => (
					// eslint-disable-next-line react/no-array-index-key
					<Message key={index} isSender={message.isSender}>
						{message.text}
					</Message>
				))}
				{props.isAIResponseLoading && (
					<Message>
						<TypingIndicator>
							<TypingDot />
							<TypingDot />
							<TypingDot />
						</TypingIndicator>
					</Message>
				)}
			</MessagesContainer>
			<MessageInputContainer onSubmit={handleSendMessage}>
				<InputGroup isOpen={false}>
					<InputWrapper>
						<MessageInput
							type="text"
							placeholder={props.placeholder}
							value={inputMessage}
							onChange={handleMessageInputChange}
							onKeyPress={handleKeyPress}
							id={`${props.componentId}-ai-input`}
							showIcon={props.showIcon}
							iconPosition={props.iconPosition}
							themePreset={props.themePreset}
						/>{' '}
						{renderIcons()}
					</InputWrapper>
				</InputGroup>
				<SendButton primary type="submit">
					Send
				</SendButton>
			</MessageInputContainer>{' '}
		</ChatContainer>
	);
};

Chat.propTypes = {
	messages: PropTypes.arrayOf(
		PropTypes.shape({
			text: PropTypes.string.isRequired,
			isSender: PropTypes.bool.isRequired,
		}),
	).isRequired,
	onSendMessage: PropTypes.func.isRequired,
	componentId: PropTypes.string.isRequired,
	showIcon: PropTypes.bool,
	iconPosition: types.iconPosition,
	themePreset: types.themePreset,
	icon: types.children,
	iconURL: types.string,
	enableVoiceInput: types.bool,
	renderMic: types.func,
	getMicInstance: types.func,
	innerClass: types.style,
	placeholder: types.string,
	AIResponse: types.componentObject,
	isAIResponseLoading: types.bool,
	AIResponseError: types.componentObject,
};

export default Chat;
