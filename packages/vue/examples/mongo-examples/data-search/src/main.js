import Vue from 'vue';
import App from './App.vue';
import { ReactiveBase, ReactiveList, DataSearch, ResultCard } from '@appbaseio/reactivesearch-vue';

Vue.use(ReactiveBase);
Vue.use(ReactiveList);
Vue.use(ResultCard);
Vue.use(DataSearch);
Vue.config.productionTip = false;

new Vue({
	render: (h) => h(App),
}).$mount('#app');
