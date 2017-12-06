import styled from "react-emotion";

import { flex, alignCenter } from "./Flex";

const Navbar = styled.nav`
	background: #f60;
	color: #fff;
	padding: 1rem;
	font-weight: bold;

	${flex};
	${alignCenter};
`;

export default Navbar;
