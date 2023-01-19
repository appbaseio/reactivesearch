// eslint-disable-next-line
import VueRs, {ReactiveGoogleMap} from '@appbaseio/reactivesearch-vue';

export default defineNuxtPlugin(nuxtApp => {
	// Doing something with nuxtApp
	nuxtApp.vueApp.use(VueRs);
	nuxtApp.vueApp.use(ReactiveGoogleMap, {
		key: 'AIzaSyA9JzjtHeXg_C_hh_GdTBdLxREWdj3nsOU',
	})
})
