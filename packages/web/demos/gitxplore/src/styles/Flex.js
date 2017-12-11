import styled, { css } from "react-emotion";

import { queries } from "./mediaQueries";

export const flex = css`
	display: flex;
`;

export const alignCenter = css`
	align-items: center;
`;

export const FlexChild = styled.div`
	${props => props.flex && css`
		flex: ${props.flex};
	`};
	margin: ${props => props.margin || 0};
`;

const Flex = styled.div`
	display: flex;

	${props => props.justifyContent && css`
		justify-content: ${props.justifyContent};
	`};

	${props => props.responsive && queries.small`
		flex-direction: column;
	`};

	${props => props.direction && css`
		flex-direction: ${props.direction};
	`};
`;

export default Flex;
