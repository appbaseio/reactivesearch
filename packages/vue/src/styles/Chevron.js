import { css } from 'emotion';
import styled from 'vue-emotion';

const open = css`
	top: 0.55em;
	transform: rotate(-45deg);
`;

const Chevron = styled('span')`
	&::before {
		content: '';
		border-style: solid;
		border-width: 0.15em 0.15em 0 0;
		display: inline-block;
		height: 0.45em;
		position: relative;
		top: 0.35em;
		left: 0;
		transform: rotate(135deg);
		vertical-align: top;
		width: 0.45em;

		${props => (props.open ? open : null)};
	}
`;

export default Chevron;
