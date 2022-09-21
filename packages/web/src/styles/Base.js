import React from 'react';
import styled from '@emotion/styled';
import { string } from 'prop-types';

export const RenderAsTagComponent = ({ as: Tag = 'div', ...props }) => <Tag {...props} />;

RenderAsTagComponent.propTypes = {
	as: string,
};

const Base = styled(RenderAsTagComponent)`
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
