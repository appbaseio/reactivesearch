import { css } from "emotion";
import styled from "react-emotion";
import { darken, transitions } from "polished";

import theme from "./theme";

const pagination = css`
	margin: 10px -3px;
	text-align: center;
`;

const primary = css`
	background-color: ${theme.primaryColor};
	color: ${theme.primaryTextColor};

	&:hover, &:focus {
		background-color: ${darken(0.1, theme.primaryColor)};
	}
`;

const disabled = css`
	background-color: #fafafa;
	color: #ccc
	cursor: not-allowed;

	&:hover, &:focus {
		background-color: #fafafa;
	}
`;

const Button = styled("a")`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	border-radius: 3px;
	height: 30px;
	padding: 0 12px;
	background-color: #eee;
	color: #424242;
	cursor: pointer;
	user-select: none;
	${transitions("all 0.3s ease")}

	&:hover, &:focus {
		background-color: #ccc;
	}

	${props => props.primary ? primary : null}
	${props => props.disabled ? disabled : null}

	${pagination} & {
		margin: 0 3px;
	}
`;

export { pagination };
export default Button;
