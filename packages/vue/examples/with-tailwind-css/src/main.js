import Vue from "vue";
import App from "./App.vue";
import "@/assets/css/custom.css";
import "@/assets/css/tailwind.css";

Vue.config.productionTip = false;
import {
  ReactiveBase,
  ReactiveList,
  DataSearch,
} from "@appbaseio/reactivesearch-vue";

Vue.use(ReactiveBase);
Vue.use(ReactiveList);
Vue.use(DataSearch);
new Vue({
  render: (h) => h(App),
}).$mount("#app");
