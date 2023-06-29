import { createApp } from 'vue';
import VueRS from '@appbaseio/reactivesearch-vue'
import App from './App.vue';


const app = createApp(App);
app.use(VueRS);
app.mount('#app'); // Vue Instance - Root component
