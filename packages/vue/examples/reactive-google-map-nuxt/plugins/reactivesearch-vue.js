// plugins/reactivesearch-vue.js

import { ReactiveBase, SelectedFilters, SingleList, ReactiveGoogleMap } from '@appbaseio/reactivesearch-vue';

// eslint-disable-next-line no-undef
export default defineNuxtPlugin(nuxtApp => {
	nuxtApp.vueApp.component('ReactiveBase', ReactiveBase);
	nuxtApp.vueApp.component('SelectedFilters', SelectedFilters);
	nuxtApp.vueApp.component('SingleList', SingleList);
	nuxtApp.vueApp.use(ReactiveGoogleMap, { key: 'AIzaSyA9JzjtHeXg_C_hh_GdTBdLxREWdj3nsOU' });
});
