import styled, { css } from "react-emotion";

import { queries } from "./mediaQueries";

const Container = styled.section`
	width: 100%;
	height: 100vh;
`;

export const resultsContainer = css`
	width: calc(100% - 400px);

	${queries.xLarge`
		width: 100%;
	`};
`;

export const categorySearchContainer = css`
	margin-left: 20px;
	${queries.small`
		margin-left: 0;
		width: 100%;
	`};
`;

export const appContainer = css`
	margin: 100px 1rem 0;
	${queries.small`
		margin-top: 140px;
	`};
`;

export default Container;
