import styled, { css } from 'react-emotion';

export const resultItemDetails = css`
	color: #a2a2a2;
	position: relative;

	div:not(:first-child) {
		border-left: 1px solid #eee;
	}
`;

const ResultItem = styled.div`
	padding: 20px 0;
	margin: -1px 1rem 0 1rem;
	border-top: 1px solid #eee;
	border-bottom: 1px solid #eee;

	&:first-child {
		border-top: none;
	}

	&:last-child {
		border-bottom: none;
	}
`;

export default ResultItem;
