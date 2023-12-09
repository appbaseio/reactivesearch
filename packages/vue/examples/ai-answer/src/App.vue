<template>
  <div id="app">
    <reactive-base
      app="good-books-ds"
      url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
      theme-preset="light"
    >
      <search-box
        :data-field="['original_title', 'original_title.search']"
        :urlparams="true"
        :size="10"
        :enable-popular-suggestions="true"
        :popular-suggestions-config="{ size: 3, minChars: 2, index: 'good-books-ds' }"
        :enable-recent-suggestions="true"
        :recent-suggestions-config="{
          size: 3,
          index: 'good-books-ds',
          minChars: 4,
        }"
        :enable-ai="false"
        :autosuggest="true"
        class-name="result-list-container"
        component-id="BookSensor"
      />
      <a-i-answer
        :react="{ and: ['BookSensor'] }"
        :show-source-documents="true"
        :on-source-click="
          (sourceObj) => {
            // perform any side effects
            console.log('sourceObj', sourceObj);
          }
        "
        class-name="ai-answer"
        component-id="AIComponent"
        title="AI Chat Box"
      >
        <!-- <template v-slot:render="{ loading, data, error }">
					<div v-if="loading">loading...</div>
					<pre v-else-if="error">{{ JSON.stringify(error) }}</pre>
					<div
						v-else-if="data && Array.isArray(data)"
						style="width: 80%; margin: 0 auto; padding: 20px"
					>
						<div
							v-for="(message, index) in data"
							:key="index"
							:style="{
								display: 'flex',
								justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
							}"
						>
							<div :style="getMessageStyle(message)">
								{{ message.content }}
							</div>
						</div>
					</div>
				</template>
				<template v-slot:renderError="errorParam, handleRetry">
					<div>{{ JSON.stringify(errorParam) }}</div>
					<button v-on:click="handleRetry">fff</button>
				</template> -->
      </a-i-answer>
      <reactive-list
        :pagination="true"
        :size="5"
        :react="{ and: ['BookSensor'] }"
        component-id="SearchResult"
        data-field="original_title.keyword"
        class-name="result-list-container"
      >
        <template #renderItem="{ item }">
          <div 
            :id="item._id" 
            :key="item._id" 
            class="flex book-content">
            <img 
              :src="item.image" 
              alt="Book Cover" 
              class="book-image" >
            <div class="flex column justify-center ml20">
              <div class="book-header">{{ item.original_title }}</div>
              <div class="flex column justify-space-between">
                <div>
                  <div>
                    by <span class="authors-list">{{ item.authors }}</span>
                  </div>
                  <div class="ratings-list flex align-center">
                    <span class="stars">
                      <i
                        v-for="(item, index) in Array(
                          item.average_rating_rounded,
                        ).fill('x')"
                        :key="index"
                        class="fas fa-star"
                      />
                    </span>
                    <span 
                      class="avg-rating"
                    >({{ item.average_rating }} avg)</span
                    >
                  </div>
                </div>
                <span 
                  class="pub-year"
                >Pub {{ item.original_publication_year }}</span
                >
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
import { ReactiveBase, ReactiveList, SearchBox, AIAnswer } from '@appbaseio/reactivesearch-vue';

export default {
	name: 'App',
	components: { ReactiveBase, ReactiveList, SearchBox, AIAnswer },
	methods: {
		getMessageStyle(message) {
			const isSender = message.role === 'user';
			return {
				backgroundColor: isSender ? '#cce5ff' : '#f8f9fa',
				padding: '10px',
				borderRadius: '7px',
				marginBottom: '10px',
				maxWidth: '80%',
				alignSelf: isSender ? 'flex-end' : 'flex-start',
				display: 'inline-block',
				border: '1px solid',
				color: isSender ? '#004085' : '#383d41',
				position: 'relative',
				whiteSpace: 'pre-wrap',
			};
		},
	},
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
