import styled, { css } from 'react-emotion';

import color from './theme';

export const title = css`
	color: white;
	font-family: Poiret One, cursive;
	font-size: 2rem;
	text-align: center;
	padding: 3px 12px;
`;

export const navbarContent = css`
	max-width: 1200px;
	margin: 0 auto;
`;

const Navbar = styled.nav`
	background: ${color.primaryColor};
	width: 100%;
	top: 0;
	padding: 1rem;
	position: fixed;
	z-index: 5;
	box-shadow: 0 3px 5px rgba(0,0,0,0.12), 0 3px 5px rgba(0,0,0,0.24);
`;

export default Navbar;
