import styled from '@emotion/styled';

export const TabLink = styled('a')`
	color: ${({ theme, selected }) =>
	(selected ? theme.colors.primaryColor : theme.colors.textColor)};
	font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
	padding: 0.5rem;
	text-decoration: none;
	border-color: ${({ selected, theme }) => (selected ? theme.colors.primaryColor : 'white')};
	border-width: 0px;
	border-style: solid;
	border-bottom-width: ${({ selected, vertical }) => (selected && !vertical ? '2px' : '0px')};
	border-left-width: ${({ vertical }) => (vertical ? '2px' : '0px')};
	display: inline-block;
	cursor: pointer;
	white-space: nowrap;
`;

export const TabContainer = styled('div')`
	display: flex;
	flex-direction: ${({ vertical }) => (vertical ? 'column' : 'row')};
	${({ vertical }) => (vertical ? 'max-height: 50vh' : 'max-width: 90vw')};
	${({ vertical }) => (vertical ? 'overflow-y: auto' : 'overflow-x: auto')};
`;

export const Tab = styled.div`
	cursor: pointer;
	padding: 0.5rem;
`;
