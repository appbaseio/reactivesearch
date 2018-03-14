import styled, { css } from 'react-emotion';

const alert = ({ theme }) => css`
	color: ${theme.colors.alertColor};
`;

const Content = styled.div`
	${props => props.alert && alert};
	margin: 8px;
`;

export default Content;
