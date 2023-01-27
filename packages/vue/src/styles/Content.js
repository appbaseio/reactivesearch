import { styled } from '@appbaseio/vue-emotion';

const alert = ({ theme }) => `
	color: ${theme.colors.alertColor};
`;

const Content = styled('div')`
	${(props) => props.alert && alert};
	font-size: 13px;
	margin: 8px;
`;

export default Content;
