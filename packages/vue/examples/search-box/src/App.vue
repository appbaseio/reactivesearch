<template>
  <div id="app">
    <reactive-base
      app="good-books-ds"
      url="https://reactivesearch-api-9-4-0.onrender.com"
      credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
    >
      <search-box
        :data-field="['original_title', 'original_title.search', 'authors']"
        :urlparams="true"
        :size="10"
        :autosuggest="true"
        class-name="result-list-container"
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
import './styles.css';
import { ReactiveBase, ReactiveList, SearchBox } from '@appbaseio/reactivesearch-vue';

export default {
	name: 'App',
	components: { ReactiveBase, ReactiveList, SearchBox },
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
