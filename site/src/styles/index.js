import styled, { css } from 'react-emotion';

const lightFont = css`
	font-weight: 300;
`;

const boldFont = css`
	font-weight: 600;
`;

const transition = css`
	transition: all 0.3s ease;
`;

const Base = styled('div')`
	font-family: 'Open Sans', sans-serif;
	font-size: 16px;
	-webkit-font-smoothing: antialiased;
	text-rendering: optimizeLegibility;
	-moz-osx-font-smoothing: grayscale;
	-moz-font-feature-settings: 'liga' on;

	*,
	*:after,
	*:before {
		box-sizing: border-box;
	}

	p {
		color: #74767e;

		a {
			text-decoration: none;
			border-bottom: 1px dashed #74767e;
			color: inherit;
			line-height: 38px;

			&:hover {
				border-bottom: 1px solid #74767e;
			}
		}
	}

	.button-row {
		display: flex;
		margin: 30px 0px;
		flex-direction: row;
		align-items: center;

		a {
			margin-right: 20px;
			border: none;
		}

		&.center {
			text-align: center;
			justify-content: center;
		}

		@media all and (max-width: 768px) {
			margin: 40px auto 20px;
			text-align: center;
			justify-content: center;
		}

		@media all and (max-width: 480px) {
			margin: 40px auto 20px;
			flex-direction: column;
			align-items: center;
			text-align: center;
			justify-content: center;

			a {
				margin: 10px auto;
				width: 240px;
			}
		}
	}
`;

const Layout = styled('div')`
	width: 100%;
	max-width: 1200px;
	padding: 0 15px;
	margin: 0 auto;
`;

const Row = styled('div')`
	width: 100%;
	min-height: 80vh;
	height: auto;
	background-color: #eeeff2;
	display: flex;
	align-items: center;

	p {
		font-size: 20px;
		line-height: 1.3;
	}

	& > div {
		display: flex;
		flex-direction: row;
		align-items: center;
		position: relative;
		height: 100%;

		& > div {
			width: 50%;
			height: 100%;
			position: relative;
		}

		@media all and (max-width: 768px) {
			flex-direction: column;
			text-align: center;
			padding: 3rem 20px;

			& > div {
				width: 100%;
			}
		}
	}
`;
const banner = (image, bgColor) => css`
	width: 100%;
	min-height: 100vh;
	display: flex;
	justify-content: center;
	color: #fff;
	position: relative;
	flex-direction: column;
	background-color: ${bgColor};
	.content {
		width: 50%;
	}
	.bg-image {
		position: absolute;
		top: 100px;
		right: 0;
		width: 50%;
		height: calc(100% - 100px);
		background-image: url(${image});
		background-size: contain;
		background-position: top center;
		background-repeat: no-repeat;

		.pulsating-circle {
			position: absolute;
			left: 20%;
			bottom: 60px;
			transform: translateX(-50%) translateY(-50%);
			width: 20px;
			height: 20px;

			&:before {
				content: '';
				position: relative;
				display: block;
				width: 300%;
				height: 300%;
				box-sizing: border-box;
				margin-left: -100%;
				margin-top: -100%;
				border-radius: 45px;
				background-color: #01a4e9;
				animation: pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
			}

			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				display: block;
				width: 100%;
				height: 100%;
				background-color: white;
				border-radius: 15px;
				box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
				animation: pulse-dot 1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite;
			}
		}

		@keyframes pulse-ring {
			0% {
				transform: scale(0.33);
			}
			80%,
			100% {
				opacity: 0;
			}
		}

		@keyframes pulse-dot {
			0% {
				transform: scale(0.8);
			}
			50% {
				transform: scale(1);
			}
			100% {
				transform: scale(0.8);
			}
		}
	}

	p {
		${lightFont};
		color: #ffffff !important;
		font-size: 1.2rem;
		max-width: 700px;
		margin-top: 20px;
	}

	@media all and (max-width: 992px) {
		align-items: center;
		text-align: center;

		.button-row {
			justify-content: center;
			flex-wrap: wrap;
			text-align: center;

			a {
				margin-bottom: 20px;
			}
		}

		p {
			margin: 30px auto 50px;
		}

		.bg-image {
			display: none;
		}
		.content {
			width: 100%;
		}
	}

	@media all and (max-width: 480px) {
		h1 {
			margin-top: 70px;
			font-size: 36px;
		}
	}
`;

const SecondaryLink = styled('a')`
	color: ${props => (props.primary ? props.theme.primaryColor : '#fff')};
	cursor: pointer;
	text-transform: uppercase;
	font-size: 0.95rem;
	border-bottom: 1px solid transparent;
	text-decoration: none;
	${boldFont};
	${transition};

	&:hover,
	&:focus {
		text-decoration: none;
		border-bottom: 1px solid ${props => (props.primary ? props.theme.primaryColor : '#fff')};
	}
`;

const Section = styled('div')`
	width: 100%;
	padding: 80px 0;
	background-color: #f8f8f9;
	text-align: center;

	p {
		font-size: 18px;
	}
	@media (max-width: 576px) {
		padding: 40px 0;
	}
`;

const vcenter = css`
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

const hcenter = css`
	display: block;
	margin: 0 auto;
	max-width: 700px;
	text-align: center;

	p {
		line-height: 26px;
		color: #aaa !important;
	}

	.button-row {
		justify-content: center;
	}
`;

const titleRow = css`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin: 20px 0;

	h3 {
		margin: 0;
	}
`;

const titleText = css`
	max-width: 700px;
	font-size: 1.4rem !important;
	line-height: 2.2rem;
	margin: 20px auto;

	@media all and (max-width: 640px) {
		font-size: 1.2rem !important;
		line-height: 1.9rem;
	}
`;

const stepCard = css`
	border-radius: 2px;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
	background-color: #fff;
	text-align: center;
	color: #424242;
	text-align: left;
	position: relative;
	padding: 30px 30px 40px 60px;
	min-height: 340px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	& > div:last-child {
		margin-top: 20px;
	}

	& > div:last-child {
		margin-top: 0px;
	}

	p {
		max-width: none;
		font-size: 16px !important;
		line-height: 26px;

		a {
			line-height: 23px !important;
		}
	}

	code {
		color: rgba(0, 0, 32, 0.8);
		display: inline-block;
		font-size: 14px;
		line-height: 24px;
		background-color: rgba(0, 1, 31, 0.03);
		padding: 4px 6px;
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	h4 {
		margin-top: 20px;
		font-size: 20px;
		line-height: 30px;
	}

	.count {
		position: absolute;
		top: 4px;
		left: 15px;
		font-size: 64px;
		color: #0033ff;
		${boldFont};
	}

	@media all and (min-width: 768px) {
		.full {
			margin-left: -35px;
		}
	}
`;

const brand = css`
	${lightFont};
	color: #fff !important;
	font-size: 24px !important;
	max-width: 180px;
	margin: 20px auto 0;
`;

const showMobile = css`
	display: none;
	@media all and (max-width: 640px) {
		display: block;
	}
`;

const showMobileFlex = css`
	display: none !important;
	@media all and (max-width: 640px) {
		display: flex !important;
	}
`;

const hideMobile = css`
	@media all and (max-width: 640px) {
		display: none;
	}
`;

const hideTab = css`
	@media all and (max-width: 768px) {
		display: none;
	}
`;

const tabCenter = css`
	text-align: left;

	p {
		max-width: 500px;
		line-height: 28px;
	}

	@media all and (max-width: 768px) {
		text-align: center;

		& div {
			overflow: hidden;
		}
	}
`;

const featureList = css`
	margin: 20px 0 0 0;

	li {
		margin: 0 0 20px 0;
		color: #fff;
		line-height: 28px;
		font-size: 18px;
		text-align: left;
		a {
			text-decoration: none;
			border-bottom: 1px dashed #74767e;
			color: inherit;
			line-height: 38px;

			&:hover {
				border-bottom: 1px solid #74767e;
			}
		}
	}
`;
export {
	Base,
	Layout,
	Row,
	banner,
	SecondaryLink,
	vcenter,
	hcenter,
	Section,
	titleRow,
	titleText,
	stepCard,
	brand,
	hideMobile,
	showMobile,
	showMobileFlex,
	hideTab,
	tabCenter,
	boldFont,
	featureList,
};
