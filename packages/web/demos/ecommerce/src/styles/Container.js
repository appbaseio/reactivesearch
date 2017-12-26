import styled, { css } from 'react-emotion';

import { queries } from './mediaQueries';

const Container = styled.section`
	width: 100%;
	height: 100%;
	min-height: 100vh;
	background-color: #fafafa;
`;

export const resultsContainer = css`
	width: calc(100% - 360px);
	.pagination {
		padding: 20px 0;
	}

	.card-image {
		background-size: cover;
	}

	.card-item {
		position: relative;
		${queries.small`
			height: 250px;
			width: 100%;
			margin: 5px 0;
		`}
	}

	${queries.large`
		width: 100%;
	`};
`;

export const categorySearchContainer = css`
	margin-left: 20px;
	width: calc(100% - 350px);
	${queries.medium`
		margin-left: 0;
		width: 100%;
	`};
`;

export const appContainer = css`
	margin: 0 1rem;
	padding-top: 100px;
	${queries.large`
		padding-top: 85px;
	`};
	${queries.medium`
		padding-top: 130px;
	`};
`;

export default Container;
