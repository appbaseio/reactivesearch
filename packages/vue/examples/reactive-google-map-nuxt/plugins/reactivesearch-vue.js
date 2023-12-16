// plugins/reactivesearch-vue.js

import { ReactiveBase, SelectedFilters, SingleList, ReactiveGoogleMap } from '@appbaseio/reactivesearch-vue';

export default defineNuxtPlugin(nuxtApp => {
	nuxtApp.vueApp.component('ReactiveBase', ReactiveBase);
	nuxtApp.vueApp.component('SelectedFilters', SelectedFilters);
	nuxtApp.vueApp.component('SingleList', SingleList);
	nuxtApp.vueApp.use(ReactiveGoogleMap, { key: 'YOUR_GOOGLE_MAPS_KEY' });
});
