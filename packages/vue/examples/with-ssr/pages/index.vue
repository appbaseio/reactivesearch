<template>
	<div class="container">
		<ReactiveBase v-bind="components.settings" :initialState="store">
			<nav class="nav">
				<div class="title">Airbeds</div>
				<DataSearch v-bind="components.datasearch" />
			</nav>
			<ReactiveList v-bind="components.result">
				<div slot="render" slot-scope="{ data }">
					<ResultCardsWrapper>
						<ResultCard
							v-bind:key="result._id"
							v-for="result in data"
							:href="result.listing_url"
						>
							<ResultCardImage :src="result.image" />
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
import './styles/airbnb.css';
import { initReactivesearch, DataSearch, ReactiveList } from '@appbaseio/reactivesearch-vue';

const components = {
	settings: {
		app: 'airbeds-test-app',
		url: 'https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@arc-cluster-appbase-demo-6pjy6z.searchbase.io',
		enableAppbase: true,
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
