import styled from 'react-emotion';
import { css } from 'emotion';
import queries from './mediaQueries';

const solid = css`
	background-color: #1573ff;
	box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.05);
`;

const Navbar = styled('nav')`
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 90px;
	padding: ${props => (props.small ? '0 6rem' : '0 2.5rem')};
	z-index: 10;

	${props => (props.solid ? solid : null)};

	${queries.medium`
		padding: 0 2rem;
	`};

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: row;

		li {
			display: inline-flex;
			padding: 0 15px;

			a {
				color: #fff;
				padding: 5px 0;
				text-decoration: none;
				border-bottom: 1px solid transparent;
				transition: all 0.3s ease;

				&:hover,
				&:focus {
					border-bottom: 1px solid #fff;
				}
			}
		}
	}

	.img-logo {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-size: 18px;
		text-decoration: none;
		color: #fff;

		span {
			position: relative;
			margin-left: 10px;
			top: 3px;
		}
	}
`;

const logo = css`
	background-image: linear-gradient(to top, #327ab7 0%, #1e4b9c 1%, #1356cc 100%);
	padding: 5px 15px;
	border-radius: 999em;
	text-decoration: none;
`;

export default Navbar;
export { logo };
