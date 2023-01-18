import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.config.warnHandler = () => {};
app.mount('#app'); // Vue Instance - Root component
