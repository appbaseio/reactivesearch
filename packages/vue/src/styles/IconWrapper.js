import { styled } from '@appbaseio/vue-emotion';

const IconWrapper = styled('div')`
	display: flex;
	align-items: center;
	justify-content: center;
	max-width: 23px;
	width: max-content;
	cursor: pointer;
	height: 100%;
	min-width: 20px;

	svg.search-icon {
		fill: ${({ theme = {} }) => (theme.colors ? theme.colors.primaryColor : 'unset')};
		transform: scale(1.5);
	}

	svg.cancel-icon {
		fill: ${({ theme = {} }) => (theme.colors ? theme.colors.borderColor : '#000')};
	}
`;


export const ButtonIconWrapper = styled(IconWrapper)`
	border-radius: 4px;
	vertical-align: middle;
	height: 25px;
	font-size: 12px;
	border: 1px solid ${({ theme }) => (theme.colors ? theme.colors.primaryColor : '#000')};
	color: ${({ theme }) => (theme.colors ? theme.colors.primaryColor : '#000')};
	max-width: unset;
	padding: 5px;
`;


export default IconWrapper;
