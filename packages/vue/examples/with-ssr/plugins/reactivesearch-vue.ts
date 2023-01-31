// eslint-disable-next-line
import {
	ReactiveGoogleMap,
	ReactiveBase,
	ReactiveList,
	SearchBox,
} from '@appbaseio/reactivesearch-vue';

export default defineNuxtPlugin((nuxtApp) => {
	// Doing something with nuxtApp
	nuxtApp.vueApp.use(ReactiveBase);
	nuxtApp.vueApp.use(ReactiveList);
	nuxtApp.vueApp.use(SearchBox);
	nuxtApp.vueApp.use(ReactiveGoogleMap, {
		key: 'AIzaSyA9JzjtHeXg_C_hh_GdTBdLxREWdj3nsOU',
	});
});
