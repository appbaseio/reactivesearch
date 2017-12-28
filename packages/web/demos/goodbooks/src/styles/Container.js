import styled, { css } from 'react-emotion';

import { queries } from './mediaQueries';

const Container = styled.section`
	@import url('https://fonts.googleapis.com/css?family=Poiret+One|Roboto');
	width: 100%;
	height: 100%;
	min-height: 100vh;
	background-color: #fafafa;
`;

export const resultsContainer = css`
	width: calc(100% - 360px);
	margin: 0 10px;
	margin-left: 380px;

	.list-item {
		margin: 5px 0;
		border: 1px solid #eee;
		padding: 20px;
	}

	${queries.large`
		margin-left: 10px;
		margin-top: 10px;
		width: 100%;
	`};
`;

export const dataSearchContainer = css`
	width: 100%;
	max-width: 600px;
	${queries.large`
		margin-left: 10px;
	`};
	${queries.small`
		margin-left: 0;
		margin-top: 10px;
	`};
`;

export const appContainer = css`
	margin: 0 auto;
	padding-top: 100px;
	max-width: 1100px;
	${queries.small`
		padding-top: 130px;
	`};
`;

export default Container;
