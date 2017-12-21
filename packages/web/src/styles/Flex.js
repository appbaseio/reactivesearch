import styled from "react-emotion";
import { css } from "emotion";
import lighten from "polished/lib/color/lighten";

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

const border = css`
	border: 1px solid #ccc;
`;

const Flex = styled("div")`
	display: ${props => (props.inline ? "inline-flex" : "flex")};
	${props => (props.labelPosition === "left" || props.iconPosition === "right") && leftLabel};
	${props => (props.labelPosition === "right" || props.iconPosition === "left") && rightLabel};
	${props => props.labelPosition === "top" && topLabel};
	${props => props.labelPosition === "bottom" && bottomLabel};
	${props => props.showBorder && border};

	${props =>
		props.justifyContent &&
		css`
			justify-content: ${props.justifyContent};
		`};
	${props =>
		props.alignItems &&
		css`
			align-items: ${props.alignItems};
		`};

	${props =>
		props.flex &&
		css`
			flex: ${props.flex};
		`};
	${props =>
		props.direction &&
		css`
			flex-direction: ${props.direction};
		`};
	${props =>
		props.basis &&
		css`
			flex-basis: ${props.basis};
		`};

	svg.search-icon {
		fill: ${props => props.theme.primaryColor};
		flex-basis: 30px;
	}

	svg.cancel-icon {
		cursor: pointer;
		fill: ${props => lighten(0.3, props.theme.textColor)};
		flex-basis: 30px;

		&:hover {
			fill: ${props => props.theme.textColor};
		}
	}
`;

export default Flex;
