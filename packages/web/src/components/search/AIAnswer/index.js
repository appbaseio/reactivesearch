/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'emotion-theming';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import hoistNonReactStatics from 'hoist-non-react-statics';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { setQueryOptions, updateQuery } from '@appbaseio/reactivecore/lib/actions/query';
import { setDefaultQuery } from '@appbaseio/reactivecore/lib/actions/misc';
import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';
import { getClassName, getQueryOptions } from '@appbaseio/reactivecore/lib/utils/helper';

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

	const handleSendMessage = (text) => {
		setMessages([...messages, { text, isSender: true }]);
	};
	const internalComponent = useRef(null);
	const options = getQueryOptions(props);

	useConstructor(() => {
		internalComponent.current = getInternalComponentID(componentId);

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
};

AIAnswer.defaultProps = {
	placeholder: 'Ask a question',
	enableVoiceInput: false,
	showIcon: true,
	showVoiceSearch: false,
	iconPosition: 'left',
};

const mapStateToProps = (state, props) => ({});

const mapDispatchtoProps = dispatch => ({
	setDefaultQuery: (component, query) => dispatch(setDefaultQuery(component, query)),
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute)),
	updateQuery: (updateQueryObject, execute) => dispatch(updateQuery(updateQueryObject, execute)),
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
				componentType={componentTypes.searchBox}
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
