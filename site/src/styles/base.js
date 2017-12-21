import { css } from "emotion";

const primaryColor = "#6772e5";

const boldHeading = css`
	letter-spacing: 0.04rem;
	word-spacing: 0.15rem;
	color: #fff;
`;

const button = css`
	margin-top: 20px;
	font-size: 1rem;
	text-shadow: 0px 0px 1px rgba(255, 255, 255, 1);
`;

const col = css`
	width: 50%;
`;

const colored = css`
	color: ${primaryColor};
`;

const decoratedLink = css`
	width: 146px;
	display: inline-flex;
	font-size: 1.1rem;
	margin: 1rem 0;
	color: ${primaryColor};
	border-bottom: 1px dashed ${primaryColor};
	text-decoration: none;
	padding: 3px 0;
	transition: all 0.3s ease;

	&:hover,
	&:focus {
		color: #3f4ab9;
		border-bottom: 1px solid #3f4ab9;
	}
`;

const card = css`
	width: 19%;
	border-radius: 0.15rem;
	text-align: center;
	box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
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

export { boldHeading, button, col, colored, decoratedLink, card, title, code };
