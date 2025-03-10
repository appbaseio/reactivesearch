/* eslint-disable import/no-extraneous-dependencies */
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default {
	plugins: [vue(), vueJsx()],
	optimizeDeps: {
		include: [
			'@appbaseio/reactivecore',
			'@appbaseio/reactivesearch-vue',
			'fast-deep-equal',
		],
	},
    server: {
        allowedHosts: ['7qez3-5173.csb.app']
    }
};
