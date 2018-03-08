import styled, { css } from 'react-emotion';

import theme from './theme';

export const title = css`
	color: white;
	font-family: Pacifico, cursive;
	font-size: 2rem;
	text-align: center;
`;

const Navbar = styled.nav`
	background: ${theme.colors.secondaryColor};
	width: 100%;
	top: 0;
	padding: 1rem;
	position: fixed;
	z-index: 5;
`;

export default Navbar;
