import styled from 'react-emotion';

import theme from './theme';

const Topic = styled.div`
	background: ${({ active }) => (active ? theme.colors.primaryColor : theme.colors.secondaryColor)};
	margin: 3px;
	padding: 4px;
	color: white;
	font-weight: bold;
	cursor: pointer;
	border-radius: 4px;
	color: ${({ active }) => (active ? '#424242' : theme.colors.textColor)};

	&:hover {
		background: ${theme.colors.primaryColor};
	}
`;

export default Topic;
