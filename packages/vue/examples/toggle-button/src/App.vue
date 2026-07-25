<template>
  <div id="app">
    <reactive-base
      app="good-books-ds"
      url="https://reactivesearch-api-9-4-0.onrender.com"
      credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
    >
      <div class="parent-row">
        <div class="col">
          <toggle-button
            :data="[
              { label: 'English', value: 'eng' },
              { label: 'French', value: 'fre' },
              { label: 'Spanish', value: 'spa' },
            ]"
            component-id="LanguageSensor"
            data-field="language_code"
          />
        </div>
        <div class="col">
          <selected-filters component-id="LanguageSensor" />
          <reactive-list
            :from="0"
            :size="5"
            :react="{
              and: ['LanguageSensor']
            }"
            :pagination="true"
            component-id="SearchResult"
            data-field="original_title"
            title="Results"
            sort-by="asc"
            class="result-list-container"
          >
            <template #renderItem="{ item }">
              <div class="flex book-content">
                <img
                  :src="item.image"
                  alt="Book Cover"
                  class="book-image"
                >
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
                            v-for="(star, index) in Array(item.average_rating_rounded).fill('x')"
                            :key="index"
                            class="fas fa-star"
                          />
                        </span>
                        <span class="avg-rating">({{ item.average_rating }} avg)</span>
                      </div>
                    </div>
                    <span class="pub-year">Pub {{ item.original_publication_year }}</span>
                  </div>
                </div>
              </div>
            </template>
          </reactive-list>
        </div>
      </div>
    </reactive-base>
  </div>
</template>

<script>
import './styles.css';
import { ReactiveBase, ReactiveList, ToggleButton, SelectedFilters } from '@appbaseio/reactivesearch-vue'

export default {
	name: 'App',
	components: {
		ReactiveBase,
		ReactiveList,
		ToggleButton,
		SelectedFilters,
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
