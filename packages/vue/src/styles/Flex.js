import styled from 'vue-emotion';
import { css } from 'emotion';
import { lighten } from 'polished';

const leftLabel = css`
	flex-direction: row;
	align-items: center;
`;

const rightLabel = css`
	flex-direction: row-reverse;
	align-items: center;
`;

const topLabel = css`
	flex-direction: column;
`;

const bottomLabel = css`
	flex-direction: column-reverse;
`;

const border = ({ theme: { colors } }) => css`
	border: 1px solid ${colors.borderColor || '#ccc'};
`;

const Flex = styled('div')`
	display: ${props => (props.inline ? 'inline-flex' : 'flex')};
	${props =>
		(props.labelPosition === 'left' || props.iconPosition === 'right')
		&& leftLabel};
	${props =>
		(props.labelPosition === 'right' || props.iconPosition === 'left')
		&& rightLabel};
	${props => props.labelPosition === 'top' && topLabel};
	${props => props.labelPosition === 'bottom' && bottomLabel};
	${props => props.showBorder && border};

	${props =>
		props.justifyContent
		&& css`
			justify-content: ${props.justifyContent};
		`};
	${props =>
		props.alignItems
		&& css`
			align-items: ${props.alignItems};
		`};

	${props =>
		props.flex
		&& css`
			flex: ${props.flex};
		`};
	${props =>
		props.direction
		&& css`
			flex-direction: ${props.direction};
		`};
	${props =>
		props.basis
		&& css`
			flex-basis: ${props.basis};
		`};

	svg.cancel-icon {
		cursor: pointer;
		fill: ${({ theme: { colors } }) =>
		colors.borderColor || lighten(0.3, colors.textColor)};
		flex-basis: 30px;

		&:hover {
			fill: ${({ theme }) => theme.colors.textColor};
		}
	}
`;

export default Flex;
