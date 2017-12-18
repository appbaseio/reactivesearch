import styled, { css } from "react-emotion";

import { queries } from "./mediaQueries";
import color from "./theme";

export const title = css`
	color: white;
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
	background: ${color.secondaryColor};
	left: 0;
	width: 400px;
	padding: 1rem;
	height: 100vh;
	position: fixed;

	${({ full }) => queries.xLarge`
		width: 100%;
		height: ${full ? "100vh" : "auto"};
		display: flex;
		flex-direction: column;
	`};
`;

export default Navbar;
