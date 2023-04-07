import VueTypes from 'vue-types';
import {
	AI_LOCAL_CACHE_KEY,
	AI_ROLES,
	componentTypes,
} from '@appbaseio/reactivecore/lib/utils/constants';
import { defineComponent } from 'vue';
import { fetchAIResponse } from '@appbaseio/reactivecore/lib/actions/query';
import { Remarkable } from 'remarkable';

import {
	getClassName,
	getComponent,
	getObjectFromLocalStorage,
	setObjectInLocalStorage,
} from '@appbaseio/reactivecore/lib/utils/helper';
import { connect, hasCustomRenderer, isFunction } from '../../utils/index';
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

const md = new Remarkable();

md.set({
	html: true,
	breaks: true,
	xhtmlOut: true,
});

const AIAnswer = defineComponent({
	name: 'AIAnswer',
	data() {
		const props = this.$props;
		this.__state = {
			messages: [],
			inputMessage: '',
			AISessionId: '',
		};
		this.internalComponent = `${props.componentId}__internal`;
		return this.__state;
	},
	inject: {
		theme: {
			from: 'theme_reactivesearch',
		},
	},
	created() {},
	computed: {
		hasCustomRenderer() {
			return hasCustomRenderer(this);
		},
	},
	props: {
		componentId: types.string.isRequired,
		showVoiceInput: VueTypes.bool.def(false),
		showIcon: VueTypes.bool.def(true),
		onData: types.func,
		innerRef: VueTypes.string.def('searchInputField'),
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
	},
	mounted() {},
	watch: {
		AIResponse(newVal) {
			if (newVal) {
				this.AISessionId
					= (
						(getObjectFromLocalStorage(AI_LOCAL_CACHE_KEY) || {})[
							this.$props.componentId
						] || {}
					).sessionId || null;
				const { request, response } = newVal;
				const finalMessages = [];

				// pushing message history so far
				if (request && request.messages && Array.isArray(request.messages)) {
					finalMessages.push(
						...request.messages.filter(msg => msg.role !== AI_ROLES.SYSTEM),
					);
				}

				// pushing fresh response
				if (
					response
					&& response.choices
					&& Array.isArray(response.choices)
					&& response.choices.length > 0
				) {
					finalMessages.push(response.choices[0].message);
				}

				this.messages = finalMessages;
			} else if (this.$props.isLoading && !newVal) {
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
		},
		isAIResponseLoading(newVal) {
			this.$emit('on-data', {
				data: this.messages,
				rawData: this.$props.rawData,
				loading: newVal || this.$props.isLoading,
				error: this.$props.AIResponseError,
			});
		},
		AIResponseError(newVal) {
			this.$emit('on-data', {
				data: this.messages,
				rawData: this.$props.rawData,
				loading: this.$props.isAIResponseLoading || this.$props.isLoading,
				error: newVal,
			});
		},
	},
	methods: {
		handleMessageInputChange(e) {
			this.inputMessage = e.target.value;
		},
		handleSendMessage(e, isRetry = false, text = this.inputMessage) {
			if (typeof e === 'object') e.preventDefault();
			if (text.trim()) {
				if (this.$props.isAIResponseLoading) {
					return;
				}
				if (!isRetry)
					this.messages = [...this.messages, { content: text, role: AI_ROLES.USER }];
				if (this.AISessionId) {
					this.$props.getAIResponse(this.AISessionId, this.$props.componentId, text);
				} else {
					console.error(
						`AISessionId for ${this.$props.componentId} is missing! AIAnswer component requires an AISession to function. Trying reloading the App.`,
					);
				}

				this.inputMessage = '';
			}
		},
		handleRetryRequest() {
			if (this.messages && !(this.$props.isAIResponseLoading || this.$props.isLoading)) {
				const lastUserRequestMessage = this.messages[this.messages.length - 1].content;

				if (this.AISessionId) {
					this.$props.getAIResponse(
						this.AISessionId,
						this.$props.componentId,
						lastUserRequestMessage,
					);
					this.inputMessage = '';
				} else {
					console.error(
						`AISessionId for ${this.$props.componentId} is missing! AIAnswer component requires an AISession to function. Trying reloading the App.`,
					);
				}
			}
		},
		renderErrorComponent() {
			const renderError = this.$slots.renderError || this.$props.renderError;
			const { AIResponseError, isAIResponseLoading } = this.$props;

			if (AIResponseError && !isAIResponseLoading) {
				if (renderError) {
					return (
						<div
							class={`--ai-answer-error-container ${getClassName(
								this.$props.innerClass,
								'ai-error',
							) || ''}`}
						>
							{isFunction(renderError)
								? renderError(AIResponseError, this.handleRetryRequest)
								: renderError}
						</div>
					);
				}
				return (
					<div
						class={`--ai-answer-error-container ${getClassName(
							this.$props.innerClass,
							'ai-error',
						) || ''}`}
					>
						<div class="--default-error-element">
							<span>
								{AIResponseError.message
									? AIResponseError.message
									: 'There was an error in generating the response.'}{' '}
								{AIResponseError.code
									? `Code:
							${AIResponseError.code}`
									: ''}
							</span>
							<Button primary onClick={this.handleRetryRequest}>
								Try again
							</Button>
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
					<IconGroup groupPosition="right" positionType="absolute">
						{this.shouldMicRender(showVoiceInput) && (
							<Mic
								getInstance={getMicInstance}
								render={renderMic}
								onResult={this.handleVoiceResults}
								class={getClassName(innerClass, 'ai-search-mic') || null}
							/>
						)}
						{iconPosition === 'right' && <IconWrapper>{this.renderIcon()}</IconWrapper>}
					</IconGroup>

					<IconGroup groupPosition="left" positionType="absolute">
						{iconPosition === 'left' && <IconWrapper>{this.renderIcon()}</IconWrapper>}
					</IconGroup>
				</div>
			);
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
							class={`enter-btn ${getClassName(innerClass, 'ai-enter-button')}`}
						>
							Send
						</SendButton>
					);
				};

				return <div class="ai-enter-button-wrapper">{getEnterButtonMarkup()}</div>;
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
		console.log('messages', this.messages);
		return (
			<Chatbox>
				{this.$props.title && (
					<Title class={getClassName(this.$props.innerClass, 'title') || ''}>
						{this.$props.title}
					</Title>
				)}
				<ChatContainer theme={props.theme} showInput={props.showInput}>
					{/* custom render */}
					{this.hasCustomRenderer && getComponent()}
					{/* Default render */}
					{!this.hasCustomRenderer && (
						<MessagesContainer
							themePreset={props.themePreset}
							theme={props.theme}
							ref={this.$props.innerRef}
						>
							{this.messages.map((message, index) => (
								<Message
									// eslint-disable-next-line react/no-array-index-key
									key={index}
									isSender={message.role === AI_ROLES.USER}
									innerHTML={md.render(message.content)}
									themePreset={props.themePreset}
									theme={props.theme}
									class={`--ai-answer-message ${getClassName(
										props.innerClass,
										'ai-message',
									) || ''}`}
								/>
							))}
							{props.isAIResponseLoading && (
								<Message
									themePreset={props.themePreset}
									theme={props.theme}
									isSender={false}
									class={`--ai-answer-message ${getClassName(
										props.innerClass,
										'ai-message',
									) || null}`}
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
					{this.renderErrorComponent()}
					{props.showInput && (
						<MessageInputContainer
							class="--ai-input-container"
							onSubmit={this.handleSendMessage}
						>
							<InputGroup isOpen={false}>
								<InputWrapper>
									<MessageInput
										type="text"
										placeholder={props.placeholder}
										value={this.inputMessage}
										onChange={this.handleMessageInputChange}
										onKeyPress={this.handleKeyPress}
										id={`${props.componentId}-ai-input`}
										showIcon={props.showIcon}
										iconPosition={props.iconPosition}
										themePreset={props.themePreset}
										disabled={props.isAIResponseLoading}
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

const mapStateToProps = (state, props) => ({
	AIResponse:
		state.AIResponses[props.componentId] && state.AIResponses[props.componentId].response,
	isAIResponseLoading:
		(state.AIResponses[props.componentId] && state.AIResponses[props.componentId].isLoading)
		|| false,
	AIResponseError:
		state.AIResponses[props.componentId] && state.AIResponses[props.componentId].error,
	rawData: state.rawData[props.componentId],
	themePreset: state.config.themePreset,
	isLoading: state.isLoading[props.componentId] || false,
});
const mapDispatchToProps = {
	getAIResponse: fetchAIResponse,
};
export const AIConnected = PreferencesConsumer(
	ComponentWrapper(connect(mapStateToProps, mapDispatchToProps)(AIAnswer), {
		componentType: componentTypes.AIAnswer,
		internalComponent: true,
	}),
);
AIConnected.name = AIAnswer.name;

AIConnected.hasInternalComponent = AIAnswer.hasInternalComponent;

AIConnected.install = function(Vue) {
	Vue.component(AIConnected.name, AIConnected);
};
// Add componentType for SSR
AIConnected.componentType = componentTypes.AIAnswer;

export default AIConnected;
