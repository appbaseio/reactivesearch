import styled, { css } from 'react-emotion';

import { queries } from './mediaQueries';
import theme from './theme';

export const title = css`
	color: ${theme.colors.primaryColor};
	font-family: Monoton, cursive;
	font-size: 2rem;
	text-align: center;

	${queries.xLarge`
		text-align: left;
	`};
	${queries.medium`
		text-align: center;
		margin-bottom: 50px;
	`};
`;

const Navbar = styled.nav`
	background: ${theme.colors.secondaryColor};
	left: 0;
	width: 400px;
	padding: 1rem;
	height: 100vh;
	position: fixed;
	z-index: 3;

	${({ full }) => queries.xLarge`
		width: 100%;
		height: ${full ? '100vh' : 'auto'};
		display: flex;
		flex-direction: column;
	`};
`;

export default Navbar;
