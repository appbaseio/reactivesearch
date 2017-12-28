import styled from 'react-emotion';

const Bubble = styled('div')`
	width: 90%;
	max-width: 500px;
	margin: 30px auto;
	background-color: #4187c3;
	border-radius: 10px;
	padding: 2rem;
	text-align: center;
	color: #fff;
	line-height: 1.5rem;
	position: relative;
	box-shadow: 0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07);

	&::after {
		content: '';
		position: absolute;
		top: 100%;
		left: calc(50% - 10px);
		width: 0;
		height: 0;
		margin: 0 auto;
		border-left: 12px solid transparent;
		border-right: 12px solid transparent;
		border-top: 14px solid #4187c3;
	}
`;

export default Bubble;
