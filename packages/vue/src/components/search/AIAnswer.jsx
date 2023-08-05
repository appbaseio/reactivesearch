import VueTypes from 'vue-types';
import {
	AI_LOCAL_CACHE_KEY,
	AI_ROLES,
	AI_TRIGGER_MODES,
	componentTypes,
} from '@appbaseio/reactivecore/lib/utils/constants';
import { defineComponent } from 'vue';
import { fetchAIResponse, createAISession } from '@appbaseio/reactivecore/lib/actions/query';
import { Remarkable } from 'remarkable';

import {
	getClassName,
	getObjectFromLocalStorage,
	setObjectInLocalStorage,
} from '@appbaseio/reactivecore/lib/utils/helper';
import { recordAISessionUsefulness } from '@appbaseio/reactivecore/lib/actions/analytics';
import { connect, hasCustomRenderer, isFunction, getComponent } from '../../utils/index';
import types from '../../utils/vueTypes';
import ComponentWrapper from '../basic/ComponentWrapper.jsx';
import PreferencesConsumer from '../basic/PreferencesConsumer.jsx';
import {
	ChatContainer,
	Chatbox,
	Message,
	MessageInput,
	MessageInputContainer,
	MessagesContainer,
	SendButton,
	TypingDot,
	TypingIndicator,
} from '../../styles/AIAnswer';
import Title from '../../styles/Title';
import IconGroup from '../../styles/IconGroup';
import Mic from './addons/Mic.jsx';
import IconWrapper from '../../styles/IconWrapper';
import InputWrapper from '../../styles/InputWrapper';
import InputGroup from '../../styles/InputGroup';
import SearchSvg from '../shared/SearchSvg';
import Button from '../../styles/Button';
import AIFeedback from '../shared/AIFeedback.jsx';
import { Footer, SourceTags } from '../../styles/SearchBoxAI';

const md = new Remarkable();

md.set({
	html: true,
	breaks: true,
	xhtmlOut: true,
	linkify: true,
	linkTarget: '_blank',
});

const _inputWrapperRef = 'inputWrapperRef';
const _inputRef = 'inputRef';
const _errorContainerRef = 'errorContainerRef';

const AIAnswer = defineComponent({
	name: 'AIAnswer',
	data() {
		const props = this.$props;
		this.__state = {
			messages: [],
			inputMessage: '',
			AISessionId: '',
			error: null,
			sourceDocIds: null,
			initialHits: null,
			isTriggered: false,
		};
		this.internalComponent = `${props.componentId}__internal`;
		return this.__state;
	},
	inject: {
		theme: {
			from: 'theme_reactivesearch',
		},
	},
	created() {
		if (this.$props.triggerOn === AI_TRIGGER_MODES.ALWAYS) {
			this.isTriggered = true;
		} else if (
			this.$props.triggerOn === AI_TRIGGER_MODES.QUESTION
			&& this.dependentComponentValue
			&& this.dependentComponentValue.endsWith('?')
		) {
			this.isTriggered = true;
			if (this.AISessionId) {
				this.handleSendMessage(null, false, '', true);
			}
		}
	},
	computed: {
		hasCustomRenderer() {
			return hasCustomRenderer(this);
		},
		isLoadingState() {
			return this.isAIResponseLoading || this.isLoading;
		},
		shouldShowComponent() {
			return this.showComponent;
		},
		errorMessageForMissingSessionId() {
			return `AISessionId for ${this.$props.componentId} is missing! AIAnswer component requires an AISessionId to function. Try reloading the App.`;
		},
		hasTriggered() {
			return this.isTriggered;
		},
	},
	props: {
		componentId: types.string.isRequired,
		showVoiceInput: VueTypes.bool.def(false),
		showFeedback: VueTypes.bool.def(true),
		showIcon: VueTypes.bool.def(true),
		onData: types.func,
		innerRef: VueTypes.string.def('AISearchInputField'),
		react: types.react,
		enableAI: VueTypes.bool.def(true),
		AIConfig: types.AIConfig,
		iconPosition: types.iconPosition.def('left'),
		themePreset: types.themePreset,
		theme: types.style,
		icon: types.children,
		iconURL: VueTypes.string.def(''),
		renderMic: types.func,
		getMicInstance: types.func,
		innerClass: types.style,
		placeholder: VueTypes.string.def('Ask a question'),
		title: types.title,
		AIResponse: types.componentObject,
		isAIResponseLoading: VueTypes.bool.def(false),
		AIResponseError: types.componentObject,
		getAIResponse: types.func.isRequired,
		enterButton: types.bool,
		renderEnterButton: types.title,
		showInput: VueTypes.bool.def(true),
		clearSessionOnDestroy: VueTypes.bool.def(true),
		rawData: types.rawData,
		render: types.func,
		onError: types.func,
		renderError: types.title,
		isLoading: types.boolRequired,
		sessionIdFromStore: VueTypes.string,
		showComponent: types.boolRequired,
		componentError: types.componentObject,
		style: types.style,
		showSourceDocuments: VueTypes.bool.def(false),
		renderSourceDocument: types.func,
		onSourceClick: types.func,
		isAITyping: types.boolRequired,
		triggerOn: VueTypes.string.def(AI_TRIGGER_MODES.ALWAYS),
		renderTriggerMessage: types.func,
	},
	mounted() {},
	watch: {
		AIResponse(newVal) {
			if (newVal) {
				if (
					this.$props.showSourceDocuments
					&& newVal.response
					&& newVal.response.answer
					&& Array.isArray(newVal.response.answer.documentIds)
				) {
					this.sourceDocIds = newVal.response.answer.documentIds;

					const localCache
						= getObjectFromLocalStorage(AI_LOCAL_CACHE_KEY)
						&& getObjectFromLocalStorage(AI_LOCAL_CACHE_KEY)[this.$props.componentId];

					if (localCache && localCache.meta && localCache.meta.hits) {
						this.initialHits = localCache.meta.hits;
					}
				}

				this.AISessionId
					= (
						(getObjectFromLocalStorage(AI_LOCAL_CACHE_KEY) || {})[
							this.$props.componentId
						] || {}
					).sessionId
					|| (
						(
							(getObjectFromLocalStorage(AI_LOCAL_CACHE_KEY) || {})[
								this.$props.componentId
							] || {}
						).response || {}
					).sessionId;
				const { messages: messagesHistory, response } = newVal;

				const finalMessages = [];

				if (response && response.error) {
					this.error = { message: response.error };
				}
				// pushing message history so far
				if (messagesHistory && Array.isArray(messagesHistory)) {
					finalMessages.push(
						...messagesHistory.filter((msg) => msg.role !== AI_ROLES.SYSTEM).slice(1),
					);
				} else if (response && response.answer && response.answer.text) {
					finalMessages.push({ role: AI_ROLES.ASSISTANT, content: response.answer.text });
					if (!this.AISessionId)
						this.error = { message: this.errorMessageForMissingSessionId };
				}

				this.messages = finalMessages;
			} else if (!newVal && !this.error) {
				this.messages = [];
			}
		},
		rawData(newVal) {
			this.$emit('on-data', {
				data: this.messages,
				rawData: newVal,
				loading: this.$props.isAIResponseLoading || this.$props.isLoading,
				error: this.$props.AIResponseError,
			});

			if (newVal && newVal.hits && newVal.hits.hits) {
				this.initialHits = newVal.hits.hits;
			}
		},
		isAIResponseLoading(newVal) {
			this.$emit('on-data', {
				data: this.messages,
				rawData: this.$props.rawData,
				loading: newVal || this.isLoading,
				error: this.$props.AIResponseError,
			});
		},
		isLoading(newVal) {
			this.$emit('on-data', {
				data: this.messages,
				rawData: this.$props.rawData,
				loading: newVal || this.isAIResponseLoading,
				error: this.$props.AIResponseError,
			});
		},
		sessionIdFromStore(newVal) {
			if (newVal) {
				this.sessionId = newVal;
			}
		},
		AIResponseError(newVal) {
			this.error = newVal;
			this.AISessionId
				= (
					(getObjectFromLocalStorage(AI_LOCAL_CACHE_KEY) || {})[
						this.$props.componentId
					] || {}
				).sessionId
				|| (
					(
						(getObjectFromLocalStorage(AI_LOCAL_CACHE_KEY) || {})[
							this.$props.componentId
						] || {}
					).response || {}
				).sessionId;
			if (this.error && !this.AISessionId) {
				const errorMessage = this.errorMessageForMissingSessionId;
				this.error = {
					message: errorMessage,
				};
				console.error(errorMessage);
			}
			this.$emit('on-data', {
				data: this.messages,
				rawData: this.$props.rawData,
				loading: this.isAIResponseLoading || this.isLoading,
				error: newVal,
			});
		},
		messages() {
			this.scrollToBottom();
		},
		componentError(newVal) {
			if (newVal && newVal._bodyBlob) {
				this.AISessionId
					= (
						(getObjectFromLocalStorage(AI_LOCAL_CACHE_KEY) || {})[
							this.$props.componentId
						] || {}
					).sessionId
					|| (
						(
							(getObjectFromLocalStorage(AI_LOCAL_CACHE_KEY) || {})[
								this.$props.componentId
							] || {}
						).response || {}
					).sessionId;
				if (!this.AISessionId) {
					this.generateNewSessionId();
				}
				newVal._bodyBlob
					.text()
					.then((textData) => {
						try {
							const parsedErrorRes = JSON.parse(textData);
							if (parsedErrorRes.error) {
								this.error = parsedErrorRes.error;

								this.$emit('on-data', {
									data: this.messages,
									rawData: this.$props.rawData,
									loading:
										this.$props.isAIResponseLoading || this.$props.isLoading,
									error: parsedErrorRes.error,
								});
							}
						} catch (error) {
							console.error('Error parsing component error JSON:', error);
						}
					})
					.catch((error) => {
						console.error('Error reading  component error text data:', error);
					});
			}
		},
		showComponent() {
			if (
				this.$props.triggerOn === AI_TRIGGER_MODES.QUESTION
				&& this.$props.dependentComponentValue.endsWith('?')
			) {
				this.isTriggered = true;
			}
		},
		dependentComponentValue(newVal) {
			if (
				this.$props.triggerOn === AI_TRIGGER_MODES.QUESTION
				&& newVal
				&& newVal.endsWith('?')
			) {
				this.isTriggered = true;
				if (this.AISessionId) {
					this.handleSendMessage(null, false, '', true);
				}
			} else if (this.hasTriggered && this.$props.triggerOn !== AI_TRIGGER_MODES.ALWAYS) {
				this.isTriggered = false;
			}
		},
		AISessionId(newVal) {
			if (newVal) {
				if (
					(this.$props.triggerOn === AI_TRIGGER_MODES.QUESTION
						&& this.dependentComponentValue
						&& this.dependentComponentValue.endsWith('?'))
					|| this.$props.triggerOn === AI_TRIGGER_MODES.ALWAYS
				) {
					this.handleSendMessage(null, false, '', true);
				}
			}
		},
		triggerOn(newVal) {
			if (newVal === AI_TRIGGER_MODES.ALWAYS) {
				this.isTriggered = true;
			}
		},
	},
	methods: {
		renderTriggerMessageFunc() {
			const { triggerOn } = this.$props;

			if (this.$props.renderTriggerMessage) {
				return this.$props.renderTriggerMessage;
			}
			if (this.$slots.renderTriggerMessage) {
				return this.$slots.renderTriggerMessage();
			}
			if (triggerOn === AI_TRIGGER_MODES.QUESTION) {
				if (!this.dependentComponentValue.endsWith('?')) {
					return (
						<span>
							<span role="img" aria-label="bulb">
								💡
							</span>
							End your question with a question mark (?)
						</span>
					);
				}
			} else if (triggerOn === AI_TRIGGER_MODES.MANUAL) {
				return (
					<span>
						Click here to ask AI{' '}
						<span role="img" aria-label="bulb">
							🤖
						</span>
					</span>
				);
			}
			return null;
		},
		handleTriggerClick() {
			if (this.$props.triggerOn === AI_TRIGGER_MODES.MANUAL) {
				this.handleSendMessage(null, false, '', true);
				this.isTriggered = true;
			}
		},
		getAISourceObjects() {
			const sourceObjects = [];
			if (!this.AIResponse) return sourceObjects;
			const docIds = this.sourceDocIds || [];
			if (this.initialHits) {
				docIds.forEach((id) => {
					const foundSourceObj = this.initialHits.find((hit) => hit._id === id) || {};
					if (foundSourceObj) {
						const { _source = {}, ...rest } = foundSourceObj;

						sourceObjects.push({ ...rest, ..._source });
					}
				});
			} else {
				sourceObjects.push(
					...docIds.map((id) => ({
						_id: id,
					})),
				);
			}

			return sourceObjects;
		},
		renderAIScreenFooter() {
			const {
				showSourceDocuments = true,
				onSourceClick = () => {},
				renderSourceDocument,
			} = this.$props || {};

			const customRenderSourceDoc = renderSourceDocument || this.$slots.renderSourceDocument;

			if (this.isLoadingState || this.isAITyping) {
				return null;
			}
			const renderSourceDocumentLabel = (sourceObj) => {
				if (customRenderSourceDoc) {
					return customRenderSourceDoc(sourceObj);
				}

				return sourceObj._id;
			};

			return showSourceDocuments
				&& Array.isArray(this.sourceDocIds)
				&& this.sourceDocIds.length ? (
					<Footer
						themePreset={this.$props.themePreset}
						style={{ marginTop: '1.5rem', background: 'inherit' }}
					>
					Summary generated using the following sources:{' '}
						<SourceTags>
							{this.getAISourceObjects().map((el) => (
								<Button
									class={`--ai-source-tag ${
										getClassName(this.$props.innerClass, 'ai-source-tag') || ''
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
		},
		generateNewSessionId() {
			const newSessionPromise = this.createAISession();
			newSessionPromise
				.then((res) => {
					this.AISessionId = res.AIsessionId;
				})
				.catch((e) => {
					console.error(e);
				});
		},
		scrollToBottom() {
			this.$nextTick(() => {
				const messageContainer = this.$refs?.[this.$props.innerRef];

				if (messageContainer && messageContainer.$el) {
					messageContainer.$el.scrollTo({
						top: messageContainer.$el.scrollHeight,
						behavior: 'smooth',
					});
				}
			});
		},
		handleMessageInputChange(e) {
			this.inputMessage = e.target.value;
			this.handleTextAreaHeightChange();
		},
		handleSendMessage(e, isRetry = false, text = this.inputMessage, fetchMeta = false) {
			if (typeof e === 'object' && e !== null) e.preventDefault();
			if (text.trim() || (!text && !e)) {
				if (this.isLoadingState) {
					return;
				}
				if (this.AISessionId) {
					if (!isRetry) {
						const finalMessages = [...this.messages];
						if (text) {
							finalMessages.push({ content: text, role: AI_ROLES.USER });
						}

						this.messages = [...finalMessages];
					}
					this.getAIResponse(this.AISessionId, this.componentId, text, fetchMeta);
				} else {
					console.error(this.errorMessageForMissingSessionId);
					this.error = {
						message: `AISessionId for ${this.$props.componentId} is missing! AIAnswer component requires an AISessionId to function. Trying reloading the App.`,
					};
				}

				this.inputMessage = '';
			}
		},
		handleRetryRequest() {
			if (this.messages && !this.isLoadingState) {
				const lastUserRequestMessage = this.messages[this.messages.length - 1]?.content;

				if (this.AISessionId) {
					this.getAIResponse(this.AISessionId, this.componentId, lastUserRequestMessage);
					this.inputMessage = '';
				} else {
					console.error(
						`AISessionId for ${this.componentId} is missing! AIAnswer component requires an AISessionId to function. Try reloading the App.`,
					);
				}
			}
		},
		renderErrorComponent() {
			const renderError = this.$slots.renderError || this.$props.renderError;

			if (this.error && !this.isLoadingState) {
				if (renderError) {
					return (
						<div
							ref={_errorContainerRef}
							class={`--ai-answer-error-container ${
								getClassName(this.$props.innerClass, 'ai-error') || ''
							}`}
						>
							{isFunction(renderError)
								? renderError(this.error, this.handleRetryRequest)
								: renderError}
						</div>
					);
				}
				return (
					<div
						ref={_errorContainerRef}
						class={`--ai-answer-error-container ${
							getClassName(this.$props.innerClass, 'ai-error') || ''
						}`}
					>
						<div class="--default-error-element">
							<span>
								{this.error?.message
									? this.error.message
									: 'There was an error in generating the response.'}{' '}
								{this.error?.code
									? `, Code:
							${this.error.code}`
									: ''}
							</span>
							{this.AISessionId && (
								<Button primary onClick={this.handleRetryRequest}>
									Try again
								</Button>
							)}
						</div>
					</div>
				);
			}
			return null;
		},
		handleKeyPress(e) {
			if (e.key === 'Enter') {
				this.handleSendMessage(e);
				this.inputMessage = '';
			}
		},
		renderIcon() {
			if (this.$props.showIcon) {
				if (this.$props.icon) {
					return this.$props.icon;
				}
				if (this.$slots.icon) {
					return this.$slots.icon();
				}
				if (this.$props.iconURL) {
					return (
						<img
							style={{ maxHeight: '25px' }}
							src={this.$props.iconURL}
							alt="search-icon"
						/>
					);
				}
				return <SearchSvg />;
			}

			return null;
		},
		shouldMicRender(showVoiceSearch) {
			// checks for SSR
			if (typeof window === 'undefined') return false;
			return showVoiceSearch && (window.webkitSpeechRecognition || window.SpeechRecognition);
		},
		handleVoiceResults({ results }) {
			if (
				results
				&& results[0]
				&& results[0].isFinal
				&& results[0][0]
				&& results[0][0].transcript
				&& results[0][0].transcript.trim()
			) {
				this.handleSendMessage(null, false, results[0][0].transcript.trim());
			}
		},
		renderIcons() {
			const { getMicInstance, showVoiceInput, iconPosition, innerClass } = this.$props;
			const renderMic = this.$slots.renderMic || this.$props.renderMic;
			return (
				<div>
					<IconGroup enableAI groupPosition="right" positionType="absolute">
						{!this.isLoadingState
							&& this.AISessionId
							&& this.shouldMicRender(showVoiceInput) && (
							<Mic
								getInstance={getMicInstance}
								render={renderMic}
								handleResult={this.handleVoiceResults}
								class={getClassName(innerClass, 'ai-search-mic') || null}
							/>
						)}
						{iconPosition === 'right' && <IconWrapper>{this.renderIcon()}</IconWrapper>}
					</IconGroup>

					<IconGroup enableAI groupPosition="left" positionType="absolute">
						{iconPosition === 'left' && <IconWrapper>{this.renderIcon()}</IconWrapper>}
					</IconGroup>
				</div>
			);
		},
		enterButtonOnClick(e) {
			this.handleSendMessage(e);
		},
		renderEnterButtonElement() {
			const { enterButton, innerClass } = this.$props;
			const { renderEnterButton } = this.$slots;
			if (enterButton) {
				const getEnterButtonMarkup = () => {
					if (renderEnterButton) {
						return renderEnterButton(this.enterButtonOnClick);
					}

					return (
						<SendButton
							primary
							type="submit"
							tabIndex={0}
							onClick={this.handleSendMessage}
							onKeyPress={this.handleKeyPress}
							class={`ask-btn ${getClassName(innerClass, 'ai-enter-button')}`}
							disabled={this.isLoadingState || !this.AISessionId}
						>
							Send
						</SendButton>
					);
				};

				return <div class="ai-enter-button-wrapper">{getEnterButtonMarkup()}</div>;
			}

			return null;
		},
		getComponent() {
			const data = {
				error: this.AIResponseError,
				loading: this.isAIResponseLoading,
				data: this.messages,
				rawData: this.rawData,
			};
			return getComponent(data, this);
		},
		handleTextAreaHeightChange() {
			const textArea = this.$refs?.[_inputRef]?.$el;
			const inputWrapper = this.$refs?.[_inputWrapperRef]?.$el;
			const errorContainer = this.$refs?.[_errorContainerRef];

			if (textArea) {
				textArea.style.height = '42px';
				const lineHeight = parseInt(getComputedStyle(textArea).lineHeight, 10);
				const maxHeight = lineHeight * 11; // max height for 10 lines
				const height = Math.min(textArea.scrollHeight, maxHeight);
				textArea.style.height = `${height}px`;
				textArea.style.overflowY = height === maxHeight ? 'auto' : 'hidden';
				// wrapper around input/ textarea
				inputWrapper.style.height = `${height}px`;
				// adjust error-container

				if (errorContainer) {
					errorContainer.style.bottom = `${height}px`;
				}

				this.$forceUpdate();
			}
		},
		getTitle() {
			const hasTitle = this.$props.title || this.$slots.title || null;
			if (hasTitle) {
				return (
					<Title class={getClassName(this.$props.innerClass, 'ai-title') || null}>
						{this.$props.title || this.$slots.title()}
					</Title>
				);
			}

			return null;
		},
	},
	beforeUnmount() {
		if (this.$props.clearSessionOnDestroy) {
			// cleanup logic
			// final Object to store in local storage cache
			const finalCacheObj = getObjectFromLocalStorage(AI_LOCAL_CACHE_KEY) || {};
			// delete current component's cache
			delete finalCacheObj[this.$props.componentId];
			// update local cache
			setObjectInLocalStorage(AI_LOCAL_CACHE_KEY, finalCacheObj);
		}
	},
	render() {
		const props = this.$props;
		if (!this.shouldShowComponent) {
			return null;
		}
		if (!this.isTriggered) {
			return (
				<Chatbox style={props.style || {}}>
					{this.getTitle()}
					<div
						class="--trigger-message-wrapper"
						onClick={this.handleTriggerClick}
						aria-hidden="true"
					>
						{this.renderTriggerMessageFunc()}
					</div>
				</Chatbox>
			);
		}
		return (
			<Chatbox style={props.style || {}}>
				{this.getTitle()}
				<ChatContainer
					class="--ai-chat-container"
					theme={props.theme}
					showInput={props.showInput}
				>
					{/* custom render */}
					{this.hasCustomRenderer && (
						<MessagesContainer
							themePreset={this.themePreset}
							theme={props.theme}
							ref={this.$props.innerRef}
							class={`--ai-message-container ${
								getClassName(props.innerClass, 'ai-message-container') || ''
							}`}
						>
							{this.getComponent()}
						</MessagesContainer>
					)}
					{/* Default render */}
					{!this.hasCustomRenderer && (
						<MessagesContainer
							themePreset={this.themePreset}
							theme={props.theme}
							ref={this.$props.innerRef}
							class={`--ai-message-container ${
								getClassName(props.innerClass, 'ai-message-container') || ''
							}`}
						>
							{this.messages.map((message, index) => (
								<Message
									// eslint-disable-next-line react/no-array-index-key
									key={index}
									isSender={message.role === AI_ROLES.USER}
									innerHTML={md.render(message.content)}
									themePreset={this.themePreset}
									theme={props.theme}
									class={`--ai-answer-message ${
										getClassName(props.innerClass, 'ai-message') || ''
									}`}
								/>
							))}
							{this.isLoadingState && (
								<Message
									themePreset={this.themePreset}
									theme={props.theme}
									isSender={false}
									class={`--ai-answer-message ${
										getClassName(props.innerClass, 'ai-message') || null
									}`}
								>
									<TypingIndicator>
										<TypingDot themePreset={this.themePreset} />
										<TypingDot themePreset={this.themePreset} />
										<TypingDot themePreset={this.themePreset} />
									</TypingIndicator>
								</Message>
							)}
						</MessagesContainer>
					)}
					{this.renderErrorComponent()}{' '}
					{props.showFeedback && !this.isLoadingState && !this.isAITyping && (
						<div
							class={`--ai-answer-feedback-container ${
								getClassName(props.innerClass, 'ai-feedback') || ''
							}`}
						>
							<AIFeedback
								hideUI={this.isLoadingState || !this.sessionId}
								key={this.sessionId}
								onFeedbackSubmit={(useful, reason) => {
									this.trackUsefullness(this.sessionId, {
										useful,
										reason,
									});
								}}
							/>
						</div>
					)}{' '}
					{this.renderAIScreenFooter()}
					{props.showInput && !this.isLoadingState && !this.isAITyping && (
						<MessageInputContainer
							class="--ai-input-container"
							onSubmit={this.handleSendMessage}
						>
							<InputGroup enableAI isOpen={false}>
								<InputWrapper ref={_inputWrapperRef}>
									<MessageInput
										ref={_inputRef}
										placeholder={props.placeholder}
										enterButton={props.enterButton}
										value={this.inputMessage}
										onInput={this.handleMessageInputChange}
										id={`${props.componentId}-ai-input`}
										showIcon={props.showIcon}
										iconPosition={props.iconPosition}
										themePreset={this.themePreset}
										disabled={this.isLoadingState || !this.AISessionId}
										class={getClassName(props.innerClass, 'ai-input') || null}
									/>{' '}
									{this.renderIcons()}
								</InputWrapper>
							</InputGroup>
							{this.renderEnterButtonElement()}
						</MessageInputContainer>
					)}{' '}
				</ChatContainer>
			</Chatbox>
		);
	},
});

AIAnswer.hasInternalComponent = () => true;

const mapStateToProps = (state, props) => {
	let dependencyComponent = Object.values(props.react)[0];
	if (Array.isArray(dependencyComponent)) {
		// eslint-disable-next-line prefer-destructuring
		dependencyComponent = dependencyComponent[0];
	}

	const showComponent = !!(
		state.selectedValues[dependencyComponent] && state.selectedValues[dependencyComponent].value
	);
	const dependentComponentValue
		= (state.selectedValues[dependencyComponent]
			&& state.selectedValues[dependencyComponent].value)
		|| '';
	return {
		showComponent,
		dependentComponentValue,
		AIResponse:
			state.AIResponses[props.componentId] && state.AIResponses[props.componentId].response,
		isAIResponseLoading:
			state.AIResponses[props.componentId] && state.AIResponses[props.componentId].isLoading,
		AIResponseError:
			state.AIResponses[props.componentId] && state.AIResponses[props.componentId].error,
		rawData: state.rawData[props.componentId],
		themePreset: state.config.themePreset,
		isLoading: state.isLoading[props.componentId] || false,
		sessionIdFromStore:
			(state.AIResponses[props.componentId]
				&& state.AIResponses[props.componentId].response
				&& state.AIResponses[props.componentId].response.sessionId)
			|| '',
		componentError: state.error[props.componentId] || null,
		isAITyping:
			(state.AIResponses[props.componentId]
				&& state.AIResponses[props.componentId].response
				&& state.AIResponses[props.componentId].response.isTyping)
			|| false,
	};
};
const mapDispatchToProps = {
	getAIResponse: (sessionId, componentId, message, shouldFetchMeta = false) =>
		fetchAIResponse(sessionId, componentId, message, null, shouldFetchMeta),
	trackUsefullness: recordAISessionUsefulness,
	createAISession,
};
export const AIConnected = PreferencesConsumer(
	ComponentWrapper(connect(mapStateToProps, mapDispatchToProps)(AIAnswer), {
		componentType: componentTypes.AIAnswer,
		internalComponent: true,
	}),
);
AIConnected.name = AIAnswer.name;

AIConnected.hasInternalComponent = AIAnswer.hasInternalComponent;

AIConnected.install = function (Vue) {
	Vue.component(AIConnected.name, AIConnected);
};
// Add componentType for SSR
AIConnected.componentType = componentTypes.AIAnswer;

export default AIConnected;
