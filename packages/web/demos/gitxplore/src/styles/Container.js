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
	position: fixed;
	${resultsContainer};

	${queries.xLarge`
		margin-top: 20px;
		width: calc(100% - 280px);
		right: 20px;
	`};
	${queries.medium`
		width: 100%;
		right: auto;
		padding: 0 30px;
		margin-top: 65px;
	`};
`;

export const appContainer = css`
	${queries.xLarge`
		flex-direction: column;
	`};
`;

export default Container;
