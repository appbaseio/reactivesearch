<template>
	<reactive-base
		app="carstore-dataset"
		url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
		:enable-appbase="true"
	>
		<div class="row">
			<div class="col">
				<reactive-component
					componentId="CarSensor"
					:defaultQuery="
						() => ({
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
						})
					"
				>
					<template #default="{ aggregations, setQuery }">
						<CustomComponent :aggregations="aggregations" :setQuery="setQuery" />
					</template>
				</reactive-component>
			</div>

			<div class="col">
				<reactive-list
					componentId="SearchResult"
					dataField="model.keyword"
					title="ReactiveList"
					:from="0"
					:size="20"
					:pagination="true"
					:react="{
						and: 'CarSensor',
					}"
				>
					<template #renderItem="{ item }">
						<h2>{{ item.model }}</h2>
						<p>{{ item.price }} - {{ item.rating }} stars rated</p>
					</template>
				</reactive-list>
			</div>
		</div>
	</reactive-base>
</template>
<script>
import { ReactiveComponent, ReactiveList, ReactiveBase } from '@appbaseio/reactivesearch-vue'
import CustomComponent from './CustomComponent.vue';
import './styles.css';

export default {
	name: 'app',
	components:{
		ReactiveComponent,
		CustomComponent,
		ReactiveList,
		ReactiveBase
	}
};
</script>
