// eslint-disable-next-line
import Vue from 'vue';
import { ReactiveBase, SelectedFilters, SingleList, ReactiveGoogleMap } from '@appbaseio/reactivesearch-vue';

Vue.use(ReactiveBase);
Vue.use(SelectedFilters);
Vue.use(SingleList);
Vue.use(ReactiveGoogleMap, {
	key: ''
});
