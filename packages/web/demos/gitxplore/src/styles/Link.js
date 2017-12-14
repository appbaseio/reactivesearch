import styled from "react-emotion";

import color from "./theme";

const Link = styled.a`
	cursor: pointer;
	color: ${color.secondaryColor};
	text-decoration: none;
	font-weight: bold;
	margin-left: 20px;
	font-size: 1.2rem;

	&:hover {
		color: ${color.primaryColor};
	}
`;

export default Link;
