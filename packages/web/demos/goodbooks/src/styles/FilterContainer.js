import styled, { css } from 'react-emotion';

import { queries } from './mediaQueries';

const FilterContainer = styled.div`
	text-transform: capitalize;
	width: 330px;
	margin: 0 20px;
	position: fixed;
	${queries.large`
		height: 100vh;
		background: #fafafa;
		margin: 0;
		width: 100%;
		padding: 20px;
		z-index: 3;
		margin-top: -25px;
	`};
	${queries.medium`
		overflow-y: auto;
		max-height: calc(100vh - 80px);
		margin-top: -20px;
	`};
	${({ visible }) =>
		!visible
		&& css`
			${queries.large`
			display: none;
		`};
		`};
`;

export default FilterContainer;
