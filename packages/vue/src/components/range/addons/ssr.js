import NoSSR from 'vue-no-ssr';

export const getComponents = () => {
	const components = { NoSSR };
	if (process.browser) {
		// in older versions of nuxt, it's process.BROWSER_BUILD
		// eslint-disable-next-line
		const VueSlider = require('vue-slider-component');
		components['vue-slider'] = VueSlider;
	}
	return components;
};
