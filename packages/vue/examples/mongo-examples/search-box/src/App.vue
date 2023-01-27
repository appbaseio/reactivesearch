<template>
	<div id="app">
		<reactive-base
			app="default"
			url="https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/public-demo-skxjb/service/http_endpoint/incoming_webhook/reactivesearch"
			:mongodb="{ db: 'sample_airbnb', collection: 'listingsAndReviews' }"
		>
			<search-box
				class="result-list-container"
				componentId="search-component"
				:dataField="[
					{
						field: 'name',
						weight: 3,
					},
					{
						field: 'description',
						weight: 1,
					},
				]"
				:URLParams="true"
				:size="5"
			/>
			<reactive-list
				componentId="SearchResult"
				dataField="property_type"
				class="result-list-container"
				:pagination="true"
				:size="5"
				:react="{ and: ['search-component'] }"
			>
				<template class="cards-wrapper" #render="{ data }">
					<result-cards-wrapper>
						<result-card class="card" v-bind:key="result._id" v-for="result in data">
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
				</template>
			</reactive-list>
		</reactive-base>
	</div>
</template>

<script>
import './styles.css';
import {SearchBox, ReactiveList, ReactiveBase} from '@appbaseio/reactivesearch-vue'

export default {
	name: 'app',
	components:{
		SearchBox,
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
	color: #2c3e50;
}
</style>
