import styled from '@emotion/styled';
import { css } from '@emotion/core';

const right = css`
	right: 30px;
`;

const MicIcon = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	top: 50%;
	transform: translateY(-50%);
	position: absolute;
	cursor: pointer;
	right: 15px;
	${({ iconPosition, showClear }) => {
		if (showClear && iconPosition !== 'left') return 'right: 51px;';
		if (iconPosition === 'right' || showClear) {
			return right;
		}
		return null;
	}}
	${({ showIcon, showClear }) => {
		if (!showIcon && showClear) return 'right: 32px;';
		if (!showIcon && !showClear) return 'right: 15px;';
		return null;
	}};
	> * {
		position: absolute;
		object-fit: cover;
	}
	width: 11px;
`;

export default MicIcon;
