import styled, { css } from 'react-emotion';

const left = css`
	padding-left: 12px;
	left: 0;
`;

const right = css`
	padding-right: 12px;
	right: 0;
`;

const InputIcon = styled.div`
	position: absolute;
	top: calc(50% - 8px);
	${({ iconPosition }) => {
		if (iconPosition === 'left') {
			return left;
		} else if (iconPosition === 'right') {
			return right;
		}
		return null;
	}}

	svg.search-icon {
		fill: ${({ theme }) => theme.colors.primaryColor};
	}
`;

export default InputIcon;
