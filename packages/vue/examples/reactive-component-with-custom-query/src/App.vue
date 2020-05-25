<template>
	<ReactiveBase
		app="carstore-dataset"
		url="https://1e47b838a035:767b5a1a-03cb-4c5f-a536-4f399c24134b@arc-cluster-appbase-tryout-k8dsnj.searchbase.io"
		:enable-appbase="true"
	>
		<div class="row">
			<div class="col">
				<ReactiveComponent
					componentId="CarSensor"
					:defaultQuery="defaultQuery"
					:customQuery="customQuery"
				>
					<div slot-scope="{ aggregations, setQuery }">
						<CustomComponent :aggregations="aggregations" :setQuery="setQuery" />
					</div>
				</ReactiveComponent>
				<DynamicRangeSlider
					componentId="Pricing"
					dataField="price"
					tooltipTrigger="hover"
					:react="{ and: 'CarSensor' }"
				/>
			</div>

			<div class="col">
				<ReactiveList
					componentId="SearchResult"
					dataField="model.keyword"
					title="ReactiveList"
					:from="0"
					:size="20"
					:pagination="true"
					:react="{
						and: ['CarSensor', 'Pricing'],
					}"
				>
					<div slot="renderItem" slot-scope="{ item }">
						<h2>{{ item.model }}</h2>
						<p>{{ item.price }} - {{ item.rating }} stars rated</p>
					</div>
				</ReactiveList>
			</div>
		</div>
	</ReactiveBase>
</template>
<script>
import CustomComponent from './CustomComponent.vue';
export default {
	name: 'App',
	components: { CustomComponent },
	methods: {
		defaultQuery() {
			return {
				aggs: {
					'brand.keyword': {
						terms: {
							field: 'brand.keyword',
							order: {
								_count: 'desc',
							},
							size: 10,
						},
					},
				},
			};
		},
		customQuery() {
			return { query: { term: { ['brand.keyword']: 'Ford' } } };
		},
	},
};
</script>
