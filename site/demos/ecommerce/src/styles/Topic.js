import styled, { css } from 'react-emotion';

import theme from './theme';

export const price = css`
	color: #fff;
	position: absolute;
	top: 0;
	right: 0;
	padding: 10px;
	font-size: 1.3rem;
	background: ${theme.colors.secondaryColor};
`;

const Topic = styled.div`
	background: ${theme.colors.lightGray};
	margin: 3px;
	padding: 3px;
	color: ${theme.colors.secondaryColor};
	font-weight: bold;
	border-radius: 4px;
`;

export default Topic;
