import styled from '@emotion/styled';
import { css } from '@emotion/core';

const IconGroup = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	grid-gap: 6px;
	padding: 0 10px;
	height: 100%;

	${({ positionType }) => {
	if (positionType === 'absolute') {
		return css`
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
			`;
	}
	return null;
}};

	${({ groupPosition }) => {
	if (groupPosition === 'right') {
		return css`
				right: 0;
			`;
	}
	return css`
			left: 0;
		`;
}};
	${({ enableAI }) =>
	(enableAI
		? `
		top: 0%;
	    transform: translateY(0);
    	height: 42px;

	`
		: '')};
`;

export default IconGroup;
