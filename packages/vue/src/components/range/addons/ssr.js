import NoSSR from 'vue-no-ssr';
/**
 * Caution: Please do not change this file without having a discussion with the Team.
 * Any change may break the umd build, we're directly replacing the line no: 14
 * `components['vue-slider-component'] = require('vue-slider-component');` in rollup umd build process with some script.
 */
// eslint-disable-next-line
export const getComponents = () => {
	const components = { NoSSR };
	if (process.browser) {
		try {
			// in older versions of nuxt, it's process.BROWSER_BUILD
			// eslint-disable-next-line
			components['vue-slider-component'] = require('vue-slider-component');
		} catch (e) {
			console.error('Unable to load vue-slider', e);
		}
	}
	return components;
};
