// eslint-disable-next-line
import Vue from 'vue';
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
	key: 'AIzaSyA9JzjtHeXg_C_hh_GdTBdLxREWdj3nsOU',
});
