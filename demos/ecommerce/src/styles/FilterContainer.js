import styled, { css } from 'react-emotion';

import { queries } from './mediaQueries';

const FilterContainer = styled.div`
	width: 330px;
	left: 0;
	padding-left: 10px;
	max-height: calc(100vh - 120px);
	overflow-y: auto;
	position: fixed;
	background: #fafafa;
	z-index: 2;
	.list {
		max-height: 140px;
	}
	${queries.large`
		width: 100%;
		min-height: 100vh;
		padding-right: 10px;
	`};
	${queries.medium`
		min-height: auto;
	`};
	${({ visible }) => !visible && css`
		${queries.large`
			display: none;
		`};
	`};
`;

export default FilterContainer;
