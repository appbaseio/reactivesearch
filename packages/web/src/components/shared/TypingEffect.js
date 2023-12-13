import types from '@appbaseio/reactivecore/lib/utils/types';
import React, { useState, useEffect } from 'react';

const TypingEffect = ({
	message,
	speed,
	eraseSpeed = 50,
	shouldErase = false,
	onTypingComplete = () => {},
	showTypingIndicator = false,
	onWhileTyping = () => {},
	onWhileTypingDelay = 1500,
	showTypingEffect = true,
}) => {
	const [currentMessage, setCurrentMessage] = useState('');
	const [typing, setTyping] = useState(true);
	const [executeOnWhileTyping, setExecuteOnWhileTyping] = useState(false);

	useEffect(() => {
		let timer;
		if (typing) {
			timer = setTimeout(() => {
				setCurrentMessage(message.slice(0, currentMessage.length + 1));
				if (currentMessage.length === message.length) {
					setTyping(false);
					if (shouldErase) {
						setTimeout(() => {
							setTyping(true);
							setCurrentMessage('');
						}, eraseSpeed);
					}
					onTypingComplete();
				}
			}, speed);
		}
		return () => clearTimeout(timer);
	}, [currentMessage, message, speed, typing, eraseSpeed, shouldErase]);

	useEffect(() => {
		if (message !== currentMessage) {
			if (showTypingEffect) {
				setCurrentMessage('');
				setTyping(true);
			} else {
				setCurrentMessage(message);
			}
		}
	}, [message]);

	useEffect(() => {
		if (executeOnWhileTyping && (typing || !showTypingEffect)) {
			onWhileTyping();
			setExecuteOnWhileTyping(false);
		}
		const timer = setTimeout(() => {
			setExecuteOnWhileTyping(true);
		}, onWhileTypingDelay);

		return () => clearTimeout(timer);
	}, [executeOnWhileTyping, typing]);

	const typingIndicator = `<span style={{ visibility: ${
		typing ? 'visible' : 'hidden'
	} }}>|</span>`;

	return (
		<div
			className="--typing-effect-message"
			dangerouslySetInnerHTML={{
				__html: currentMessage + (showTypingIndicator ? typingIndicator : ''),
			}}
		/>
	);
};

TypingEffect.propTypes = {
	message: types.string,
	speed: types.number,
	eraseSpeed: types.number,
	shouldErase: types.bool,
	onTypingComplete: types.func,
	showTypingIndicator: types.bool,
	onWhileTyping: types.func,
	onWhileTypingDelay: types.number,
	showTypingEffect: types.bool,
};

export default React.memo(TypingEffect);
