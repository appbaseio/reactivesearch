import { hexToRGBA } from '@appbaseio/reactivecore/lib/utils/helper';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { darken, lighten, rgba } from 'polished';

const Filter = () => css`
	margin: 0 -3px;
	max-width: 100%;

	a {
		margin: 2px 3px;
		padding: 5px 8px;
		font-size: 0.85rem;
		position: relative;
	}
`;

Filter.Value = styled.span`
	max-width: 200px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	flex-wrap: nowrap;
	flex-wrap: nowrap;
	width: max-content;

	&:hover,
	&:focus {
		text-decoration: line-through;
	}
`;


Filter.ImageValue = styled(Filter.Value)`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: 0.5rem;
`;

Filter.CloseIcon = styled.span`
	display: flex;
	height: 100%;
	top: 0;
	right: 8px;
	align-items: center;
	border-left: 1px solid ${props => props.theme.colors.textColor || '#000'};
	padding-left: 8px;
	margin-left: 8px;
`;

const pagination = css`
	margin: 10px -3px;
	max-width: 100%;
	text-align: center;

	a {
		margin: 0 3px;
		text-decoration: none;
	}
`;

const toggleButtons = css`
	margin: 0 -3px;
	max-width: 100%;

	a {
		margin: 3px 3px;
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

const loadMoreContainer = css({
	margin: '5px 0',
	display: 'flex',
	justifyContent: 'center',
});

const primary = ({ theme }) => css`
	background-color: ${theme.colors.primaryColor};
	color: ${theme.colors.primaryTextColor};

	&:hover,
	&:focus {
		background-color: ${darken(0.1, theme.colors.primaryColor)};
	}
`;

const info = ({ theme }) => css`
	border: 1px solid ${theme.colors.primaryColor};
	color: ${theme.colors.primaryColor};
	background-color: ${theme.colors.primaryTextColor};
	&:hover,
	&:focus {
		background-color: ${darken(0.1, hexToRGBA(theme.colors.primaryTextColor))};
	}
`;

const large = css`
	min-height: 40px;
	padding: 10px 20px;
`;

const disabled = ({ theme }) => css`
	background-color: ${theme.colors.backgroundColor
	? lighten(0.1, theme.colors.backgroundColor)
	: '#fafafa'};
	color: #ccc;
	cursor: not-allowed;

	&:hover,
	&:focus {
		background-color: ${theme.colors.backgroundColor
		? lighten(0.2, theme.colors.backgroundColor)
		: '#fafafa'};
	}
`;

const Button = styled('a')`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	border-radius: 3px;
	border: 1px solid transparent;
	min-height: 30px;
	word-wrap: break-word;
	padding: 5px 12px;
	line-height: 1.2rem;
	background-color: ${({ theme }) => theme.colors.backgroundColor || '#eee'};
	color: ${({ theme }) => theme.colors.textColor};
	cursor: pointer;
	user-select: none;
	transition: all 0.3s ease;

	&:hover,
	&:focus {
		background-color: ${({ theme }) =>
	(theme.colors.backgroundColor ? darken(0.1, theme.colors.backgroundColor) : '#ccc')};
	}

	&:focus {
		outline: 0;
		border-color: ${({ theme }) => rgba(theme.colors.primaryColor, 0.6)};
		box-shadow: ${({ theme }) => `0 0 0 2px ${rgba(theme.colors.primaryColor, 0.3)}`};
	}

	${props => (props.disabled ? disabled : null)};
	${props => (props.primary ? primary : null)};
	${props => (props.info ? info : null)};
	${props => props.large && large};

	&.enter-btn {
		border-top-left-radius: 0px;
		border-bottom-left-radius: 0px;
		height: 100%;
	}

	${props =>
		props.isLinkType
		&& css`
			background-color: transparent;
			text-decoration: underline;
			text-underline-position: under;
			color: #2c2daf;
			&:hover {
				background-color: transparent;
			}
			&.disabled {
				color: hsl(240deg 7% 62%);
				text-decoration-color: hsl(240deg 7% 62%);
				cursor: default;
				pointer-events: none;
			}
		`};
`;

export { pagination, Filter, toggleButtons, numberBoxContainer, loadMoreContainer };
export default Button;
