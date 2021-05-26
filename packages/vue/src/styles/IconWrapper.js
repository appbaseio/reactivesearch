import styled, { css } from '@appbaseio/vue-emotion';

const IconWrapper = styled('div')`
	display: flex;
	align-items: center;
	justify-content: center;
	max-width: 23px;
	width: max-content;
	cursor: pointer;
	height: 100%;min-width:20px;

	svg.search-icon {
		fill: ${({ theme }) => theme.colors.primaryColor};
		transform:scale(1.5);
	}

	svg.cancel-icon {
		fill: ${({ theme }) => theme.colors.borderColor || '#000'};
	}
`;

export default IconWrapper;
