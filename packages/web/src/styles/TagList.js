import styled from "react-emotion";

const TagList = styled("div")`
	display: flex;
    flex-wrap: wrap;
    align-items: center;
	margin: 0 -5px;
	max-wdth: 100%;

    span {
		display: inline-block;
		margin: 2px 5px;
		cursor: pointer;
		border-radius: 0.25rem;
		padding: 2px 4px;

		&.active {
			background-color: ${props => props.theme.primaryColor};
			color: ${props => props.theme.primaryTextColor};
		}
    }
`;

export default TagList;
