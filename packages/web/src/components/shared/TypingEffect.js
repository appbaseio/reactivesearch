import types from '@appbaseio/reactivecore/lib/utils/types';
import React, { useState, useEffect } from 'react';

const TypingEffect = ({
	message, speed, eraseSpeed = 50, shouldErase = false,
}) => {
	const [currentMessage, setCurrentMessage] = useState('');
	const [typing, setTyping] = useState(true);

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
				}
			}, speed);
		}
		return () => clearTimeout(timer);
	}, [currentMessage, message, speed, typing, eraseSpeed, shouldErase]);

	useEffect(() => {
		if (message !== currentMessage) {
			setCurrentMessage('');
			setTyping(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [message]);
	const typingIndicator = `<span style={{ visibility: ${
		typing ? 'visible' : 'hidden'
	} }}>|</span>`;

	return (
		<div
			className="--typing-effect-message"
			dangerouslySetInnerHTML={{
				__html: currentMessage + typingIndicator,
			}}
		/>
	);
};

TypingEffect.propTypes = {
	message: types.string,
	speed: types.number,
	eraseSpeed: types.number,
	shouldErase: types.bool,
};

export default TypingEffect;
