/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'emotion-theming';
import {
	AI_LOCAL_CACHE_KEY,
	AI_ROLES,
	componentTypes,
} from '@appbaseio/reactivecore/lib/utils/constants';
import hoistNonReactStatics from 'hoist-non-react-statics';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { fetchAIResponse } from '@appbaseio/reactivecore/lib/actions/query';
import {
	getClassName,
	getObjectFromLocalStorage,
	setObjectInLocalStorage,
} from '@appbaseio/reactivecore/lib/utils/helper';
import { recordAISessionUsefulness } from '@appbaseio/reactivecore/lib/actions/analytics';

import { Chatbox } from '../../../styles/AIAnswer';
import { connect } from '../../../utils';
import PreferencesConsumer from '../../basic/PreferencesConsumer';
import ComponentWrapper from '../../basic/ComponentWrapper';
import Chat from './Chat';
import Title from '../../../styles/Title';

const AIAnswer = (props) => {
	const [messages, setMessages] = React.useState([]);
	const [errorState, setErrorState] = React.useState(null);
	const AISessionId = useRef(null);

	const errorMessageForMissingSessionId = `AISessionId for ${props.componentId} is missing! AIAnswer component requires an AISession to function. Trying reloading the App.`;

	const handleSendMessage = (text, isRetry = false) => {
		if (AISessionId.current) {
			if (!isRetry) setMessages([...messages, { content: text, role: AI_ROLES.USER }]);
			props.getAIResponse(AISessionId.current, props.componentId, text);
		} else {
			console.error(errorMessageForMissingSessionId);
		}
	};
	useEffect(() => {
		setErrorState(props.AIResponseError);
	}, [props.AIResponseError]);

	useEffect(() => {
		if (props.AIResponse) {
			AISessionId.current
				= ((getObjectFromLocalStorage(AI_LOCAL_CACHE_KEY) || {})[props.componentId] || {})
					.sessionId || null;
			const { messages: messagesHistory, response } = props.AIResponse;

			const finalMessages = [];
			if (response && response.error) {
				setErrorState({ message: response.error });
			}

			// pushing message history so far
			if (messagesHistory && messagesHistory && Array.isArray(messagesHistory)) {
				finalMessages.push(
					...messagesHistory.filter(msg => msg.role !== AI_ROLES.SYSTEM),
				);
			} else if (response && response.answer && response.answer.text) {
				finalMessages.push({ role: AI_ROLES.ASSISTANT, content: response.answer.text });
				setErrorState({ message: errorMessageForMissingSessionId });
			}

			setMessages(finalMessages);
		} else if (props.isLoading && !props.AIResponse) {
			setMessages([]);
		}
	}, [props.AIResponse]);

	useEffect(() => {
		if (props.onData) {
			props.onData({
				data: messages,
				rawData: props.rawData,
				loading: props.isAIResponseLoading,
				error: props.AIResponseError,
			});
		}
	}, [props.rawData, messages, props.isAIResponseLoading, props.AIResponseError]);

	useEffect(() => {
		AISessionId.current = props.sessionIdFromStore;
	}, [props.sessionIdFromStore]);

	useEffect(
		() => () => {
			if (props.clearSessionOnDestroy) {
				// cleanup logic
				// final Object to store in local storage cache
				const finalCacheObj = getObjectFromLocalStorage(AI_LOCAL_CACHE_KEY) || {};
				// delete current component's cache
				delete finalCacheObj[props.componentId];
				// update local cache
				setObjectInLocalStorage(AI_LOCAL_CACHE_KEY, finalCacheObj);
			}
		},
		[],
	);

	if (!props.showComponent) {
		return null;
	}

	return (
		<Chatbox>
			{props.title && (
				<Title className={getClassName(props.innerClass, 'ai-title') || null}>
					{props.title}
				</Title>
			)}
			<Chat
				messages={messages}
				onSendMessage={handleSendMessage}
				iconPosition={props.iconPosition}
				showIcon={props.showIcon}
				themePreset={props.themePreset}
				icon={props.icon}
				iconURL={props.iconURL}
				showVoiceInput={
					props.showVoiceInput
					&& !(props.isAIResponseLoading || props.isLoading)
					&& AISessionId.current
				}
				renderMic={props.renderMic}
				getMicInstance={props.getMicInstance}
				innerClass={props.innerClass}
				placeholder={props.placeholder}
				componentId={props.componentId}
				isAIResponseLoading={props.isAIResponseLoading || props.isLoading}
				AIResponse={props.AIResponse}
				AIResponseError={errorState}
				enterButton={props.enterButton}
				renderEnterButton={props.renderEnterButton}
				showInput={props.showInput}
				render={props.render}
				rawData={props.rawData}
				theme={props.theme}
				renderError={props.renderError}
				showRetryButton={!!AISessionId.current}
				showFeedback={props.showFeedback}
				trackUsefullness={props.trackUsefullness}
				currentSessionId={AISessionId.current || ''}
			/>
		</Chatbox>
	);
};

AIAnswer.propTypes = {
	componentId: types.string.isRequired,
	showVoiceInput: PropTypes.bool,
	showIcon: PropTypes.bool,
	onData: types.func,
	react: types.react,
	AIConfig: types.AIConfig,
	iconPosition: types.iconPosition,
	themePreset: types.themePreset,
	theme: types.style,
	icon: types.children,
	iconURL: types.string,
	renderMic: types.func,
	getMicInstance: types.func,
	innerClass: types.style,
	placeholder: types.string,
	title: types.title,
	AIResponse: types.componentObject,
	isAIResponseLoading: types.bool,
	AIResponseError: types.componentObject,
	getAIResponse: types.func.isRequired,
	enterButton: types.bool,
	renderEnterButton: types.title,
	showInput: types.bool,
	clearSessionOnDestroy: types.bool,
	rawData: types.rawData,
	render: types.func,
	onError: types.func,
	renderError: types.title,
	isLoading: types.boolRequired,
	sessionIdFromStore: types.string,
	showComponent: types.boolRequired,
	showFeedback: types.bool,
	trackUsefullness: types.funcRequired,
};

AIAnswer.defaultProps = {
	placeholder: 'Ask a question',
	showVoiceInput: false,
	showIcon: true,
	iconPosition: 'left',
	enterButton: true,
	renderEnterButton: null,
	showInput: true,
	clearSessionOnDestroy: true,
	sessionIdFromStore: '',
	showComponent: false,
	showFeedback: true,
};

const mapStateToProps = (state, props) => {
	let dependencyComponent = Object.values(props.react)[0];
	if (Array.isArray(dependencyComponent)) {
		dependencyComponent = dependencyComponent[0];
	}

	const showComponent = Boolean(
		state.selectedValues[dependencyComponent]
			&& state.selectedValues[dependencyComponent].value,
	);

	return {
		showComponent,
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
				&& state.AIResponses[props.componentId].sessionId)
			|| '',
	};
};

const mapDispatchtoProps = dispatch => ({
	getAIResponse: (sessionId, componentId, message) =>
		dispatch(fetchAIResponse(sessionId, componentId, message)),
	trackUsefullness: (sessionId, otherInfo) =>
		dispatch(recordAISessionUsefulness(sessionId, otherInfo)),
});

// Add componentType for SSR
AIAnswer.componentType = componentTypes.AIAnswer;

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(withTheme(props => <AIAnswer ref={props.myForwardedRef} {...props} />));

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<PreferencesConsumer userProps={props}>
		{preferenceProps => (
			<ComponentWrapper
				{...preferenceProps}
				internalComponent
				componentType={componentTypes.AIAnswer}
				enableAI
				mode={preferenceProps.testMode ? 'test' : ''}
				{...(preferenceProps.AIConfig && preferenceProps.AIConfig.topDocsForContext
					? { size: preferenceProps.AIConfig.topDocsForContext }
					: {})}
			>
				{componentProps => (
					<ConnectedComponent
						{...preferenceProps}
						{...componentProps}
						myForwardedRef={ref}
					/>
				)}
			</ComponentWrapper>
		)}
	</PreferencesConsumer>
));
hoistNonReactStatics(ForwardRefComponent, AIAnswer);

ForwardRefComponent.displayName = 'AIAnswer';
export default ForwardRefComponent;
