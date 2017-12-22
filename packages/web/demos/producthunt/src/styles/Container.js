import styled, { css } from "react-emotion";

import { queries } from "./mediaQueries";

const Container = styled.section`
	width: 100%;
	height: 100%;
	min-height: 100vh;
	background-color: #fafafa;
`;

export const resultsContainer = css`
	width: calc(100% - 360px);
	.card-image {
		background-size: cover;
	}

	.card-item {
		position: relative;
		${queries.small`
			height: 250px;
			width: 100%;
			margin: 5px 0;
		`};
	}

	${queries.medium`
		width: 100%;
	`};
`;

export const dataSearchContainer = css`
	width: 100%;
	max-width: 600px;
	${queries.medium`
		margin-top: 10px;
	`};
`;

export const appContainer = css`
	margin: 0 auto;
	padding-top: 100px;
	max-width: 1100px;1
	${queries.medium`
		padding-top: 130px;
	`};
`;

export default Container;
