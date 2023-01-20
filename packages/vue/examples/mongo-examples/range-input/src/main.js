import { createApp } from 'vue';
import VueRs from '@appbaseio/reactivesearch-vue';
import App from './App.vue';

const app = createApp(App);
app.config.warnHandler = () => {};
app.use(VueRs)
app.mount('#app'); // Vue Instance - Root component
