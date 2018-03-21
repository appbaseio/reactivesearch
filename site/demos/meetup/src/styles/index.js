import { css } from 'emotion';

const header = css`
	width: 100%;
	min-height: 80px;
	background-color: #f64060;
	text-align: center;
	padding: 60px 20px 0;

	h1 {
		color: #fff;
		margin: 0;
		padding: 0;
		color: 32px;
	}
`;

const filters = css`
	width: 90%;
	max-width: 800px;
	height: 70px;
	margin: 0 auto;
	position: relative;
	top: 35px;
	z-index: 10;
	padding: 0 12px;
	border-radius: 4px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	background-color: #424242;

	.geo {
		width: 420px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		& > div {
			width: calc(50% - 5px);
			border-radius: 4px;
			background-color: transparent;
		}

		input, button {
			border-radius: 4px;
			overflow: hidden;
		}
	}

	.search {
		width: calc(100% - 430px);
		border-radius: 4px;
		overflow: hidden;
	}
`;

const listContainer = css`
	padding: 40px 25px 25px;
	position: absolute;
	overflow-y: scroll;
	width: 50%;
	height: 100%;

	.user {
		width: 100%;
		padding: 12px;
		border-radius: 4px;
		background-color: #fafafa;
		margin: 12px 0;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;

		.user__image {
			width: 100px;
			height: 100px;
			background-size: cover;
			background-position: top center;
			border-radius: 4px;
			background-color: #fff;
		}

		.user__info {
			width: calc(100% - 115px);
			font-size: 14px;
			color: #888;

			h3 {
				font-size: 16px;
				color: #222;
			}
		}
	}
`;

const mapContainer = css`
	width: 50%;
	height: 100%;
	position: absolute;
	right: 0;

	.checkbox-label {
		font-size: 15px;
	}
`;

export {
	header,
	filters,
	listContainer,
	mapContainer,
};
