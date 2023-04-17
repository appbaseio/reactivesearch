import React, { useState } from 'react';
import { func } from 'prop-types';

import ThumbsUpSvg from './ThumbsUpSvg';
import ThumbsDownSvg from './ThumbsDownSvg';
import Input from '../../styles/Input';
import { AIFeedbackContainer } from '../../styles/AIAnswer';
import Button from '../../styles/Button';

const FeedbackComponent = ({ onFeedbackSubmit }) => {
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
	if (feedbackRecorded) {
		return (
			<AIFeedbackContainer>
				<div className="--feedback-svgs-wrapper">
					{feedbackType === 'positive' ? (
						<ThumbsUpSvg
							className="selected"
							onClick={() => handleButtonClick('positive')}
						/>
					) : (
						<ThumbsDownSvg
							className="selected"
							onClick={() => handleButtonClick('negative')}
						/>
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

FeedbackComponent.propTypes = {
	onFeedbackSubmit: func,
};

export default FeedbackComponent;
