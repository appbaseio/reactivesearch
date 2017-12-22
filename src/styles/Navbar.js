import styled from 'react-emotion';
import { css } from 'emotion';

const Navbar = styled('nav')`
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 90px;
	padding: 0 2.5rem;
	z-index: 10;

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
				transition: all .3s ease;

				&:hover, &:focus {
					border-bottom: 1px solid #fff;
				}
			}
		}
	}
`;

const logo = css`
	background-image: linear-gradient(135deg,#3733d0 0%,#764ba2 100%);
	padding: 5px 15px;
	border-radius: 999em;
	text-decoration: none;
`;

export default Navbar;
export { logo };
