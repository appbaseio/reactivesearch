import styled from 'vue-emotion';

const Base = styled('div')`
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
