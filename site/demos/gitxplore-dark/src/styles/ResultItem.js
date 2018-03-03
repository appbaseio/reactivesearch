import styled, { css } from 'react-emotion';

import { queries } from './mediaQueries';

export const resultItemDetails = css`
	color: #a2a2a2;
	position: relative;

	div:not(:first-child) {
		border-left: 1px solid #eee;
	}
`;

export const resultListContainer = css`
	margin-top: 60px;

	${queries.xLarge`
		margin-top: 170px;
	`};
	${queries.medium`
		margin-top: 220px;
	`};

	.result-list-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.result-list-pagination {
		margin: 40px 0 50px;
	}

	.result-list-info {
		margin: 1rem;
		justify-content: space-between;
	}

	.powered-by {
		margin: 0 20px 20px 0;
	}
`;

export const resultCardHeader = css`
	${queries.xxLarge`
		flex-direction: column;

		div {
			justify-content: center;
			margin-top: 5px;
		}
	`};
`;

const ResultItem = styled.div`
	padding: 20px 0;
	margin: 15px;
	padding: 25px;
	border: 1px solid #fafafa;
	flex-basis: 400px;
	max-width: 400px;
	min-height: 300px;
	box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
	transition: all 0.3s cubic-bezier(.25,.8,.25,1);
	font-size: 14px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	background: #fafafa;

	${queries.xxLarge`
		flex-basis: 350px;
		max-width: 350px;
	`};

	&:hover {
		box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
	}
`;

export default ResultItem;
