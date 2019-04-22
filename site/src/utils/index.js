import { css } from 'emotion';
// generate media query for emotion styles
export const breakpoints = {
	// Numerical values will result in a max-width query
	xsmall: 420,
	small: 576,
	ipad: 767,
	medium: 768,
	large: 992,
	ipadPro: 1024,
	xlarge: 1200,
	// String values will be used as is
	tallPhone: '(max-width: 360px) and (min-height: 740px)',
};

// media queries for object styles
export const mediaKey = Object.keys(breakpoints).reduce(
	(acc, label) => ({
		...acc,
		[label]: `@media (max-width: ${breakpoints[label]}px)`,
	}),
	{},
);

// media queries for string styles
export const media = Object.keys(breakpoints).reduce((acc, label) => {
	const prefix = typeof breakpoints[label] === 'string' ? '' : 'max-width:';
	const suffix = typeof breakpoints[label] === 'string' ? '' : 'px';
	const accumulator = acc;
	accumulator[label] = cls => css`
			@media (${prefix + breakpoints[label] + suffix}) {
				${cls};
			}
		`;
	return accumulator;
}, {});

export default media;
