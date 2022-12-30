import { createApp } from 'vue';
import App from './App.vue';
import {
	ReactiveBase,
	ReactiveGoogleMap,
	SelectedFilters,
	SingleList,
	DataSearch,
} from '@appbaseio/reactivesearch-vue';

const app = createApp(App);
app.use(ReactiveBase);
app.use(DataSearch);
app.use(SingleList);
app.use(SelectedFilters);
app.use(ReactiveGoogleMap, {
	key: 'AIzaSyA9JzjtHeXg_C_hh_GdTBdLxREWdj3nsOU',
});
app.mount('#app');
