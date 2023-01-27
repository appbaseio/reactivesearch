import { styled } from '@appbaseio/vue-emotion';

const right = `
	right: 35px;
`;

const MicIcon = styled('div')`
	height: 40px;
	position: absolute;
	top: 8px;
	cursor: pointer;
	right: 15px;
	${({ iconPosition, showClear }) => {
		if (showClear && iconPosition !== 'left') return 'right: 51px;';
		if (iconPosition === 'right' || showClear) {
			return right;
		}
		return null;
	}}
	${({ showIcon, showClear }) => {
		if (!showIcon && showClear) return 'right: 32px;';
		if (!showIcon && !showClear) return 'right: 15px;';
		return null;
	}}
  width: 11px;
`;

export default MicIcon;
