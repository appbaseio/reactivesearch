import styled, { css } from 'react-emotion';

export const bookHeader = css`
	font-weight: bold;
	margin-bottom: 5px;
`;

export const authorsList = css`
	font-weight: bold;
	margin-bottom: 5px;
`;

export const avgRating = css`
	color: #6b6b6b;
	margin-left: 5px;
`;

const ResultItem = styled.article`
	display: flex;
	background: white;
	margin: 10px 0;
	box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);

	img {
		height: 160px;
		width: 120px;
		background-size: cover;
	}
`;

export default ResultItem;
