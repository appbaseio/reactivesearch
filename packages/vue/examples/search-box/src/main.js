import { createApp } from 'vue';
import App from './App.vue';
import { ReactiveBase, ReactiveList, SearchBox } from '@appbaseio/reactivesearch-vue';

const app = createApp(App);
app.use(ReactiveBase);
app.use(ReactiveList);
app.use(SearchBox);
app.config.productionTip = false;
app.mount('#app'); // Vue Instance - Root component
