/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'emotion-theming';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import hoistNonReactStatics from 'hoist-non-react-statics';
import types from '@appbaseio/reactivecore/lib/utils/types';
import {
	fetchAIResponse,
	setQueryOptions,
	updateQuery,
} from '@appbaseio/reactivecore/lib/actions/query';
import { setDefaultQuery } from '@appbaseio/reactivecore/lib/actions/misc';
import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';
import {
	getClassName,
	getObjectFromLocalStorage,
	getQueryOptions,
} from '@appbaseio/reactivecore/lib/utils/helper';

import { Chatbox } from '../../../styles/AIAnswer';
import { connect } from '../../../utils';
import PreferencesConsumer from '../../basic/PreferencesConsumer';
import ComponentWrapper from '../../basic/ComponentWrapper';
import HOOKS from '../../../utils/hooks';
import Chat from './Chat';
import Title from '../../../styles/Title';

const { useConstructor } = HOOKS;

const AIAnswer = (props) => {
	const { componentId, AIConfig } = props;
	const [messages, setMessages] = React.useState([
		{
			id: 1,
			text: 'Hey, how are you?',
			timestamp: '2023-03-23T10:00:00.000Z',
			isSender: true,
		},
		{
			id: 2,
			text: "I'm doing great, thanks! How about you?",
			timestamp: '2023-03-23T10:01:00.000Z',
			isSender: false,
		},
		{
			id: 3,
			text: "Good to hear! I'm also doing well.",
			timestamp: '2023-03-23T10:02:00.000Z',
			isSender: true,
		},
		{
			id: 4,
			text: 'What are your plans for the weekend?',
			timestamp: '2023-03-23T10:03:00.000Z',
			isSender: false,
		},
		{
			id: 5,
			text: "I'm thinking about going hiking. What about you?",
			timestamp: '2023-03-23T10:04:00.000Z',
			isSender: true,
		},
		{
			id: 34,
			text: 'That sounds fun! I might join a friend for a movie.',
			timestamp: '2023-03-23T10:05:00.000Z',
			isSender: false,
		},
		{
			id: 534,
			text: 'What are your plans for the weekend?',
			timestamp: '2023-03-23T10:03:00.000Z',
			isSender: false,
		},
		{
			id: 456,
			text: "I'm thinking about going hiking. What about you?",
			timestamp: '2023-03-23T10:04:00.000Z',
			isSender: true,
		},
		{
			id: 47,
			text: 'That sounds fun! I might join a friend for a movie.',
			timestamp: '2023-03-23T10:05:00.000Z',
			isSender: false,
		},
	]);

	const internalComponent = useRef(null);
	const AISessionId = useRef(null);
	const options = getQueryOptions(props);

	const handleSendMessage = (text) => {
		setMessages([...messages, { text, isSender: true }]);
		if (AISessionId.current) {
			props.getAIResponse(AISessionId.current, props.componentId, text);
		} else {
			console.error(
				`AISessionId for ${props.componentId} is missing! AIAnswer component requires an AISession to function. Trying reloading the App.`,
			);
		}
	};
	useConstructor(() => {
		internalComponent.current = getInternalComponentID(componentId);
		AISessionId.current = getObjectFromLocalStorage('sessionIds')[props.componentId];

		// execute is set to false at the time of mount
		// to avoid firing (multiple) partial queries.
		// Hence we are building the query in parts here
		// and only executing it with setReact() at core
		const execute = false;
		props.setQueryOptions(
			componentId,
			{
				...options,
				...(AIConfig && AIConfig.topDocsForContext
					? { size: AIConfig.topDocsForContext }
					: {}),
			},
			execute,
		);
		props.updateQuery(
			{
				componentId: internalComponent.current,
				query: null,
			},
			execute,
		);
	});

	useEffect(() => {
		console.log(props.AIResponse);
	}, [props.AIResponse]);

	return (
		<Chatbox>
			{' '}
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
				enableVoiceInput={props.enableVoiceInput}
				renderMic={props.renderMic}
				getMicInstance={props.getMicInstance}
				innerClass={props.innerClass}
				placeholder={props.placeholder}
				componentId={props.componentId}
				isAIResponseLoading={props.isAIResponseLoading}
				AIResponse={props.AIResponse}
				AIResponseError={props.AIResponseError}
			/>
		</Chatbox>
	);
};

AIAnswer.propTypes = {
	componentId: types.string.isRequired,
	enableVoiceInput: PropTypes.bool,
	showIcon: PropTypes.bool,
	onData: PropTypes.func.isRequired,
	react: types.react,
	AIConfig: types.AIConfig,
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	setDefaultQuery: types.funcRequired,
	iconPosition: types.iconPosition,
	themePreset: types.themePreset,
	icon: types.children,
	iconURL: types.string,
	showVoiceSearch: types.bool,
	renderMic: types.func,
	getMicInstance: types.func,
	innerClass: types.style,
	placeholder: types.string,
	title: types.title,
	AIResponse: types.componentObject,
	isAIResponseLoading: types.bool,
	AIResponseError: types.componentObject,
	getAIResponse: types.func.isRequired,
};

AIAnswer.defaultProps = {
	placeholder: 'Ask a question',
	enableVoiceInput: false,
	showIcon: true,
	showVoiceSearch: false,
	iconPosition: 'left',
};

const mapStateToProps = (state, props) => ({
	AIResponse:
		state.AIResponses[props.componentId] && state.AIResponses[props.componentId].response,
	isAIResponseLoading:
		state.AIResponses[props.componentId] && state.AIResponses[props.componentId].isLoading,
	AIResponseError:
		state.AIResponses[props.componentId] && state.AIResponses[props.componentId].error,
});

const mapDispatchtoProps = dispatch => ({
	setDefaultQuery: (component, query) => dispatch(setDefaultQuery(component, query)),
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute)),
	updateQuery: (updateQueryObject, execute) => dispatch(updateQuery(updateQueryObject, execute)),
	getAIResponse: (sessionId, componentId, message) =>
		dispatch(fetchAIResponse(sessionId, componentId, message)),
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
