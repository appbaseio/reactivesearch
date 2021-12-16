<template>
	<div id="app">
		<ReactiveBase
			app="default"
			url="https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/public-demo-skxjb/service/http_endpoint/incoming_webhook/reactivesearch"
			:enable-appbase="true"
			:mongodb="{
				db: 'sample_airbnb',
				collection: 'listingsAndReviews',
			}"
		>
			<MultiList
				componentId="PropertyFilter"
				placeholder="Search for property types"
				dataField="property_type"
				class="multi-list-container"
				:showCount="true"
			/>
			<ReactiveList
				componentId="SearchResult"
				dataField="name"
				class="result-list-container"
				:pagination="true"
				:from="0"
				:size="5"
				:react="{ and: ['PropertyFilter'] }"
			>
				<div slot="renderItem" slot-scope="{ item }">
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
				</div>
			</ReactiveList>
		</ReactiveBase>
	</div>
</template>

<script>
import './styles.css';

export default {
	name: 'app',
};
</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}
</style>
