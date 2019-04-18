<template>
  <div class="container">
    <ReactiveBase v-bind="components.settings" :initialState="store">
      <nav class="nav">
        <div class="title">Airbeds</div>
        <DataSearch v-bind="components.datasearch"/>
      </nav>
      <ResultCard v-bind="components.resultcard"/>
    </ReactiveBase>
  </div>
</template>

<script>
import './styles/airbnb.css';
import { initReactivesearch, DataSearch, ResultCard } from '@appbaseio/reactivesearch-vue';

const components = {
	settings: {
		app: 'airbeds-test-app',
		credentials: 'X8RsOu0Lp:9b4fe1a4-58c6-4089-a042-505d86d9da30',
		type: 'listing',
		theme: {
			colors: {
				primaryColor: '#FF3A4E',
			},
		},
	},
	datasearch: {
		componentId: 'SearchSensor',
		dataField: 'name',
		autosuggest: false,
		placeholder: 'Search by house names',
		iconPosition: 'left',
		className: 'search',
		highlight: true,
		URLParams: true,
	},
	resultcard: {
		className: 'right-col',
		componentId: 'SearchResult',
		dataField: 'name',
		size: 12,
		renderData: item => ({
			title: item.name,
			image: item.image,
			url: item.listing_url,
			description: `<div>
								<div className="price">${item.price}</div>
								<p className="info">
									${item.room_type} · ${item.accommodates} guests
								</p>
							</div>`,
		}),
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
	name: 'app',
	data: function() {
		return {
			components,
		};
	},
	async asyncData({ params, query }) {
		try {
			const store = await initReactivesearch(
				[
					{
						...components.datasearch,
						source: DataSearch,
					},
					{
						...components.resultcard,
						source: ResultCard,
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
