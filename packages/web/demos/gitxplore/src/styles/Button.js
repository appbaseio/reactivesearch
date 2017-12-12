import styled from "react-emotion";

import color from "./theme";

const Button = styled.div`
	cursor: pointer;
	background: ${color.lightGray};
	padding: 5px;
	margin: 5px;
	min-width: 70px;
	text-align: center;

	svg {
		margin-right: 4px;
	}

	&:hover {
		background: ${color.primaryColor};
		color: white;
	}
`;

export default Button;
