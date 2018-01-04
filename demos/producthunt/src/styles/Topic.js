import styled, { css } from 'react-emotion';

const Topic = styled.div`
	background: #eee;
	margin: 5px;
	padding: 5px;
	font-size: 0.8rem;

	&:first-child {
		margin-left: 0;
	}

	${({ hollow }) => hollow && css`
		background: none;
		width: 70px;
		border: 1px solid #eee;
		text-align: center;
	`};
`;

export default Topic;
