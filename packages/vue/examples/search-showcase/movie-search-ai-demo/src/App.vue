<template>
  <div id="app">
    <reactive-base
      :reactivesearch-apiconfig="{
        recordAnalytics: false,
        userId: 'jon',
      }"
      :theme="{
        typography: {
          fontFamily: 'monospace',
          fontSize: '16px',
        },
      }"
      app="movies-demo-app"
      url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
      theme-preset="light"
      enable-appbase
    >
      <div class="row">
        <div class="col">
          <search-box
            :data-field="['original_title', 'original_title.search']"
            :urlparams="true"
            :size="10"
            :autosuggest="true"
            :enable-ai="false"
            class-name="result-list-container"
            component-id="BookSensor"
            searchbox-id="q_and_a_search_ui"
          />
        </div>
      </div>
      <div class="ai-answer-container">
        <a-i-answer
          :react="{ and: ['BookSensor'] }"
          class-name="ai-answer"
          component-id="AIComponent"
          title="AI Chat Box"
        />
      </div>
      <br>
      <reactive-list
        :size="10"
        :show-result-stats="false"
        :react="{
          and: 'BookSensor',
        }"
        :pagination="!isResultsLoading"
        component-id="SearchResult"
        data-field="original_title"
        class="result-list-container"
      >
        <template #renderNoResults>
          <span :style="{ color: '#fff' }">
            Oops! try searching something else.
          </span>
        </template>
        <template #render="{ data, loading, resultStats }">
          <div
            v-if="loading"
            class="results-loader"
          >
            <img
              class="loader"
              src="https://i.pinimg.com/originals/bc/56/b3/bc56b31a50e519be2ed335a47e75bc62.gif"
              alt="results loading"
            >
          </div>
          <div v-else>
            <span :style="{ color: '#fff' }">
              Showing {{ resultStats.displayedResults }} of total&nbsp;
              {{ resultStats.numberOfResults }} in {{ resultStats.time }} ms
            </span>
            <results-card-wrapper>
              <card
                v-for="item in data"
                v-bind="item"
                :key="item._id" />
            </results-card-wrapper>
          </div>
        </template>
      </reactive-list>
    </reactive-base>
  </div>
</template>

<script>
import './styles.css';
import { ReactiveBase, ReactiveList, SearchBox, AIAnswer } from '@appbaseio/reactivesearch-vue';
import Card from './components/Card.vue';

export default {
	name: 'App',
	components: { ReactiveBase, ReactiveList, SearchBox, AIAnswer, Card },
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
.ai-answer-container{
	display: block;
  margin: 40px;
}
.results-loader{
  display: flex;
  top: 0px;
  width: 100%;
  height: 50vh;
}
.loader{
  display: block;
  width: 100%;
  object-fit: contain;
}
.ai-answer{
  background: white;
  padding: 10px;
  border-radius: 10px;
}
</style>
