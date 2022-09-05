<template>
  <div class="container">
    <ReactiveBase 
      v-bind="components.settings" 
      :initial-state="store">
      <nav class="nav">
        <div class="title">Airbeds</div>
        <DataSearch v-bind="components.datasearch" />
      </nav>
      <ReactiveList v-bind="components.result">
        <div 
          slot="render" 
          slot-scope="{ data }">
          <ResultCardsWrapper>
            <ResultCard
              v-for="result in data"
              :key="result._id"
              :href="result.listing_url"
            >
              <ResultCardImage :src="result.picture_url" />
              <ResultCardTitle>
                {{ result.name }}
              </ResultCardTitle>
              <ResultCardDescription>
                <div className="price">{{ result.price }}</div>
                <p className="info">
                  {{ result.room_type }} · {{ result.accommodates }} guests
                </p>
              </ResultCardDescription>
            </ResultCard>
          </ResultCardsWrapper>
        </div>
      </ReactiveList>
    </ReactiveBase>
  </div>
</template>

<script>
import { initReactivesearch, DataSearch, ReactiveList } from '@appbaseio/reactivesearch-vue';
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
						source: DataSearch,
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
