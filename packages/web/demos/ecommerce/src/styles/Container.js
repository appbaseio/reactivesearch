import styled, { css } from "react-emotion";

import { queries } from "./mediaQueries";

const Container = styled.section`
	width: 100%;
	height: 100%;
	min-height: 100vh;
	background-color: #fafafa;
`;

export const resultsContainer = css`
	.pagination {
		padding: 20px 0;
	}

	.card-image {
		background-size: cover;
	}
`;

export const categorySearchContainer = css`
	margin-left: 20px;
	${queries.small`
		margin-left: 0;
		width: 100%;
	`};
`;

export const appContainer = css`
	margin: 0 1rem;
	padding-top: 100px;
	${queries.small`
		padding-top: 140px;
	`};
`;

export default Container;
