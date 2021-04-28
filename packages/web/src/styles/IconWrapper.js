import styled from '@emotion/styled';
import { css } from '@emotion/core';

const IconWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	max-width: 23px;
	width: max-content;
	cursor: pointer;
	height: 100%;

	svg.search-icon {
		fill: ${({ theme }) => theme.colors.primaryColor};
	}

	svg.cancel-icon {
		fill: ${({ theme }) => theme.colors.borderColor};
	}
`;

export default IconWrapper;
