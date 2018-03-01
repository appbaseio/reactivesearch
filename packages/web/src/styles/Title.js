import styled from 'react-emotion';

const Title = styled('h2')`
	margin: 0 0 8px;
	font-size: 1rem;
	color: ${({ theme }) => theme.colors.titleColor};
`;

export default Title;
