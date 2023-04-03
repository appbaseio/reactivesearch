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

export const SearchBoxAISection = styled('div')`
	padding: 10px;
	border-radius: 4px;
	margin-bottom: 5px;
`;

export const Question = styled.div`
	font-weight: bold;
	margin-bottom: 5px;
	animation: ${fadeInFromBottom} 0.5s ease-out;
`;

export const Answer = styled.div`
	position: relative;
	overflow: hidden;
	white-space: pre-wrap;
	margin-bottom: 5px;

	${props => resetCSS(props)}
`;

export const Footer = styled.div`
	color: #777;
	display: inline-flex;
	align-items: center;
	gap: 1rem;
	flex-wrap: wrap;
`;

export const SourceTags = styled.div`
	display: flex;
	gap: 8px;

	span {
		font-weight: 300;
		padding: 5px;
		border: 1px solid blue;
		cursor: default;
		border-radius: 4px;
	}
`;
