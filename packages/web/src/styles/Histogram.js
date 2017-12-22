import { css } from 'emotion';
import styled from 'react-emotion';

export const histogramContainer = css`
	display: flex;
	height: 100px;
	align-items: flex-end;
	margin: 0 12px -24px 12px;
`;

const dimensions = props => css`
	width: ${props.width};
	height: ${props.height};
`;

const Historam = styled('div')`
	background-color: #efefef;
	${dimensions}
`;

export default Historam;
