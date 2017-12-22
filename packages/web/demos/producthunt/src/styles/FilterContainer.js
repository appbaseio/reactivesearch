import styled, { css } from "react-emotion";

import { queries } from "./mediaQueries";

const FilterContainer = styled.div`
	width: 330px;
	margin: 0 20px;
	${queries.medium`
		width: 100%;
	`};
	${({ visible }) =>
		!visible &&
		css`
			${queries.medium`
			display: none;
		`};
		`};
`;

export default FilterContainer;
