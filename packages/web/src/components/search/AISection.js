import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Remarkable } from 'remarkable';
import { getClassName } from '@appbaseio/reactivecore/lib/utils/helper';
import { SearchBoxAISection, Answer } from '../../styles/SearchBoxAI';
import TypingEffect from '../shared/TypingEffect';
import AIFeedback from '../shared/AIFeedback';

const md = new Remarkable();
md.set({
	html: true,
	breaks: true,
	xhtmlOut: true,
	linkify: true,
	linkTarget: '_blank',
});

const AISection = ({
	showAIScreen,
	themePreset,
	renderAIAnswer,
	mergedAIQuestion,
	mergedAIAnswer,
	AIResponse,
	isAIResponseLoading,
	isLoading,
	getAISourceObjects,
	AIResponseError,
	renderAIScreenLoader,
	currentValue,
	prevPropsRefIsAITyping,
	setShowAIScreenFooter,
	AIUIConfig,
	showTypingEffect,
	setShowFeedbackComponent,
	setShowTypingEffect,
	_dropdownULRef,
	isUserScrolling,
	setLastScrollTop,
	renderAIScreenFooter,
	showFeedbackComponent,
	innerClass,
	feedbackState,
	sessionIdFromStore,
	setFeedbackState,
	trackUsefullness,
	renderError,
	isTypingAIAnswer,
}) => {
	if (!showAIScreen) return null;

	return (
		<SearchBoxAISection themePreset={themePreset}>
			{typeof renderAIAnswer === 'function' ? (
				renderAIAnswer({
					question: mergedAIQuestion,
					answer: mergedAIAnswer,
					documentIds:
						(AIResponse
							&& AIResponse.response
							&& AIResponse.response.answer
							&& AIResponse.response.answer.documentIds)
						|| [],
					loading: isAIResponseLoading || isLoading,
					sources: getAISourceObjects(),
					error: AIResponseError,
				})
			) : (
				<Fragment>
					{isAIResponseLoading || isLoading ? (
						renderAIScreenLoader()
					) : (
						<Fragment>
							<Answer>
								<TypingEffect
									key={currentValue}
									message={md.render(mergedAIAnswer || '')}
									speed={5}
									onTypingComplete={() => {
										if (prevPropsRefIsAITyping.current === undefined) {
											setShowAIScreenFooter(true);
										}
										if (
											(AIUIConfig
												&& typeof AIUIConfig.showFeedback === 'boolean'
												? AIUIConfig.showFeedback
												: true) &&
											showTypingEffect
										) {
											setShowFeedbackComponent(true);
										}

										if (mergedAIAnswer) {
											setShowTypingEffect(false);
										}

										setTimeout(() => {
											if (_dropdownULRef.current) {
												_dropdownULRef.current.scrollTo({
													top: _dropdownULRef.current.scrollHeight,
													behavior: 'smooth',
												});
											}
										}, 100);
									}}
									onWhileTyping={() => {
										if (!isUserScrolling && _dropdownULRef.current) {
											_dropdownULRef.current.scrollTo({
												top: _dropdownULRef.current.scrollHeight,
												behavior: 'smooth',
											});
											setLastScrollTop(_dropdownULRef.current.scrollHeight);
										}
									}}
									showTypingEffect={isTypingAIAnswer}
								/>
							</Answer>
							{renderAIScreenFooter()}

							{showFeedbackComponent && (
								<div className={`${getClassName(innerClass, 'ai-feedback') || ''}`}>
									{' '}
									<AIFeedback
										overrideState={feedbackState}
										hideUI={isAIResponseLoading || isLoading || !sessionIdFromStore}
										key={sessionIdFromStore}
										onFeedbackSubmit={(useful, reason) => {
											setFeedbackState({
												isRecorded: true,
												feedbackType: useful ? 'positive' : 'negative',
											});
											trackUsefullness(sessionIdFromStore, {
												useful,
												reason,
											});
										}}
									/>
								</div>
							)}
						</Fragment>
					)}
				</Fragment>
			)}
			{renderError(true)}
		</SearchBoxAISection>
	);
};

AISection.propTypes = {
	showAIScreen: PropTypes.bool.isRequired,
	themePreset: PropTypes.string,
	renderAIAnswer: PropTypes.func,
	mergedAIQuestion: PropTypes.string,
	mergedAIAnswer: PropTypes.string,
	AIResponse: PropTypes.object,
	isAIResponseLoading: PropTypes.bool,
	isLoading: PropTypes.bool,
	getAISourceObjects: PropTypes.func.isRequired,
	AIResponseError: PropTypes.object,
	renderAIScreenLoader: PropTypes.func.isRequired,
	currentValue: PropTypes.string,
	prevPropsRefIsAITyping: PropTypes.object.isRequired,
	setShowAIScreenFooter: PropTypes.func.isRequired,
	AIUIConfig: PropTypes.object,
	showTypingEffect: PropTypes.bool.isRequired,
	setShowFeedbackComponent: PropTypes.func.isRequired,
	setShowTypingEffect: PropTypes.func.isRequired,
	_dropdownULRef: PropTypes.object.isRequired,
	isUserScrolling: PropTypes.bool.isRequired,
	setLastScrollTop: PropTypes.func.isRequired,
	renderAIScreenFooter: PropTypes.func.isRequired,
	showFeedbackComponent: PropTypes.bool.isRequired,
	innerClass: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
	feedbackState: PropTypes.object,
	sessionIdFromStore: PropTypes.string,
	setFeedbackState: PropTypes.func.isRequired,
	trackUsefullness: PropTypes.func.isRequired,
	renderError: PropTypes.func.isRequired,
	isTypingAIAnswer: PropTypes.bool.isRequired,
};

export default AISection;
