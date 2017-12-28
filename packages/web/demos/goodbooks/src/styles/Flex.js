import styled, { css } from 'react-emotion';

import { queries } from './mediaQueries';

export const flex = css`
	display: flex;
`;

export const alignCenter = css`
	align-items: center;
`;

export const card = css`
	background: #fff;
	padding: 10px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

export const FlexChild = styled.div`
	${props =>
		props.flex
		&& css`
			flex: ${props.flex};
		`};
	${props =>
		props.marginLeft
		&& css`
			margin-left: ${props.marginLeft};
		`};
	${props =>
		props.margin
		&& css`
			margin: ${props.margin};
		`};
	${props => props.card && card};

	.range-label {
		color: white;
	}
`;

const Flex = styled.div`
	display: flex;

	${props =>
		props.justifyContent
		&& css`
			justify-content: ${props.justifyContent};
		`};

	${props =>
		props.responsive
		&& queries.small`
		flex-direction: column;
	`};

	${props =>
		props.direction
		&& css`
			flex-direction: ${props.direction};
		`};

	${props => props.alignCenter && alignCenter};
	${props =>
		props.flexWrap
		&& css`
			flex-wrap: wrap;
		`};
	${props =>
		props.hidden
		&& css`
			${queries.xLarge`
			display: none;
		`};
		`};
`;

export default Flex;
