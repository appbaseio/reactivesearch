import styled, { css } from "react-emotion";

import color from "./theme";

export const title = css`
	color: white;
	font-family: Pacifico, cursive;
	font-size: 2rem;
	text-align: center;
`;

const Navbar = styled.nav`
	background: ${color.secondaryColor};
	width: 100%;
	top: 0;
	padding: 1rem;
	position: fixed;
	z-index: 2;
`;

export default Navbar;
