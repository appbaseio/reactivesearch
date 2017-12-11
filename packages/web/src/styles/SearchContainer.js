import styled, { css } from "react-emotion";

const SearchContainer = styled.div`
	display: flex;
	align-items: center;

	${props => props.showIcon && css`
		border: 1px solid #ccc;
	`};
`;

export default SearchContainer;
