import { css } from 'emotion';

const breakpoints = {
	small: 576,
	medium: 768,
	large: 992,
	xLarge: 1200,
};

const queries = Object.keys(breakpoints).reduce((accumulator, label) => {
	const acc = Object.assign({}, accumulator);
	if (typeof breakpoints[label] === 'string') {
		acc[label] = (...args) => css`
			@media (${breakpoints[label]}) {
				${css(...args)};
			}
		`;
	} else {
		acc[label] = (...args) => css`
			@media (min-width: ${breakpoints[label]}px) {
				${css(...args)};
			}
		`;
	}

	return acc;
}, {});

export default queries;
