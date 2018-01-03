import { css } from 'emotion';

const ratingsList = css`
	list-style: none;
	margin: 0;
	padding: 0;

	li {
		display: flex;
		height: 24px;
		flex-direction-row;
		justify-content: flex-start;
		align-items: center;
		cursor: pointer;

		span {
			font-size: 0.85rem;
			padding-left: 4px;
		}

		&.active span {
			font-weight: bold;
		}
	}
`;

const starRow = css`
	display: inline-flex;
	flex-direction: row;

	svg {
		width: 18px;
		height: 18px;
		margin-right: 2px;
	}
`;

const whiteStar = css`
	polygon {
		fill: #ccc;
	}
`;

export {
	ratingsList,
	starRow,
	whiteStar,
};
