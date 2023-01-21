import { createApp } from 'vue';
import App from './App.vue';
import "@/assets/css/custom.css";
import "@/assets/css/tailwind.css";

const app = createApp(App);
app.config.warnHandler = () => {};
app.mount('#app'); // Vue Instance - Root component
