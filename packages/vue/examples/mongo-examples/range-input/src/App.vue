<template>
	<div id="app">
		<reactive-base
			app="default"
			url="https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/public-demo-skxjb/service/http_endpoint/incoming_webhook/reactivesearch"
			:enable-appbase="true"
			:mongodb="{ db: 'sample_airbnb', collection: 'listingsAndReviews' }"
		>
			<div class="row">
				<div class="col">
					<range-input
						dataField="accommodates"
						componentId="accomodation_filter"
						:range="{
							start: 1,
							end: 16,
						}"
						:rangeLabels="{
							start: '1 Person',
							end: '16 Persons',
						}"
					/>
				</div>
				<div class="col">
					<selected-filters />
					<reactive-list
						componentId="SearchResult"
						dataField="accommodates"
						className="result-list-container"
						:pagination="true"
						:from="0"
						:size="5"
						:react="{ and: ['accomodation_filter'] }"
					>
						<div class="cards-wrapper" slot="render" slot-scope="{ data }">
							<result-cards-wrapper>
								<result-card
									class="card"
									v-bind:key="result._id"
									v-for="result in data"
								>
									<result-card-image :src="result.images.picture_url" />
									<result-card-title>
										{{ result.name }}
									</result-card-title>
									<result-card-description>
										<div class="flex column justify-space-between">
											<div :title="result.description" class="description">
												{{ result.description }}
											</div>
											<div class="tag">
												Accomodates <span>{{ result.accommodates }}</span>
											</div>
										</div>
									</result-card-description>
								</result-card>
							</result-cards-wrapper>
						</div>
					</reactive-list>
				</div>
			</div>
		</reactive-base>
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
