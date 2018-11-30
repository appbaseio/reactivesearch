import styled from 'react-emotion';

const Bubble = styled('div')`
	width: 90%;
	max-width: ${props => (props.big ? '600px' : '450px')};
	margin: 30px 0;
	background-color: ${props => (props.backgroundColor ? props.backgroundColor : '#4187c3')};
	border-radius: 10px;
	padding: 2rem;
	text-align: center;
	color: #fff;
	line-height: 1.5rem;
	position: relative;
	box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);

	&::after {
		content: '';
		position: absolute;
		top: calc(100% - 1px);
		left: calc(50% - 10px);
		z-index: 1;
		width: 0;
		height: 0;
		margin: 0 auto;
		border-left: 12px solid transparent;
		border-right: 12px solid transparent;
		border-top: 14px solid ${props => (props.backgroundColor ? props.backgroundColor : '#4187c3')};
	}

	footer {
		display: block;
		position: absolute;
		top: 100%;
		left: 0;
		margin-top: 30px;
		width: 100%;
		color: #424242;
	}
`;

export default Bubble;
