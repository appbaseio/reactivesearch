<template>
  <div id="app">
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.1/css/all.min.css"
      integrity="sha512-gMjQeDaELJ0ryCI+FtItusU9MkAifCZcGq789FrzkiM49D8lbDhoaUaIX4ASU187wofMNlgBJ4ckbrXM9sE6Pg=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer" >
    <reactive-base
      app="good-books-ds"
      url="https://reactivesearch-api-9-4-0.onrender.com"
      credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
    >
      <div class="container">
        <div class="row">
          <search-box
            :data-field="['original_title', 'original_title.search']"
            :urlparams="true"
            :size="10"
            :show-voice-search="true"
            :autosuggest="true"
            component-id="BookSensor"
            class="searchbox"
          />
        </div>
        <div
          class="row"
        >
          <reactive-list
            :pagination="true"
            :size="10"
            :react="{ and: ['BookSensor'] }"
            component-id="SearchResult"
            data-field="original_title.keyword"
          >

            <template #render="{ data }">
              <ResultCardsWrapper>
                <ResultCard
                  v-for="result in data"
                  :key="result._id"
                  :id="result._id"
                >
                  <ResultCardImage :src="result.image" />
                  <ResultCardTitle>
                    {{ result.original_title }}
                  </ResultCardTitle>
                  <ResultCardDescription>
                    <div class="flex column justify-center">
                      <div class="flex column justify-space-between">
                        <div>
                          <div>
                            by <span class="authors-list">{{ result.authors }}</span>
                          </div>
                          <div class="ratings-list flex align-center">
                            <span class="stars">
                              <i
                                v-for="(item, index) in Array(
                                  Math.floor(result.average_rating)
                                ).fill('x')"
                                :key="index"
                                class="fas fa-star"
                              />
                            </span>
                            <span
                              class="avg-rating"
                            >({{ result.average_rating }} avg)</span
                            >
                          </div>
                        </div>
                        <span
                          class="pub-year"
                        >Pub {{ result.original_publication_year }}</span
                        >
                      </div>
                    </div>
                  </ResultCardDescription>
                </ResultCard>
              </ResultCardsWrapper>
            </template>
          </reactive-list>
        </div>
      </div>
    </reactive-base>
  </div>
</template>

<script>
import './styles.css';
import { ReactiveBase, ReactiveList, SearchBox, ResultCard } from '@appbaseio/reactivesearch-vue';

export default {
	name: 'App',
	components: { ReactiveBase, ReactiveList, SearchBox, ResultCard},
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
