import { css } from "emotion";
import styled from "react-emotion";

const alertBorder = ({ theme }) => css`
	border: 1px solid ${theme.alertColor};
`;

const Input = styled("input")`
	width: 100%;
	height: 42px;
	padding: 8px;
	border: 1px solid #ccc;
	background-color: #fff;
	font-size: 0.9rem;
	outline: none;

	${props => props.showIcon && css`
		border: none;
		flex: 1;
	`};

	${props => props.alert && alertBorder};
`;

const suggestions = css`
	display: block;
	width: 100%;
	border: 1px solid #ccc;
	background-color: #fff;
	font-size: 0.9rem;
	z-index: 3;
	position: absolute;
	top: 41px;

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
		max-height: 260px;
		overflow-y: auto;

		li {
			display: flex;
			justify-content: space-between;
			cursor: pointer;
			padding: 10px;
			user-select: none;

			&:hover, &:focus {
				background-color: #eee;
			}
		}
	}
`;

const suggestionsContainer = css`
	position: relative;
`;

export default Input;
export { suggestionsContainer, suggestions };
