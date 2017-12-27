import { css } from 'emotion';

const nav = css`
	width: 100%;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #FF3A4E;
	color: #fff;
	height: 52px;
	font-size: 15px;
	letter-spacing: 0.05rem;
`;

const container = css`
	display: flex;
	padding-top: 52px;
`;

const leftCol = css`
	width: 320px;
	height: 100%;
	padding: 15px 20px;
	position: fixed;
	left: 0;
	right: 0;
	border-right: 1px solid #f0f0f0;

	& > div {
		margin: 40px 0;
	}

	@media all and (max-width: 767px) {
		position: static;
		width: 100%;
		height: auto;
		border-right: 0;
		border-bottom: 1px solid #f0f0f0;
	}
`;

const rightCol = css`
	width: calc(100% - 320px);
	position: relative;
	left: 320px;
	padding: 25px 30px;
	background-color: #fbfbfb;

	.list {
		margin-bottom: 30px;
	}

	.list-item {
		max-width: none;
		min-width: 0;
		width: calc(30% - 16px);
		height: auto;
		background-color: transparent;
		border: 0;
		border-radius: 0;
		box-shadow: none;
		position: relative;
		padding: 0;

		h2 {
			padding-bottom: 4px;
		}

		.image {
			background-size: cover;
		}

		.price {
			width: 70px;
			height: 44px;
			background-color: #424242;
			position: absolute;
			top: 160px;
			left: 0;
			color: #fafafa;
			font-size: 18px;
			display: flex;
			justify-content: center;
			align-items: center;
			letter-spacing: 0.03rem;
		}

		.info {
			color: #555;
			font-size: 14px;
			margin-bottom: 4px;
		}
	}

	.result-stats {
		text-align: right;
		color: #666;
		font-size: 15px;
	}

	@media all and (max-width: 767px) {
		width: 100%;
		position: static;
		padding: 25px 15px;

		.list-item {
			width: calc(50% - 16px);
		}
	}

	@media all and (max-width: 480px) {
		.list-item {
			width: calc(100% - 16px);
			margin-bottom: 20px;
		}
	}
`;

export {
	nav,
	container,
	leftCol,
	rightCol,
};
