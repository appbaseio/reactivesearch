import styled from "react-emotion";
import { css } from "emotion";

const leftLabel = css`
	flex-direction: row;
	align-items: center;
`;

const rightLabel = css`
	flex-direction: row-reverse;
	align-items: center;
`;

const topLabel = css`
	flex-direction: column;
	align-items: center;
`;

const bottomLabel = css`
	flex-direction: column-reverse;
	align-items: center;
`;

const Flex = styled("div")`
	display: ${props => props.inline ? "inline-flex" : "flex"};
	${props => (props.labelPosition === "left") && leftLabel}
	${props => (props.labelPosition === "right") && rightLabel}
	${props => (props.labelPosition === "top") && topLabel}
	${props => (props.labelPosition === "bottom") && bottomLabel}
`;

export default Flex;
