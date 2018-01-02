import styled from 'react-emotion';

import queries from './mediaQueries';

const Image = styled('div')`
	width: calc(50% - 40px);
	margin: 20px;
	height: 300px;
	background-image: ${props => (props.src ? `url(${props.src})` : '#fafafa')};
	background-size: cover;
	border-radius: 10px;
	box-shadow: 0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07);
	transition: all .3s ease;
	cursor: pointer;
	position: relative;
	overflow: hidden;

	& > a {
		position: absolute;
		background-color: rgba(0,0,0,0.4);
		width: 100%;
		height: 100%;
		display: none;
		justify-content: center;
		align-items: center;
		text-decoration: none;
		color: #fff;
		transition: all .3s ease;
	}

	&:hover, &:focus {
		transform: scale(1.07);
		box-shadow: 0 15px 35px rgba(50,50,93,.2), 0 5px 15px rgba(0,0,0,.2);

		& > a {
			display: flex;
		}
	}

	${queries.medium`
		width: calc(50% - 20px);
		height: 200px;
		margin: 10px;
	`};

	${queries.small`
		width: 100%;
		margin: 12px 0;
	`};
`;

export default Image;
