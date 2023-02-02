
<template>
  <div>
    <Search 
      :initial-state="initialState" 
      :context-collector="contextCollector" />
  </div>
</template>


<script>
import { getServerState } from '@appbaseio/reactivesearch-vue';
import Search from '../components/search.vue';

export default defineNuxtComponent({
	async asyncData() {
		const route = useRoute();
		try {
			const initialState = await getServerState(Search, route.query);
			console.log('INITIAL STATE', initialState);
			return {
				initialState,
			};
		} catch (e) {
			console.log('ERROR', e);
			console.error('error', e);
			return { error: e };
		}
	},
	created() {
		console.log('THIS IS ERROR', this.initialState, this.error);
	},
});
</script>
