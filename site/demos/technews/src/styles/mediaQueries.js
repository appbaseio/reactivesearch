import { css } from 'emotion';

const breakpoints = {
	small: 576,
	medium: 768,
	large: 992,
	xLarge: 1200,
	tallPhone: '(max-width: 360px) and (min-height: 740px)',
};

// eslint-disable-next-line
export const queries = Object.keys(breakpoints).reduce((acc, label) => {
	const accumulator = acc;
	if (typeof breakpoints[label] === 'string') {
		accumulator[label] = (...args) =>
			css`
				@media (${breakpoints[label]}) {
					${css(...args)};
				}
			`;
	} else {
		accumulator[label] = (...args) =>
			css`
				@media (max-width: ${breakpoints[label]}px) {
					${css(...args)};
				}
			`;
	}

	return accumulator;
}, {});
