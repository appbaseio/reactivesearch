<template>
  <div id="app">
    <reactive-base
      :mongodb="{ db: 'sample_airbnb', collection: 'listingsAndReviews' }"
      app="default"
      url="https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/public-demo-skxjb/service/http_endpoint/incoming_webhook/reactivesearch"
    >
      <div class="row">
        <div class="col">
          <range-input
            :range="{
              start: 1,
              end: 16,
            }"
            :range-labels="{
              start: '1 Person',
              end: '16 Persons',
            }"
            data-field="accommodates"
            component-id="accomodation_filter"
          />
        </div>
        <div class="col">
          <selected-filters />
          <reactive-list
            :pagination="true"
            :from="0"
            :size="5"
            :react="{ and: ['accomodation_filter'] }"
            component-id="SearchResult"
            data-field="accommodates"
            class-name="result-list-container"
          >
            <template 
              class="cards-wrapper" 
              #render="{ data }">
              <result-cards-wrapper>
                <result-card
                  v-for="result in data"
                  :key="result._id"
                  class="card"
                >
                  <result-card-image :src="result.images.picture_url" />
                  <result-card-title>
                    {{ result.name }}
                  </result-card-title>
                  <result-card-description>
                    <div class="flex column justify-space-between">
                      <div 
                        :title="result.description" 
                        class="description">
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
        </div>
      </div>
    </reactive-base>
  </div>
</template>

<script>
import './styles.css';
import { RangeInput, ReactiveList, ReactiveBase} from '@appbaseio/reactivesearch-vue'

export default {
	name: 'App',
	components:{
		RangeInput,
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
