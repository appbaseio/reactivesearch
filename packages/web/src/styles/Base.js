import React from 'react';
import styled from 'react-emotion';

const Base = styled(({ as: T = 'div', ...props }) => <T {...props} />)`
	font-family: ${({ theme }) => theme.typography.fontFamily};
	font-size: ${({ theme }) => theme.typography.fontSize};
	color: ${({ theme }) => theme.colors.textColor};
	width: 100%;

	input,
	button,
	textarea,
	select {
		font-family: ${({ theme }) => theme.typography.fontFamily};
	}

	*,
	*:before,
	*:after {
		box-sizing: border-box;
	}
`;

export default Base;
