import styled from 'react-emotion';

import { mediaKey } from '../utils';

const Heading = styled.h1(({ theme, center }) => ({
	color: theme.primaryColor,
	fontSize: '2.5rem',
	fontWeight: 600,
	margin: 0, // since margin changes in all design
	textAlign: center ? 'center' : 'left',
	[mediaKey.medium]: {
		fontSize: '1.625rem',
	},
}));

export default Heading;
