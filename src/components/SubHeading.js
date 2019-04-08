import styled from 'react-emotion';

import { mediaKey } from '../utils';

const Text = styled.p(({ theme, weight, size }) => {
	let fontSize = '1rem';
	let fontWeight = 'normal';
	if (size === 'big') {
		fontSize = '1.125rem';
	} else if (size === 'small') {
		fontSize = '0.875rem';
	}
	if (weight === 'bold') {
		fontWeight = 600;
	} else if (weight === 'light') {
		fontWeight = 300;
	}
	return {
		color: theme.primaryColor,
		fontSize,
		fontWeight,
		margin: 0, // since margin changes in all design
		[mediaKey.medium]: {
			fontSize: '0.875rem',
		},
	};
});

export default Text;
