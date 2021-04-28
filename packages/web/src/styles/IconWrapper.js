import styled from '@emotion/styled';
import { css } from '@emotion/core';

const IconWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	max-width: 23px;
	width: fit-content;
	cursor: pointer;

	svg.search-icon {
		fill: ${({ theme }) => theme.colors.primaryColor};
	}

	svg.cancel-icon {
		fill: ${({ theme }) => theme.colors.borderColor};
	}
`;

export default IconWrapper;
