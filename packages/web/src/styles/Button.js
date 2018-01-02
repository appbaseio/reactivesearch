import { css } from 'emotion';
import styled from 'react-emotion';
import darken from 'polished/lib/color/darken';

const filters = css`
	margin: 0 -3px;
	max-width: 100%;

	a {
		margin: 2px 3px;
		padding: 5px 8px;
		font-size: 0.85rem;
		position: relative;

		span:first-child {
			max-width: 360px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			margin-right: 26px;
		}

		span:last-child {
			display: flex;
			height: 100%;
			right: 8px;
			position: absolute;
			align-items: center;
			border-left: 1px solid #fff;
			padding-left: 8px;
			margin-left: 8px;
		}

		&:hover, &:focus {
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

	a {
		margin: 0 3px;
	}
`;

const toggleButtons = css`
	margin: 0 -3px;
	max-width: 100%;

	a {
		margin: 0 3px;
	}
`;

const numberBoxContainer = css`
	margin: 0 -5px;
	a {
		margin: 5px;
	}
	span {
		margin: 0 5px;
	}
`;

const primary = props => css`
	background-color: ${props.theme.primaryColor};
	color: ${props.theme.primaryTextColor};

	&:hover, &:focus {
		background-color: ${darken(0.1, props.theme.primaryColor)};
	}
`;

const large = () => css`
	min-height: 40px;
	padding: 10px 20px;
`;

const disabled = css`
	background-color: #fafafa;
	color: #ccc
	cursor: not-allowed;

	&:hover, &:focus {
		background-color: #fafafa;
	}
`;

const Button = styled('a')`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	border-radius: 3px;
	min-height: 30px;
	word-wrap: break-word;
	padding: 5px 12px;
	line-height: 1.2rem;
	background-color: #eee;
	color: #424242;
	cursor: pointer;
	user-select: none;
	transition: all 0.3s ease;

	&:hover, &:focus {
		background-color: #ccc;
	}

	${props => (props.primary ? primary : null)};
	${props => (props.disabled ? disabled : null)};
	${props => props.large && large};
`;

export { pagination, filters, toggleButtons, numberBoxContainer };
export default Button;
