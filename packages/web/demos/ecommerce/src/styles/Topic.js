import styled, { css } from "react-emotion";

import color from "./theme";

export const price = css`
	color: #fff;
	position: absolute;
	top: 0;
	right: 0;
	padding: 10px;
	font-size: 1.3rem;
	background: ${color.secondaryColor};
`

const Topic = styled.div`
	background: ${color.lightGray};
	margin: 3px;
	padding: 3px;
	color: ${color.secondaryColor};
	font-weight: bold;
	border-radius: 4px;
`;

export default Topic;
