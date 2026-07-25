<template>
  <div id="app">
    <reactive-base
      app="meetup_dataset"
      url="https://reactivesearch-api-9-4-0.onrender.com"
      credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
    >
      <div class="parent-row">
        <div class="col">
          <toggle-button
            :data="[
              { label: 'Social', value: 'Social' },
              { label: 'Adventure', value: 'Adventure' },
              { label: 'Music', value: 'Music' },
            ]"
            component-id="CitySensor"
            data-field="group.group_topics.topic_name_raw.keyword"
          />
        </div>
        <div class="col">
          <selected-filters component-id="CitySensor" />
          <reactive-list
            :from="0"
            :size="5"
            :inner-class="{
              image: 'meetup-list-image',
            }"
            :react="{
              and: ['CitySensor']
            }"
            :pagination="true"
            component-id="SearchResult"
            data-field="group.group_topics.topic_name_raw.keyword"
            title="Results"
            sort-by="asc"
            class="result-list-container"
          >
            <template #render="{ data }">
              <ResultListWrapper>
                <ResultList
                  v-for="result in data"
                  :key="result._id"
                  :href="result.event.event_url"
                >
                  <ResultListImage 
                    :small="true" 
                    :src="result.member.photo" />
                  <ResultListContent>
                    <ResultListTitle>
                      {{ result.member ? result.member.member_name : '' }} is
                      going to
                      {{ result.event ? result.event.event_name : '' }}
                    </ResultListTitle>
                    <ResultListDescription>
                      {{ result.group ? result.group.group_city : '' }}
                    </ResultListDescription>
                  </ResultListContent>
                </ResultList>
              </ResultListWrapper>
            </template>
          </reactive-list>
        </div>
      </div>
    </reactive-base>
  </div>
</template>

<script>
import './styles.css';
import { ReactiveBase, ReactiveList, ToggleButton, SelectedFilters, ResultList  } from '@appbaseio/reactivesearch-vue'

export default {
	name: 'App',
	components: {
		ReactiveBase,
		ReactiveList,
		ToggleButton,
		SelectedFilters,
		ResultList
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
