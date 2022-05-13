import Vue from 'vue';
import App from './App.vue';
import {
	ReactiveBase,
	ReactiveGoogleMap,
	SelectedFilters,
	SingleList,
	DataSearch,
} from '@appbaseio/reactivesearch-vue';

Vue.use(ReactiveBase);
Vue.use(DataSearch);
Vue.use(SingleList);
Vue.use(SelectedFilters);
Vue.use(ReactiveGoogleMap, {
	key: '',
});
Vue.config.productionTip = false;

new Vue({
	render: (h) => h(App),
}).$mount('#app');
