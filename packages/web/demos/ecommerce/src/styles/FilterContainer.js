import styled, { css } from "react-emotion";

import { queries } from "./mediaQueries";

const FilterContainer = styled.div`
	width: 330px;
	left: 0;
	padding-left: 10px;
	max-height: calc(100vh - 120px);
	overflow-y: auto;
	position: fixed;
	background: #fafafa;
	z-index: 2;
	${queries.medium`
		width: 100%;
		padding-right: 10px;
	`};
	${({ visible }) => !visible && css`
		${queries.medium`
			display: none;
		`};
	`};
`;

export default FilterContainer;
