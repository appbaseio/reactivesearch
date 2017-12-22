import styled, { css } from "react-emotion";

import color from "./theme";
import { queries } from "./mediaQueries";

export const title = css`
	color: ${color.primaryColor};
	font-family: Lato, sans-serif;
	font-size: 1.2rem;
	font-weight: bold;
	text-align: center;
	border: 1px solid ${color.primaryColor};
	padding: 3px 12px;
	border-left-width: 12px;

	${queries.large`
		font-size: 1rem;
	`};
`;

export const navbarContent = css`
	max-width: 1200px;
	margin: 0 auto;
`;

const Navbar = styled.nav`
	background: #fff;
	width: 100%;
	top: 0;
	padding: 1rem;
	position: fixed;
	z-index: 5;
	border-bottom: 1px solid #eee;
`;

export default Navbar;
