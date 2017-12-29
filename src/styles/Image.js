import styled from 'react-emotion';

import queries from './mediaQueries';

const Image = styled('div')`
	width: calc(50% - 40px);
	margin: 20px;
	height: 400px;
	background: ${props => (props.src ? 'url("'+props.src+'")' : "#fafafa")};
	background-size: 760px 400px;
	background-repeat: 'repeat-y';
	border-radius: 10px;

	${queries.medium`
		width: calc(50% - 20px);
		height: 260px;
		margin: 10px;
	`};

	${queries.small`
		width: 100%;
		margin: 10px 0;
	`};
`;

export default Image;
