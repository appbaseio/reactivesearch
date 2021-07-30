import Vue from "vue";
import App from "./App.vue";
import { ReactiveBase, ReactiveList, DataSearch, SelectedFilters, MultiList } from "@appbaseio/reactivesearch-vue";

Vue.use(ReactiveBase);
Vue.use(ReactiveList);
Vue.use(DataSearch);
Vue.use(SelectedFilters);
Vue.use(MultiList);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
