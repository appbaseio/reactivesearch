import styled, { css } from "react-emotion";

import { queries } from "./mediaQueries";

const FilterContainer = styled.div`
	flex: 1;
	${({ visible }) => !visible && css`
		${queries.medium`
			display: none;
		`};
	`};
`;

export default FilterContainer;
