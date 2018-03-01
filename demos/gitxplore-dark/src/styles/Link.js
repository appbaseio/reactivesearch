import styled from 'react-emotion';

import theme from './theme';

const Link = styled.a`
	cursor: pointer;
	color: ${theme.colors.secondaryColor};
	text-decoration: none;
	font-weight: bold;
	margin-left: 20px;
	font-size: 1.2rem;

	&:hover {
		color: ${theme.colors.primaryColor};
	}
`;

export default Link;
