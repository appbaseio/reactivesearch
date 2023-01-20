<template>
  <div class="container">
    <reactive-base
      v-bind="components.settings"
      :initial-state="store">
      <nav class="nav">
        <div class="title">Airbeds</div>
        <search-box v-bind="components.SearchBox" />
      </nav>
    </reactive-base>
  </div>
</template>

<script>
import { initReactivesearch, SearchBox, ReactiveBase } from '@appbaseio/reactivesearch-vue';
import '../styles/airbnb.css';

const components = {
	settings: {
		app: 'airbnb-dev',
		url: 'https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io',
		enableAppbase: true,
		theme: {
			colors: {
				primaryColor: '#FF3A4E',
			},
		},
	},
	SearchBox: {
		componentId: 'SearchSensor',
		dataField: ['name', 'name.search'],
		autosuggest: false,
		placeholder: 'Search by house names',
		iconPosition: 'left',
		className: 'search',
		highlight: true,
		URLParams: true,
	},
};

export default defineNuxtComponent({
	name: 'AfreshComponent',
	components: {ReactiveBase, SearchBox},
	async asyncData() {
		try {
			const store = await initReactivesearch(
				[
					{
						...components.SearchBox,
						source: SearchBox,
					}
				],
				null,
				components.settings,
			);
			return {
				components,
				store,
			};
		} catch (error) {
			return {
				data: {
					components,
					store: null,
					error,
				}
			};
		}
	},
});
</script>
