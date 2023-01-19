<template>
  <div class="container">
    <reactive-base
      v-bind="components.settings"
      :initial-state="store">
      <nav class="nav">
        <div class="title">Airbeds</div>
        <search-box v-bind="components.datasearch" />
      </nav>
      <client-only>
        <reactive-google-map
          :size="50"
          :style="{ height: '90vh', minWidth: '300px' }"
          :react="{ and: 'places' }"
          :default-zoom="3"
          :show-marker-clusters="false"
          component-id="map"
          data-field="location"
        >
          <template
            :style="{
              background: 'dodgerblue',
              color: '#fff',
              paddingLeft: '5px',
              paddingRight: '5px',
              borderRadius: '3px',
              padding: '10px',
            }"
            #renderItem="{ magnitude }"
          >
            <i class="fas fa-globe-europe" />
            &nbsp;{{ magnitude }}
          </template>
        </reactive-google-map>
      </client-only>
    </reactive-base>
  </div>
</template>

<script>
import { initReactivesearch, SearchBox, ReactiveBase, SelectedFilters, ResultCard, ReactiveGoogleMap, ReactiveList } from '@appbaseio/reactivesearch-vue';
import './styles/airbnb.css';

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
	datasearch: {
		componentId: 'SearchSensor',
		dataField: ['name', 'name.search'],
		autosuggest: false,
		placeholder: 'Search by house names',
		iconPosition: 'left',
		className: 'search',
		highlight: true,
		URLParams: true,
	},
	result: {
		className: 'right-col',
		componentId: 'SearchResult',
		dataField: 'name',
		size: 12,
		pagination: true,
		URLParams: true,
		react: {
			and: ['SearchSensor'],
		},
		innerClass: {
			resultStats: 'result-stats',
			list: 'list',
			listItem: 'list-item',
			image: 'image',
		},
	},
};

export default {
	name: 'App',
	components: {
		SearchBox,
		ReactiveGoogleMap,
		ReactiveBase,
		SelectedFilters,
		ReactiveList,
	},
	data() {
		return {
			components,
		};
	},
	async asyncData({ query }) {
		try {
			const store = await initReactivesearch(
				[
					{
						...components.datasearch,
						source: SearchBox,
					},
					{
						...components.result,
						source: ReactiveList,
					},
				],
				query,
				components.settings,
			);
			return {
				store,
			};
		} catch (error) {
			return {
				store: null,
				error,
			};
		}
	},
};
</script>
