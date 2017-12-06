import styled from "react-emotion";

import { flex, alignCenter } from "./Flex";

const Navbar = styled.nav`
	background: coral;
	color: #fff;
	padding: 1rem;
	font-weight: bold;

	${flex};
	${alignCenter};
`;

export default Navbar;
