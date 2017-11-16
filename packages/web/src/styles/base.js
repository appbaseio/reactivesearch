import { css } from "emotion";
import theme from "./theme";

const base = css`
	font-family: ${theme.fontFamily};
	font-size: ${theme.fontSize};

	*, *:before, *:after {
		box-sizing: border-box;
	}
`;

export {
	base
}
