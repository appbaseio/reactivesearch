import { styled } from '@appbaseio/vue-emotion';
import { lighten } from 'polished';

const leftLabel = `
	flex-direction: row;
	align-items: center;
`;

const rightLabel = `
	flex-direction: row-reverse;
	align-items: center;
`;

const topLabel = `
	flex-direction: column;
`;

const bottomLabel = `
	flex-direction: column-reverse;
`;

const border = ({ theme: { colors = {} } }) => `
	border: 1px solid ${colors.borderColor || '#ccc'};
`;

const Flex = styled('div')`
	display: ${(props) => (props.inline ? 'inline-flex' : 'flex')};
	${(props) => (props.labelPosition === 'left' || props.iconPosition === 'right') && leftLabel};
	${(props) => (props.labelPosition === 'right' || props.iconPosition === 'left') && rightLabel};
	${(props) => props.labelPosition === 'top' && topLabel};
	${(props) => props.labelPosition === 'bottom' && bottomLabel};
	${(props) => props.showBorder && border};

	${(props) =>
		props.justifyContent
		&& `
			justify-content: ${props.justifyContent};
		`};
	${(props) =>
		props.alignItems
		&& `
			align-items: ${props.alignItems};
		`};
	${(props) =>
		props.gap
		&& `
			gap: ${props.gap};
		`};

	${(props) =>
		props.flex
		&& `
			flex: ${props.flex};
		`};
	${(props) =>
		props.direction
		&& `
			flex-direction: ${props.direction};
		`};
	${(props) =>
		props.basis
		&& `
			flex-basis: ${props.basis};
		`};

	svg.cancel-icon {
		cursor: pointer;
		fill: ${({ theme: { colors = {} } }) =>
		colors.borderColor || lighten(0.3, colors.textColor || '#fff')};
		flex-basis: 30px;

		&:hover {
			fill: ${({ theme }) => (theme.colors ? theme.colors.textColor : '')};
		}
	}
`;

export default Flex;
