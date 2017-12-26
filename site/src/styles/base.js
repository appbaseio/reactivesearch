import { css } from 'emotion';

const primaryColor = '#6772e5';
const secondaryColor = '#fefefe';

const boldHeading = css`
	letter-spacing: 0.04rem;
	word-spacing: 0.15rem;
	color: #fff;
`;

const button = css`
	margin-top: 20px;
	font-size: 1rem;
	text-shadow: 0px 0px 1px rgba(255, 255, 255, 1);
	text-decoration: none;
`;

const col = css`
	width: 50%;
`;

const colored = css`
	color: ${primaryColor};
`;

const decoratedLink = css`
	display: inline-flex;
	font-size: 1.1rem;
	margin: 1rem 0;
	color: ${primaryColor};
	border-bottom: 1px dashed ${primaryColor};
	text-decoration: none;
	padding: 3px 0;
	transition: all .3s ease;

	&:hover, &:focus {
		color: #3f4ab9;
		border-bottom: 1px solid #3f4ab9;
	}
`;

const decoratedSecondaryLink = css`
	${decoratedLink} {
		color: ${secondaryColor};
		border-bottom: 1px dashed ${secondaryColor};
		font-size: 1rem;

		&:hover, &:focus {
			color: ${secondaryColor};
			border-bottom: 1px solid ${secondaryColor};
			filter: brightness(90%);
		}
	}
`;

const card = css`
	width: 24%;
	border-radius: 0.15rem;
	margin-top: 1rem;
	padding: 2rem 1rem;
	background-color: #fff;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	text-align: center;
	box-shadow: 0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07);

	img {
		margin-bottom: 15px;
	}
`;

const title = css`
	display: inline-flex;
	background: #6772e5;
	border-radius: 999em;
	padding: 0 15px;
	height: 32px;
	color: #fff;
	justify-content: center;
	align-items: center;
`;

const code = css`
	width: 32%;
	max-height: 500px;
	margin: 0 50px;
	overflow-y: hidden;
`;

const showcase = css`
	width: 100%;
	max-width: 400px;
	padding: 2rem;
	text-align: center;
	margin: -40px auto 0;
	border-radius: 4px;
`;

const footer = css`
	.logo {
		img {
			margin: 12px;
		}
	}

	.column {
		padding: 0 45px;
	}

	.heading {
		color: #4f5882;
		text-transform: uppercase;
		margin: 12px 0;
		font-size: 0.85rem;
		letter-spacing: 0.05rem;
		font-weight: 700;
	}

	a {
		color: #8994c6;
		line-height: 1.6rem;
		text-decoration: none;

		&:hover {
			color: #eee;
		}
	}
`;

export {
	boldHeading,
	button,
	col,
	colored,
	decoratedLink,
	decoratedSecondaryLink,
	card,
	title,
	code,
	showcase,
	footer,
};
