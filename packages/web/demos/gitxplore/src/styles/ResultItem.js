import styled, { css } from "react-emotion";

export const resultItemDetails = css`
	color: #a2a2a2;
	position: relative;

	div:not(:first-child) {
		border-left: 1px solid #eee;
	}
`;

export const resultListContainer = css`
	.result-list-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
`;

const ResultItem = styled.div`
	padding: 20px 0;
	margin: 15px;
	padding: 25px;
	border: 1px solid #eee;
	flex-basis: 400px;
	max-width: 400px;
	min-height: 300px;
	box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
	transition: all 0.3s cubic-bezier(.25,.8,.25,1);

	&:hover {
		box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
	}
`;

export default ResultItem;
