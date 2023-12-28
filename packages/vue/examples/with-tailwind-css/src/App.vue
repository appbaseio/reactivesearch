<template>
  <div
    id="app"
    class="p-3 bg-gradient-to-r from-green-400 to-blue-500 text-center">
    <reactive-base
      app="good-books-ds"
      url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
    >
      <search-box
        :data-field="['original_title', 'original_title.search', 'authors', 'authors.search']"
        :urlparams="true"
        :size="3"
        :enable-popular-suggestions="true"
        :enable-recent-searches="true"
        :inner-class="{
          input: 'bg-gray-300 border-2 border-blue-500',
        }"
        class-name="result-list-container mt-4"
        component-id="BookSensor"
      />
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
import { ReactiveBase, ReactiveList, SearchBox } from '@appbaseio/reactivesearch-vue'

export default {
	name: 'App',
	components: {
		ReactiveBase,
		ReactiveList,
		SearchBox
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
