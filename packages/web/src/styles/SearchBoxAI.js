import { keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import { resetCSS } from './AIAnswer';

const fadeInFromBottom = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInFromTop = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const SearchBoxAISection = styled('div')`
	padding: 10px;
	border-radius: 4px;
	min-height: 200px;
	padding-top: 20px;
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background-color: ${({ themePreset, theme }) =>
	(themePreset === 'dark' ? '#424242' : theme.colors.backgroundColor)};
	color: ${({ theme }) => theme.colors.textColor};

	.--ai-answer-error-container {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		.--default-error-element {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 10px;
		}
	}
`;

export const Question = styled.div`
	font-weight: bold;
	margin-bottom: 5px;
	animation: ${fadeInFromTop} 0.5s ease-out;
`;

export const Answer = styled.div`
	${props => resetCSS(props)}
	position: relative;
	margin-bottom: 5px;
	min-height: 100px;
	overflow: auto;
	white-space: pre-wrap;
	pre {
		white-space: pre-wrap;
	}
	code,
	pre {
		display: revert;
	}
`;

export const Footer = styled.div`
	color: #777;
	display: inline-flex;
	align-items: center;
	gap: 1rem;
	flex-wrap: wrap;
	animation: ${fadeInFromBottom} 0.5s ease-out;
	padding: 10px 0;
	background: white;
	background-color: ${({ themePreset, theme }) =>
	(themePreset === 'dark' ? '#424242' : theme.colors.backgroundColor)};
	color: ${({ theme }) => theme.colors.textColor};
`;

export const SourceTags = styled.div`
	display: flex;
	gap: 8px;
	flex-wrap: wrap;

	.--ai-source-tag {
		display: inline-block;
		max-width: 200px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
`;
