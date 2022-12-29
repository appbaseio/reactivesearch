import { styled } from '@appbaseio/vue-emotion';

const Base = ({
	data: {
		attrs: { as: T = 'div' },
	},
	data: props,
	children,
}) => {
	const propsVar = props;
	delete propsVar.attrs.as;
	return <T {...props}>{children}</T>;
};

export default styled(Base)`
	font-family: ${({ theme }) =>
		theme && theme.typography ? theme.typography.fontFamily : 'unset'};
	font-size: ${({ theme }) => (theme && theme.typography ? theme.typography.fontSize : 'unset')};
	color: ${({ theme }) => (theme && theme.typography ? theme.typography.textColor : 'unset')};
	width: 100%;

	input,
	button,
	textarea,
	select {
		font-family: ${({ theme }) => theme && theme.typography ? theme.typography.fontFamily : 'unset'};
	}

	*,
	*:before,
	*:after {
		box-sizing: border-box;
	}
`;
