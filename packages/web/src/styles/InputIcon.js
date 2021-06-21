import styled from '@emotion/styled';
import { css } from '@emotion/core';

const left = css`
	padding-left: 12px;
	left: 0;
`;

const right = css`
	padding-right: 12px;
	right: 0;
`;

const clear = css`
	padding-right: 29px;
	right: 0;
`;

const InputIcon = styled.div`
	position: absolute;
	display: flex;
	align-items: center;
	top: 50%;
	transform: translateY(-50%);
	cursor: pointer;
	${({ iconPosition }) => {
		if (iconPosition === 'left') {
			return left;
		} else if (iconPosition === 'right') {
			return right;
		}
		return null;
	}};
	${({ clearIcon }) => clearIcon && clear};
	${({ showIcon }) => !showIcon && 'padding-right:10px'};

	svg.search-icon {
		fill: ${({ theme }) => theme.colors.primaryColor};
	}

	svg.cancel-icon {
		fill: ${({ theme }) => theme.colors.borderColor};
	}
`;

export default InputIcon;
