<template>
  <div id="app">
    <reactive-base
      app="meetup_dataset"
      url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
    >
      <div class="row">
        <reactive-list
          :from="0"
          :size="5"
          :inner-class="{
            image: 'meetup-list-image',
          }"
          :pagination="true"
          component-id="SearchResult"
          data-field="group.group_topics.topic_name_raw.keyword"
          title="Results"
          sort-by="asc"
          class="result-list-container"
        >
          <template #render="{ data }">
            <result-list-wrapper>
              <result-list
                v-for="result in data"
                :key="result._id"
                :href="result.event.event_url"
              >
                <result-list-image 
                  :small="true" 
                  :src="result.member.photo" />
                <result-list-content>
                  <result-list-title>
                    {{ result.member ? result.member.member_name : '' }} is
                    going to
                    {{ result.event ? result.event.event_name : '' }}
                  </result-list-title>
                  <result-list-description>
                    {{ result.group ? result.group.group_city : '' }}
                  </result-list-description>
                </result-list-content>
              </result-list>
            </result-list-wrapper>
          </template>
        </reactive-list>
      </div>
    </reactive-base>
  </div>
</template>

<script>
import './styles.css';
import { ReactiveBase, ReactiveList, SearchBox, SelectedFilters, ResultList  } from '@appbaseio/reactivesearch-vue'

export default {
	name: 'App',
	components: {
		ReactiveBase,
		ReactiveList,
		SearchBox,
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
