import { css } from 'emotion';
import styled from 'vue-emotion';
import { lighten } from 'polished';

import Title from './Title';

const container = css`
	display: flex;
	flex-direction: column;
	margin: 0;
	border-radius: 0.25rem;
	overflow: hidden;
`;

const smallImage = css`
	width: 100px;
	height: 100px;
`;

const Image = styled('div')`
	width: 160px;
	height: 160px;
	${props => (props.small ? smallImage : null)};
	margin: 0;
	background-size: contain;
	background-position: center center;
	background-repeat: no-repeat;
	background-image: ${props => `url(${props.src})`};
`;

const ListItem = styled('a')`
	width: 100%;
	height: auto;
	outline: none;
	text-decoration: none;
	border-radius: 0;
	background-color: ${({ theme }) =>
		(theme.colors.backgroundColor
			? lighten(0.1, theme.colors.backgroundColor)
			: '#fff')};
	display: flex;
	flex-direction: row;
	margin: 0;
	padding: 10px;
	border-bottom: 1px solid ${({ theme }) =>
		(theme.colors.backgroundColor
			? lighten(0.3, theme.colors.backgroundColor)
			: lighten(0.68, theme.colors.textColor))};
	color: ${({ theme }) => theme.colors.textColor};
	${props => (props.href ? 'cursor: pointer' : null)}; all 0.3s ease;

	&:hover, &:focus {
		background-color: ${({ theme }) =>
		(theme.colors.backgroundColor
			? lighten(0.2, theme.colors.backgroundColor)
			: '#fdfefd')};
	}

	&:last-child {
		border: 0;
	}

	h2 {
		width: 100%;
		line-height: 1.2rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 0;
		padding: 0 0 8px;
	}

	p {
		margin: 0;
	}

	article {
		width: ${(props) => {
		if (props.image) {
			return props.small ? 'calc(100% - 100px)' : 'calc(100% - 160px)';
		}
		return '100%';
	}};
		padding-left: ${props => (props.image ? '10px' : 0)};
		font-size: 0.9rem;
	}

	&:hover, &:focus {
		box-shadow: 0 0 0 0 rgba(0,0,0,0.10);
	}

	@media (max-width: 420px) {
		min-width: 0;
		margin: 0;
		border-radius: 0;
		box-shadow: none;
		border: 1px solid #eee;

		&:hover, &:focus {
			box-shadow: 0;
		}
	}
`;

export default ListItem;
export { container, Title, Image };
