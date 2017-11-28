import styled from "react-emotion";

const Base = styled("div")`
	font-family: ${props => props.theme.fontFamily};
	font-size: ${props => props.theme.fontSize};

	*, *:before, *:after {
		box-sizing: border-box;
	}
`;

export default Base;
