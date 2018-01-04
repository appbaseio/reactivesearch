import styled, { css } from 'react-emotion';

import { queries } from './mediaQueries';

const FilterContainer = styled.div`
	text-transform: capitalize;
	width: 330px;
	margin: 0 20px;
	${queries.medium`
		position: fixed;
		height: 100vh;
		background: #fafafa;
		margin: 0;
		width: 100%;
		padding: 20px;
		z-index: 3;
		margin-top: -25px;
	`};
	${({ visible }) =>
		!visible
		&& css`
			${queries.medium`
			display: none;
		`};
		`};
`;

export default FilterContainer;
