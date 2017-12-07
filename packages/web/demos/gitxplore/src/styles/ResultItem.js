import styled, { css } from "react-emotion";

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
	border: 1px solid #eee;
	flex-basis: 400px;
	max-width: 400px;
	min-height: 300px;
`;

export default ResultItem;
