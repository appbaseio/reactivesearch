import styled from "react-emotion";
import { transitions } from "polished";

const Select = styled("a")`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-height: 42px;
	word-wrap: break-word;
	padding: 5px 12px;
	line-height: 1.2rem;
	background-color: #fff;
	border: 1px solid #ccc;
	color: #424242;
	cursor: pointer;
	user-select: none;
	${transitions("all 0.3s ease")};

	&:hover, &:focus {
		background-color: #fcfcfc;
	}
`;

export default Select;
