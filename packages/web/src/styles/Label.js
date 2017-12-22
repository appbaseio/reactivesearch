import { css } from "emotion";
import styled from "react-emotion";

const left = css`
	left: 0;
	margin-left: 3px;
`;

const right = css`
	right: 0;
	margin-right: 3px;
`;

const Label = styled("div")`
	position: absolute;
	top: -25px;

	${props => props.align === "left" && left}
	${props => props.align === "right" && right}
`;

export const rangeLabelsContainer = css`
	position: relative;
`;

export default Label;
