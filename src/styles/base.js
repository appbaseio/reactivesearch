import { css } from 'emotion';

import queries from './mediaQueries';

const primaryColor = '#6772e5';
const secondaryColor = '#fefefe';

const container = css`
	${queries.medium`
		h1 {
			font-size: 1.6rem;
			line-height: 2rem;
		}

		h2 {
			font-size: 1.4rem;
			line-height: 1.8rem;
		}
	`};
`;

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

	${queries.small`
		width: 100%;
		margin-top: 12px;
	`}
`;

const col = css`
	width: 50%;

	${queries.medium`
		width: 100%;
	`};
`;

const colored = css`
	color: ${primaryColor};

	${queries.medium`
		text-align: center;
	`};
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
	cursor: pointer;

	&:hover, &:focus {
		box-shadow: 0 15px 35px rgba(50,50,93,.2), 0 5px 15px rgba(0,0,0,.2);

		h4 {
			color: ${primaryColor};
		}
	}

	& > div:first-child {
		height: 88px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	img {
		margin-bottom: 15px;
		max-width: 65px;
	}

	${queries.medium`
		width: 49%;
	`};

	${queries.small`
		width: 100%;
	`};
`;

const code = css`
	width: 32%;
	max-height: 500px;
	margin: 0 50px;
	overflow-y: hidden;

	& > div {
		width: 100%;
		max-width: 811px;
	}
`;

const showcase = css`
	width: 95%;
	max-width: 490px;
	padding: 2rem;
	text-align: center;
	align-items: center;
	margin: -40px auto 0;
	border-radius: 4px;

	${queries.medium`
		margin: 40px auto;
	`};
`;

const footer = css`
	.logo {
		img {
			margin: 12px 12px 30px;
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

	${queries.medium`
		flex-wrap: wrap;

		.column-wrapper {
			width: 100%;
		}

		.column {
			width: 25%;
			padding: 0 15px;
		}
	`};

	${queries.small`
		.column-wrapper {
			flex-direction: column;
			text-align: center;
		}

		.column {
			width: 100%;
			margin-top: 25px;
		}
	`};
`;

const tabCol = css`
	${queries.medium`
		flex-direction: column;
		text-align: center;
		padding: 0 1.2rem;

		img {
			margin-bottom: 30px;
		}
	`};
`;

const tabCenterHeading = css`
	max-width: 450px;

	${queries.medium`
		font-size: 1.5rem;
		line-height: 1.9rem;
		margin: 0 auto 10px;
		max-width: none;
	`};
`;

const tabShow = css`
	display: none;

	${queries.medium`
		display: flex;
	`};
`;

const tabHide = css`
	${queries.medium`
		display: none;
	`};
`;

const tabPadding = css`
	${queries.medium`
		padding: 1.5rem;
	`}
`;

const tabJustifyCenter = css`
	.demo {
		margin: 20px 0;
		box-shadow: 0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07);

		img {
			transition: all .3s ease;

			&:hover {
				transform: scale(1.1);
			}
		}
	}

	${queries.medium`
		justify-content: center;
		align-items: center;
	`};

	${queries.small`
		width: 100%;
		flex-direction: column;

		a {
			margin-left: 0 !important;
		}
	`};
`;

const tabBanner = css`
	${queries.medium`
		padding: 0 1.6rem;
		text-align: center;
		align-items: center;
	`};
`;

const mobHide = css`
	${queries.small`
		display: none !important;
	`};
`;

const mobShow = css`
	display: none;

	${queries.small`
		display: block;
	`};
`;

const mobBottomMargin = css`
	margin-bottom: 30px;
`;

const textCenter = css`
	text-align: center;
`;

export {
	container,
	boldHeading,
	button,
	col,
	colored,
	decoratedLink,
	decoratedSecondaryLink,
	card,
	code,
	showcase,
	footer,
	tabCol,
	tabCenterHeading,
	tabPadding,
	tabShow,
	tabHide,
	tabJustifyCenter,
	tabBanner,
	mobHide,
	mobShow,
	mobBottomMargin,
	textCenter,
};
