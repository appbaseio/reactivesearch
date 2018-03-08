import styled, { css } from 'react-emotion';

import { card } from './Flex';
import { queries } from './mediaQueries';
import theme from './theme';

const button = css`
	cursor: pointer;
	padding: 5px;
	margin: 5px;
	text-align: center;
	border-radius: 25px;
`;

export const ToggleButton = styled.div`
	${button};
	${card};
	display: none;
	color: white;
	width: 200px;
	font-size: 1.1rem;
	font-weight: bold;
	padding: 10px;
	position: fixed;
	bottom: 4rem;
	left: calc(50% - 100px);
	margin: 0 auto;
	transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
	z-index: 4;
	background: ${theme.colors.primaryColor};

	&:hover {
		background: ${theme.colors.secondaryColor};
		box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
	}

	${queries.medium`
		display: block;
	`};
`;

const Button = styled.div`
	${button};
	background: ${theme.colors.lightGray};
	min-width: 70px;

	svg {
		margin-right: 4px;
	}

	&:hover {
		background: ${theme.colors.primaryColor};
		color: white;
	}
`;

export default Button;
