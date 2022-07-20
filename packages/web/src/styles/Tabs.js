import styled from '@emotion/styled';

// eslint-disable-next-line import/prefer-default-export
export const TabLink = styled('a')`
	color: ${({ theme, selected }) =>
	(selected ? theme.colors.primaryColor : theme.colors.textColor)};
	font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
	padding: 1rem 0.5rem;
	text-decoration: none;
	border-color: ${({ theme }) => theme.colors.primaryColor};
	border-width: 0px;
	border-style: solid;
	border-bottom-width: ${({ selected, vertical }) => (selected && !vertical ? '2px' : '0px')};
	border-left-width: ${({ selected, vertical }) => (selected && vertical ? '2px' : '0px')};
	display: inline-block;
	cursor: pointer;
	whitespace: no-wrap;
`;

export const TabContainer = styled('div')`
	display: flex;
	flex-direction: ${({ vertical }) => (vertical ? 'column' : 'row')};
	overflow-x: scroll;
`;
