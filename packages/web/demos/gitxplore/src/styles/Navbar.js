import styled, { css } from "react-emotion";

import color from "./theme";

export const title = css`
	color: white;
	font-family: Monoton, cursive;
	font-size: 2rem;
	text-align: center;
`;

const Navbar = styled.nav`
	background: ${color.secondaryColor};
	padding: 1rem;
	height: 100vh;
`;

export default Navbar;
