import React from 'react';

import types from '@appbaseio/reactivecore/lib/utils/types';
import PropTypes from 'prop-types';
import xss from 'xss';
import {
	getClassName,
	hasCustomRenderer,
	getComponent as getComponentUtilFunc,
} from '@appbaseio/reactivecore/lib/utils/helper';
import { AI_ROLES } from '@appbaseio/reactivecore/lib/utils/constants';
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
		if (props.isAIResponseLoading) {
			return;
		}
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
			renderMic, getMicInstance, showVoiceInput, iconPosition, innerClass,
		} = props;
		return (
			<div>
				<IconGroup groupPosition="right" positionType="absolute">
					{shouldMicRender(showVoiceInput) && (
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

	const onEnterButtonClick = (e) => {
		handleSendMessage(e);
	};

	const renderEnterButtonFunc = () => {
		const { enterButton, renderEnterButton } = props;
		if (enterButton) {
			const getEnterButtonMarkup = () => {
				if (typeof renderEnterButton === 'function') {
					return renderEnterButton(onEnterButtonClick);
				}

				return (
					<SendButton
						primary
						type="submit"
						tabIndex={0}
						onClick={onEnterButtonClick}
						onKeyPress={handleKeyPress}
						className={`enter-btn ${getClassName(props.innerClass, 'ai-enter-button')}`}
					>
						Send
					</SendButton>
				);
			};

			return <div className="ai-enter-button-wrapper">{getEnterButtonMarkup()}</div>;
		}

		return null;
	};

	const getComponent = () => {
		const { AIResponseError, isAIResponseLoading, rawData } = props;

		const data = {
			error: AIResponseError,
			loading: isAIResponseLoading,
			data: messages,
			rawData,
		};
		return getComponentUtilFunc(data, props);
	};
	React.useEffect(() => {
		if (messagesContainerRef.current) {
			messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<ChatContainer>
			{/* custom render */}
			{hasCustomRenderer(props) && getComponent()}
			{/* Default render */}
			{!hasCustomRenderer(props) && (
				<MessagesContainer ref={messagesContainerRef}>
					{messages.map((message, index) => (
						<Message
							// eslint-disable-next-line react/no-array-index-key
							key={index}
							isSender={message.role === AI_ROLES.USER}
							dangerouslySetInnerHTML={{
								__html: xss(message.content),
							}}
						/>
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
			)}
			{props.showInput && (
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
								disabled={props.isAIResponseLoading}
							/>{' '}
							{renderIcons()}
						</InputWrapper>
					</InputGroup>
					{renderEnterButtonFunc()}
				</MessageInputContainer>
			)}{' '}
		</ChatContainer>
	);
};

Chat.propTypes = {
	messages: PropTypes.arrayOf(
		PropTypes.shape({
			content: PropTypes.string.isRequired,
			role: PropTypes.bool.isRequired,
		}),
	).isRequired,
	onSendMessage: PropTypes.func.isRequired,
	componentId: PropTypes.string.isRequired,
	showIcon: PropTypes.bool,
	iconPosition: types.iconPosition,
	themePreset: types.themePreset,
	icon: types.children,
	iconURL: types.string,
	showVoiceInput: types.bool,
	renderMic: types.func,
	getMicInstance: types.func,
	innerClass: types.style,
	placeholder: types.string,
	AIResponse: types.componentObject,
	isAIResponseLoading: types.bool,
	AIResponseError: types.componentObject,
	enterButton: types.bool,
	renderEnterButton: types.title,
	showInput: types.bool,
	render: types.func,
	rawData: types.rawData,
};

export default Chat;
