import styled from 'react-emotion';

import queries from './mediaQueries';

const ImageCard = styled('div')`
	width: calc(50% - 40px);
	height: auto;
	margin: 20px;
	border-radius: 10px;
	overflow: hidden;
	background-color: #fff;
	box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);

	.info {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		text-decoration: none;
		padding: 10px 15px;
		border-top: 1px solid #eee;

		h4 {
			font-weight: bold;
			color: #555;
			font-size: 16px;
		}

		a {
			margin: 0;
			width: 140px !important;
		}
	}

	${queries.medium`
		width: calc(50% - 20px);
		margin: 10px;
	`};

	${queries.small`
		width: 100%;
		margin: 12px 0;
	`};
`;

const Image = styled('div')`
	width: 100%;
	height: 300px;
	background-image: ${props => (props.src ? `url(${props.src})` : '#fafafa')};
	background-size: cover;
	transition: all 0.3s ease;

	${queries.medium`
		height: 200px;
	`};
`;

export { Image, ImageCard };
