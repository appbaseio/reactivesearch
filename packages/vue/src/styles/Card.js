import { css } from 'emotion';
import styled from 'vue-emotion';
import { lighten } from 'polished';

import Title from './Title';

const container = css`
	display: flex;
	flex-direction: row;
	justify-content: center;
	flex-wrap: wrap;
	margin: 0 -8px;

	@media (max-width: 420px) {
		margin: 0;
	}
`;

const Image = styled('div')`
	width: calc(100% + 20px);
	height: 220px;
	margin: -10px -10px 0;
	background-color: ${({ theme: { colors } }) =>
		colors.backgroundColor || '#fcfcfc'};
	background-size: contain;
	background-position: center center;
	background-repeat: no-repeat;
`;

const Card = styled('a')`
	width: auto;
	flex-grow: 1;
	outline: none;
	text-decoration: none;
	min-width: 240px;
	max-width: 250px;
	border-radius: 0.25rem;
	background-color: ${({ theme }) =>
		(theme.colors.backgroundColor
			? lighten(0.1, theme.colors.backgroundColor)
			: '#fff')};
	height: 300px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	margin: 8px;
	padding: 10px;
	overflow: hidden;
	box-shadow: 0 0 4px 0 rgba(0,0,0,0.2);
	color: ${({ theme }) => theme.colors.textColor};
	${props => (props.href ? 'cursor: pointer' : null)};
	transition: all 0.3s ease;

	h2 {
		width: 100%;
		font-size: 0.9rem;
		line-height: 1.2rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 0;
		padding: 10px 0 8px;
	}

	p {
		margin: 0
	}

	article {
		flex-grow: 1;
		font-size: 0.9rem;
	}

	&:hover, &:focus {
		box-shadow: 0 0 8px 1px rgba(0,0,0,.3);
	}

	@media (max-width: 420px) {
		width: 50%;
		min-width: 0;
		height: 210px;
		margin: 0;
		border-radius: 0;
		box-shadow: none;
		border: 1px solid #eee;

		&:hover, &:focus {
			box-shadow: 0;
		}
	}
`;

export default Card;
export { container, Title, Image };
