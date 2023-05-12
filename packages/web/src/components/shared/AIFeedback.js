import React, { useEffect, useState } from 'react';
import { bool, func, object } from 'prop-types';

import ThumbsUpSvg from './ThumbsUpSvg';
import ThumbsDownSvg from './ThumbsDownSvg';
import Input from '../../styles/Input';
import { AIFeedbackContainer } from '../../styles/AIAnswer';
import Button from '../../styles/Button';

const AIFeedback = ({ onFeedbackSubmit, hideUI, overrideState = {} }) => {
	const [showInput, setShowInput] = useState(false);
	const [feedbackType, setFeedbackType] = useState(null);
	const [feedbackText, setFeedbackText] = useState('');
	const [feedbackRecorded, setFeedbackRecorded] = useState(false);

	const handleButtonClick = (type) => {
		if (feedbackType === type) {
			setFeedbackType(null);
			setShowInput(false);
		} else {
			setFeedbackType(type);
			setShowInput(true);
		}
	};

	const handleInputChange = (e) => {
		setFeedbackText(e.target.value);
	};

	const handleSubmit = () => {
		onFeedbackSubmit(feedbackType === 'positive', feedbackText);

		// setFeedbackType(null);
		setFeedbackText('');
		setShowInput(false);
		setFeedbackRecorded(true);
	};
	const handleCancel = () => {
		setFeedbackType(null);
		setFeedbackText('');
		setShowInput(false);
	};

	useEffect(() => {
		if (overrideState && overrideState.isRecorded) {
			setFeedbackRecorded(true);
			setFeedbackType(overrideState.feedbackType || 'positive');
		}
	}, [overrideState]);

	if (hideUI) {
		return null;
	}
	if (feedbackRecorded) {
		return (
			<AIFeedbackContainer>
				<div className="--feedback-svgs-wrapper">
					{feedbackType === 'positive' ? (
						<ThumbsUpSvg className="selected" />
					) : (
						<ThumbsDownSvg className="selected" />
					)}
				</div>
			</AIFeedbackContainer>
		);
	}
	return (
		<AIFeedbackContainer>
			{!showInput && (
				<div className="--feedback-svgs-wrapper">
					<ThumbsUpSvg
						className={feedbackType === 'positive' ? 'selected' : ''}
						onClick={() => handleButtonClick('positive')}
					/>

					<ThumbsDownSvg
						className={feedbackType === 'negative' ? 'selected' : ''}
						onClick={() => handleButtonClick('negative')}
					/>
				</div>
			)}

			{showInput && (
				<div className="--feedback-input-wrapper">
					<Input
						show={showInput}
						placeholder={
							feedbackType === 'positive'
								? 'What do you like about the response?'
								: 'What was the issue with the response? How can it be improved?'
						}
						value={feedbackText}
						onChange={handleInputChange}
					/>
					<Button primary onClick={handleSubmit}>
						Submit
					</Button>
					<Button onClick={handleCancel}>Cancel</Button>
				</div>
			)}
		</AIFeedbackContainer>
	);
};

AIFeedback.propTypes = {
	onFeedbackSubmit: func,
	hideUI: bool,
	// eslint-disable-next-line react/forbid-prop-types
	overrideState: object,
};

export default React.memo(AIFeedback);
