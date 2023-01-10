import { styled } from '@appbaseio/vue-emotion';

const left = `
	padding-left: 12px;
	left: 0;
`;

const right = `
	padding-right: 12px;
	right: 0;
`;

const clear = `
	padding-right: 29px;
	right: 0;
`;

const InputIcon = styled('div')`
	position: absolute;
	top: ${({ isClearIcon }) => (isClearIcon ? '12px' : '13px')};
	cursor: pointer;
	${({ iconPosition }) => {
		if (iconPosition === 'left') {
			return left;
		}
		if (iconPosition === 'right') {
			return right;
		}
		return null;
	}};
	${({ clearIcon }) => clearIcon && clear};
	${({ showIcon }) => !showIcon && 'padding-right:10px'};
	svg.search-icon {
		fill: ${({ theme }) => (theme.colors ? theme.colors.primaryColor : '')};
	}
	svg.cancel-icon {
		fill: ${({ theme }) => (theme.colors ? theme.colors.borderColor : '')};
	}
`;

export default InputIcon;
