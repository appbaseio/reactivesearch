import { css } from "emotion";
import styled from "react-emotion";
import { transitions } from "polished";

const open = css`
	top: 0.45em;
	transform: rotate(-45deg);
`;

const Chevron = styled("span")`
	&::before {
		content: "";
		border-style: solid;
		border-width: 0.15em 0.15em 0 0;
		display: inline-block;
		height: 0.45em;
		left: 0.15em;
		position: relative;
		top: 0.25em;
		transform: rotate(135deg);
		vertical-align: top;
		width: 0.45em;

		${props => props.open ? open : null}
	}
`;

export default Chevron;
