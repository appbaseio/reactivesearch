import React, { useRef, useState } from 'react';

import types from '@appbaseio/reactivecore/lib/utils/types';
import PropTypes from 'prop-types';
import xss from 'xss';
import {
	getClassName,
	hasCustomRenderer,
	getComponent as getComponentUtilFunc,
	isFunction,
	getObjectFromLocalStorage,
} from '@appbaseio/reactivecore/lib/utils/helper';
import { Remarkable } from 'remarkable';
import { AI_LOCAL_CACHE_KEY, AI_ROLES } from '@appbaseio/reactivecore/lib/utils/constants';
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
import Button from '../../../styles/Button';
import AIFeedback from '../../shared/AIFeedback';
import { Footer, SourceTags } from '../../../styles/SearchBoxAI';

const md = new Remarkable();

md.set({
	html: true,
	breaks: true,
	xhtmlOut: true,
	linkify: true,
	linkTarget: '_blank',
});

const Chat = (props) => {
	const { messages, onSendMessage } = props;
	const [inputMessage, setInputMessage] = React.useState('');
	const [sourceDocIds, setSourceDocIds] = useState(null);
	const [initialHits, setInitialHits] = useState(null);
	const messagesContainerRef = React.useRef(null);
	const _inputRef = useRef(null);
	const _inputWrapper = useRef(null);
	const _errorWrapper = useRef(null);

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
			renderMic, getMicInstance, showVoiceInput, iconPosition, innerClass,
		} = props;
		return (
			<div>
				<IconGroup enableAI groupPosition="right" positionType="absolute">
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

				<IconGroup enableAI groupPosition="left" positionType="absolute">
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
	const handleRetryRequest = () => {
		if (messages) {
			const lastUserRequestMessage
				= messages[messages.length - 1] && messages[messages.length - 1].content;

			onSendMessage(lastUserRequestMessage, true);
		}
	};

	const renderErrorEle = () => {
		const { AIResponseError, renderError, isAIResponseLoading } = props;
		if (AIResponseError && !isAIResponseLoading) {
			if (renderError) {
				return (
					<div
						className={`--ai-answer-error-container ${
							getClassName(props.innerClass, 'ai-error') || ''
						}`}
						ref={_errorWrapper}
					>
						{isFunction(renderError)
							? renderError(AIResponseError, handleRetryRequest)
							: renderError}
					</div>
				);
			}
			return (
				<div
					ref={_errorWrapper}
					className={`--ai-answer-error-container ${
						getClassName(props.innerClass, 'ai-error') || ''
					}`}
				>
					<div className="--default-error-element">
						<span>
							{AIResponseError.message
								? AIResponseError.message
								: 'There was an error in generating the response.'}{' '}
							{AIResponseError.code
								? `Code:
							${AIResponseError.code}`
								: ''}
						</span>
						{props.showRetryButton && (
							<Button primary onClick={handleRetryRequest}>
								Try again
							</Button>
						)}
					</div>
				</div>
			);
		}
		return null;
	};

	const handleTextAreaHeightChange = () => {
		const textArea = _inputRef.current;
		if (textArea) {
			textArea.style.height = '42px';
			const lineHeight = parseInt(getComputedStyle(textArea).lineHeight, 10);
			const maxHeight = lineHeight * 11; // max height for 3 lines
			const height = Math.min(textArea.scrollHeight, maxHeight);
			textArea.style.height = `${height}px`;
			textArea.style.overflowY = height === maxHeight ? 'auto' : 'hidden';
			// wrapper around input/ textarea
			_inputWrapper.current.style.height = `${height}px`;

			if (_errorWrapper.current) {
				_errorWrapper.current.style.bottom = `${height}px`;
			}
		}
	};
	const getAISourceObjects = () => {
		const sourceObjects = [];

		if (!props.AIResponse) return sourceObjects;
		const docIds = sourceDocIds || [];
		if (initialHits) {
			docIds.forEach((id) => {
				const foundSourceObj = initialHits.find(hit => hit._id === id) || {};
				if (foundSourceObj) {
					const { _source = {}, ...rest } = foundSourceObj;

					sourceObjects.push({ ...rest, ..._source });
				}
			});
		} else {
			sourceObjects.push(
				...docIds.map(id => ({
					_id: id,
				})),
			);
		}

		return sourceObjects;
	};

	const renderAIScreenFooter = () => {
		const {
			showSourceDocuments = true,
			onSourceClick = () => {},
			renderSourceDocument,
			isAIResponseLoading,
			isAITyping,
		} = props || {};
		if (isAIResponseLoading || isAITyping) {
			return null;
		}
		const renderSourceDocumentLabel = (sourceObj) => {
			if (renderSourceDocument) {
				return renderSourceDocument(sourceObj);
			}

			return sourceObj._id;
		};

		return showSourceDocuments && Array.isArray(sourceDocIds) && sourceDocIds.length ? (
			<Footer
				themePreset={props.themePreset}
				style={{ marginTop: '1.5rem', background: 'inherit' }}
			>
				Summary generated using the following sources:{' '}
				<SourceTags>
					{getAISourceObjects().map(el => (
						<Button
							className={`--ai-source-tag ${
								getClassName(props.innerClass, 'ai-source-tag') || ''
							}`}
							info
							onClick={() => onSourceClick && onSourceClick(el)}
							key={el._id}
						>
							{renderSourceDocumentLabel(el)}
						</Button>
					))}
				</SourceTags>
			</Footer>
		) : null;
	};

	React.useEffect(() => {
		if (
			props.showSourceDocuments
			&& props.AIResponse
			&& props.AIResponse.response
			&& props.AIResponse.response.answer
			&& Array.isArray(props.AIResponse.response.answer.documentIds)
		) {
			setSourceDocIds(props.AIResponse.response.answer.documentIds);

			const localCache
				= getObjectFromLocalStorage(AI_LOCAL_CACHE_KEY)
				&& getObjectFromLocalStorage(AI_LOCAL_CACHE_KEY)[props.componentId];
			if (
				localCache
				&& localCache.meta
				&& localCache.meta.hits
				&& localCache.meta.hits.hits
			) {
				setInitialHits(localCache.meta.hits.hits);
			}
		}
	}, [props.AIResponse]);

	React.useEffect(() => {
		if (messagesContainerRef.current) {
			messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
		}
	}, [messages]);

	React.useEffect(() => {
		handleTextAreaHeightChange();
	}, [inputMessage]);

	React.useEffect(() => {
		if (props.rawData && props.rawData.hits && props.rawData.hits.hits) {
			setInitialHits(props.rawData.hits.hits);
		}
	}, [props.rawData]);

	return (
		<ChatContainer
			className="--ai-chat-container"
			theme={props.theme}
			showInput={props.showInput}
		>
			{/* custom render */}
			{hasCustomRenderer(props) && getComponent()}
			{/* Default render */}
			{!hasCustomRenderer(props) && (
				<MessagesContainer
					themePreset={props.themePreset}
					theme={props.theme}
					ref={messagesContainerRef}
					className="--ai-messages-container"
				>
					{messages.map((message, index) => (
						<Message
							// eslint-disable-next-line react/no-array-index-key
							key={index}
							isSender={message.role === AI_ROLES.USER}
							dangerouslySetInnerHTML={{
								__html: md.render(message.content),
							}}
							themePreset={props.themePreset}
							theme={props.theme}
							className={`--ai-answer-message ${
								getClassName(props.innerClass, 'ai-message') || ''
							}`}
						/>
					))}
					{props.isAIResponseLoading && (
						<Message
							themePreset={props.themePreset}
							theme={props.theme}
							isSender={false}
							className={`--ai-answer-message ${
								getClassName(props.innerClass, 'ai-message') || null
							}`}
						>
							<TypingIndicator>
								<TypingDot themePreset={props.themePreset} />
								<TypingDot themePreset={props.themePreset} />
								<TypingDot themePreset={props.themePreset} />
							</TypingIndicator>
						</Message>
					)}
				</MessagesContainer>
			)}
			{renderErrorEle()}
			{props.showFeedback && !props.isAIResponseLoading && !props.isAITyping && (
				<div
					className={`--ai-answer-feedback-container ${
						getClassName(props.innerClass, 'ai-feedback') || ''
					}`}
				>
					<AIFeedback
						hideUI={props.isAIResponseLoading || !props.currentSessionId}
						key={props.currentSessionId}
						onFeedbackSubmit={(useful, reason) => {
							props.trackUsefullness(props.currentSessionId, {
								useful,
								reason,
							});
						}}
					/>
				</div>
			)}
			{renderAIScreenFooter()}
			{props.showInput && !props.isAIResponseLoading && !props.isAITyping && (
				<MessageInputContainer
					className="--ai-input-container"
					onSubmit={handleSendMessage}
				>
					<InputGroup style={{ height: 'max-content' }} isOpen={false}>
						<InputWrapper ref={_inputWrapper} enableAI>
							<MessageInput
								type="text"
								enterButton={props.enterButton}
								ref={_inputRef}
								placeholder={props.placeholder}
								value={inputMessage}
								onChange={handleMessageInputChange}
								onKeyPress={handleKeyPress}
								id={`${props.componentId}-ai-input`}
								showIcon={props.showIcon}
								iconPosition={props.iconPosition}
								themePreset={props.themePreset}
								className={getClassName(props.innerClass, 'ai-input') || null}
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
			role: PropTypes.string.isRequired,
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
	theme: types.style,
	renderError: types.title,
	showRetryButton: types.bool,
	showFeedback: types.bool,
	trackUsefullness: types.func,
	currentSessionId: types.string,
	showSourceDocuments: types.bool,
	renderTriggerMessage: types.children,
	renderSourceDocument: types.func,
	onSourceClick: types.func,
	isAITyping: types.boolRequired,
};

export default Chat;
