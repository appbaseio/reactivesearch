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
	padding: 5px;
`;

const Flex = styled.div`
	display: flex;

	${props => props.justifyContent && css`
		justify-content: ${props.justifyContent}
	`};

	${props => props.responsive && queries.small`
		flex-direction: column;
	`};
`;

export default Flex;
