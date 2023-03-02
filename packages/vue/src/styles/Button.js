import { styled } from '@appbaseio/vue-emotion';
import { css } from '@emotion/css';
import { darken, lighten, rgba } from 'polished';

const filters = ({ colors: { borderColor } }) => css`
	margin: 0 -3px;
	max-width: 100%;

	button {
		margin: 2px 3px;
		padding: 5px 8px;
		font-size: 0.85rem;
		position: relative;

		span:first-child {
			max-width: 260px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			margin-right: 26px;
		}

		span:last-child {
			display: flex;
			height: 100%;
			top: 0;
			right: 8px;
			position: absolute;
			align-items: center;
			border-left: 1px solid ${borderColor || '#fff'};
			padding-left: 8px;
			margin-left: 8px;
		}

		&:hover,
		&:focus {
			span:first-child {
				text-decoration: line-through;
			}
		}
	}
`;

const pagination = css`
	margin: 10px -3px;
	max-width: 100%;
	text-align: center;

	button {
		margin: 0 3px;
	}
`;

const toggleButtons = css`
	margin: 0 -3px;
	max-width: 100%;

	button {
		margin: 3px 3px;
	}
`;

const numberBoxContainer = css`
	margin: 0 -5px;
	button {
		margin: 5px;
	}
	span {
		margin: 0 5px;
	}
`;

const primary = ({ theme }) => `
	background-color: ${theme.colors.primaryColor};
	color: ${theme.colors.primaryTextColor};

	&:hover,
	&:focus {
		background-color: ${darken(0.1, theme.colors.primaryColor)};
	}
`;

const large = () => `
	min-height: 40px;
	padding: 10px 20px;
`;

const disabled = ({ theme }) => `
	background-color: ${
	theme.colors.backgroundColor ? lighten(0.1, theme.colors.backgroundColor) : '#fafafa'
};
	color: #ccc;
	cursor: not-allowed;

	&:hover,
	&:focus {
		background-color: ${
	theme.colors.backgroundColor ? lighten(0.2, theme.colors.backgroundColor) : '#fafafa'
};
	}
`;

const Button = styled('button')`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	border-radius: 3px;
	border: 1px solid transparent;
	min-height: 30px;
	word-wrap: break-word;
	padding: 5px 12px;
	line-height: 1.2rem;
	background-color: ${({ theme }) => (theme.colors ? theme.colors.backgroundColor : '#eee')};
	color: ${({ theme }) => (theme.colors ? theme.colors.textColor : '')};
	cursor: pointer;
	user-select: none;
	transition: all 0.3s ease;

	&:hover,
	&:focus {
		background-color: ${({ theme }) =>
		theme.colors && theme.colors.backgroundColor
			? darken(0.1, theme.colors.backgroundColor)
			: '#ccc'};
	}

	&:focus {
		outline: 0;
		border-color: ${({ theme }) =>
		theme.colors && theme.colors.primaryColor
			? rgba(theme.colors.primaryColor, 0.6)
			: 'unset'};
		box-shadow: ${({ theme }) =>
		theme.colors && theme.colors.primaryColor
			? `0 0 0 2px ${rgba(theme.colors.primaryColor, 0.3)}`
			: ''};
	}

	${(props) => (props.primary ? primary : null)};
	${(props) => (props.disabled ? disabled : null)};
	${(props) => props.large && large};

	&.enter-btn {
		border-top-left-radius: 0px;
		border-bottom-left-radius: 0px;
		height: 100%;
	}
`;

const loadMoreContainer = css({
	margin: '5px 0',
	display: 'flex',
	justifyContent: 'center',
});

export { pagination, filters, toggleButtons, numberBoxContainer, loadMoreContainer };
export default Button;
