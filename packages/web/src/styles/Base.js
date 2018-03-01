import styled from 'react-emotion';

const Base = styled('div')`
	font-family: ${({ theme }) => theme.typography.fontFamily};
	font-size: ${({ theme }) => theme.typography.fontSize};
	color: ${({ theme }) => theme.colors.textColor};

	input, button, textarea, select {
		font-family: ${({ theme }) => theme.typography.fontFamily};
	}

	*, *:before, *:after {
		box-sizing: border-box;
	}
`;

export default Base;
