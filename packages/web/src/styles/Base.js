import { css } from "emotion";
import styled from "react-emotion";
import { lighten } from "polished";

const Base = styled("div")`
	font-family: ${props => props.theme.fontFamily};
	font-size: ${props => props.theme.fontSize};

	*, *:before, *:after {
		box-sizing: border-box;
	}
`;

export default Base;
