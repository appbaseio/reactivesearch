import styled from "react-emotion";

const Select = styled("button")`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-height: 42px;
	border-radius: 0;
	outline: none;
	padding: 5px 12px;
	font-size: 0.9rem;
	line-height: 1.2rem;
	background-color: #fff;
	border: 1px solid #ccc;
	color: #424242;
	cursor: pointer;
	user-select: none;
	transition: all 0.3s ease;

	& > div {
		width: calc(100% - 24px);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: left;
	}

	&:hover,
	&:focus {
		background-color: #fcfcfc;
	}
`;

const Tick = styled("span")`
	width: 16px;
	height: 16px;
	display: inline-block;
	position: relative;
	user-select: none;
	align-items: center;

	&::after {
		box-sizing: content-box;
		content: "";
		position: absolute;
		background-color: transparent;
		top: 50%;
		left: 0;
		width: 8px;
		height: 4px;
		margin-top: -4px;
		border-style: solid;
		border-color: ${props => props.theme.primaryColor};
		border-width: 0 0 2px 2px;
		border-radius: 0;
		border-image: none;
		transform: rotate(-45deg) scale(1);
		transition: all 200ms ease-out;
	}
`;

export default Select;
export { Tick };
