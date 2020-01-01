import styled, { css } from 'react-emotion';

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
	top: ${({ isClearIcon }) => (isClearIcon ? '12px' : '13px')};
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
