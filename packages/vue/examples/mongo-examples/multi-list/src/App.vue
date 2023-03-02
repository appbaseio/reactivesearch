<template>
	<div id="app">
		<reactive-base
			app="default"
			url="https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/public-demo-skxjb/service/http_endpoint/incoming_webhook/reactivesearch"
			:mongodb="{
				db: 'sample_airbnb',
				collection: 'listingsAndReviews',
			}"
		>
			<multi-list
				componentId="PropertyFilter"
				placeholder="Search for property types"
				dataField="property_type"
				class="multi-list-container"
				:showCount="true"
			/>
			<reactive-list
				componentId="SearchResult"
				dataField="name"
				class="result-list-container"
				:pagination="true"
				:from="0"
				:size="5"
				:react="{ and: ['PropertyFilter'] }"
			>
				<template #renderItem="{ item }">
					<div class="flex property-content" key="item._id">
						<img
							:src="item.images.picture_url"
							alt="property Cover"
							class="property-image"
						/>
						<div class="flex column justify-center ml20">
							<div class="property-header">{{ item.name }}</div>
							<div class="flex column justify-space-between">
								<div>
									<div>
										Property Type:
										<span class="property-type">{{ item.property_type }}</span>
									</div>
									<div class="ratings-list flex align-center">
										Review Score:
										<template v-if="!!item.review_scores.review_scores_value"
											><span class="stars">
												<i
													v-for="(item, index) in Array(
														item.review_scores.review_scores_value,
													).fill('x')"
													class="fas fa-star"
													:key="index"
												/>
											</span>
											<span class="avg-rating"
												>{{
													item.review_scores.review_scores_value
												}}
												avg</span
											></template
										>
										<template v-if="!item.review_scores.review_scores_value"
											>N/A</template
										>
									</div>
								</div>
								<span>Pub {{ item.original_publication_year }}</span>
							</div>
						</div>
					</div>
				</template>
			</reactive-list>
		</reactive-base>
	</div>
</template>

<script>
import './styles.css';
import {SearchBox, MultiList, ReactiveList, ReactiveBase} from '@appbaseio/reactivesearch-vue'

export default {
	name: 'app',
	components:{
		SearchBox,
		MultiList,
		ReactiveList,
		ReactiveBase
	}
};
</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #445c74;
}
</style>
