import styled from '@appbaseio/vue-emotion';

const Base = ({ data: { attrs: { as: T = 'div' } }, data: props, children }) => {
	delete props.attrs.as;
	return (<T {...props}>{children}</T>);
}

export default styled(Base)`
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
