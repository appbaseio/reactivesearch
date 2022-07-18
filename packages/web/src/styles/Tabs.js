import styled from '@emotion/styled';

// eslint-disable-next-line import/prefer-default-export
export const TabLink = styled('a')`
	color: ${({ theme, selected }) =>
	(selected ? theme.colors.primaryColor : theme.colors.textColor)};
	font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
	padding: 1rem;
	text-decoration: none;
	border-color: ${({ theme }) => theme.colors.primaryColor};
	border-width: 0px;
	border-style: solid;
	border-bottom-width: ${({ selected }) => (selected ? '2px' : '0px')};
	display: inline-block;
	cursor: pointer;
`;

export const TabContainer = styled('div')`
	padding: 5px;
`;
