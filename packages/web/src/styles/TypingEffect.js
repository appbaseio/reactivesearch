import styled from '@emotion/styled';

export const TypingEffectContainer = styled.div`
	display: flex;
	align-items: flex-start;
	margin: 1rem auto;
	width: max-content;
`;

export const TypingEffectAvatar = styled.div`
	flex-shrink: 0;
	margin-right: 10px;
	margin-top: 2px;
	background: white;
	border-radius: 50%;
	overflow: hidden;
`;

export const AvatarImage = styled.img`
	width: 40px;
	height: 40px;
	border-radius: 50%;
`;

export const TypingEffectMessage = styled.div`
	background-color: #ffffff;
	border-radius: 20px;
	padding: 10px 15px;
	font-size: 16px;
	line-height: 1.4;
	position: relative;
	width: min(100vw, 500px);
	max-width: 90%;
	box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.12);
	min-height: 75px;
	overflow: auto;
`;
