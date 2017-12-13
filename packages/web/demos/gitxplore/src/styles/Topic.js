import styled from "react-emotion";

import color from "./theme";

const Topic = styled.div`
	background: ${color.secondaryColor};
	margin: 3px;
	padding: 4px;
	color: white;
	font-weight: bold;
	cursor: pointer;
	border-radius: 4px;

	&:hover {
		background: ${color.primaryColor};
	}
`;

export default Topic;
