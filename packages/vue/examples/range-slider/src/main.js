import Vue from "vue";
import App from "./App.vue";
import VueRs from "@appbaseio/reactivesearch-vue";

Vue.use(VueRs);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
