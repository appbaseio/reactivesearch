import styled, { css } from 'react-emotion';

import { queries } from './mediaQueries';

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

export const dataSearchContainer = css`
	position: fixed;
	z-index: 3;
	${resultsContainer};

	${queries.xLarge`
		margin-top: 20px;
		width: calc(100% - 280px);
		right: 20px;

		.search-input {
			height: 42px;
		}
	`};
	${queries.medium`
		width: 100%;
		right: auto;
		padding: 0 30px;
		margin-top: 65px;
	`};
`;

export const filtersContainer = css`
	max-height: calc(100vh - 100px);
	overflow-y: auto;
	height: 100%;
`;

export const appContainer = css`
	${queries.xLarge`
		flex-direction: column;
	`};
`;

export default Container;
