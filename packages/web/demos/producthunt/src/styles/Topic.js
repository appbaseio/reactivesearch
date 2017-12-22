import styled, { css } from "react-emotion";

import color from "./theme";

const Topic = styled.div`
	background: #eee;
	margin: 5px;
	padding: 5px;
	font-size: 0.8rem;

	&:first-child {
		margin-left: 0;
	}

	${props => props.alt && css`
		background: none;
		width: 100px;
		border: 1px solid #eee;
		text-align: center;
	`};
`;

export default Topic;
