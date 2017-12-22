import styled, { css } from 'react-emotion';

import { queries } from './mediaQueries';

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
	${props => props.marginLeft && css`
		margin-left: ${props.marginLeft};
	`};
	${props => props.margin && css`
		margin: ${props.margin};
	`};

	.range-label {
		color: white;
	}
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

	${props => props.alignCenter && alignCenter};
	${props => props.flexWrap && css`
		flex-wrap: wrap;
	`};
	${props => props.hidden && css`
		${queries.xLarge`
			display: none;
		`};
	`};
`;

export default Flex;
