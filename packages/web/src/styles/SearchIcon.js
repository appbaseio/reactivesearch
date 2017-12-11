import styled, { css } from "react-emotion";

const leftPosition = css`
	order: -1;
	padding-left: 8px;
`;

const rightPosition = css`
	order: 1;
	padding-right: 8px;
`;

const SearchIcon = styled.svg`
	${props => props.iconPosition === "left" ? leftPosition : rightPosition};
`;

export default SearchIcon;
