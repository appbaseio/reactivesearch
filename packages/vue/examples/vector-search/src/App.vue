<template>
  <reactive-base
    app="yc-companies-dataset"
    url="https://appbase-demo-ansible-abxiydt-arc.searchbase.io"
    credentials="a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61"
    :enable-appbase="true"
  >
    <div class="container">
      <h2>Vector Search with ReactiveSearch</h2>
      <search-box
        component-id="search"
        :data-field="['name', 'one_liner']"
        placeholder="Vector search on a dataset of startup companies, e.g. search for 'gene editing'"
        :autosuggest="false"
        style="margin-bottom: 1rem"
        :URLParams="true"
      />
      <selected-filters />

      <div class="layout">
        <div class="facet-container">
          <multi-list
            component-id="industries"
            data-field="industries.keyword"
            title="Industries"
            placeholder="Filter by industries"
            :show-search="true"
            style="margin-bottom: 1rem"
            :aggregation-size="96"
            :inner-class="{ list: 'facet-list' }"
          />
        </div>

        <div class="results-container">
          <reactive-list
            component-id="results"
            vector-data-field="vector_data"
            :size="20"
            :candidates="20"
            :pagination="true"
            :react="{ and: ['search', 'industries'] }"
            :include-fields="[
              'name',
              'one_liner',
              'long_description',
              'team_size',
              'stage',
              'industries',
              'website',
              'small_logo_thumb_url',
            ]"
          >
            <template #render="{ data }">
              <div v-for="item in data" :key="item._id" class="result-item">
                <img
                  v-if="item.small_logo_thumb_url"
                  :src="item.small_logo_thumb_url"
                  :alt="`${item.name} logo`"
                  class="company-logo"
                />
                <div class="company-info">
                  <h3 class="company-name">{{ item.name }}</h3>
                  <p class="company-oneliner">
                    {{ item.one_liner || item.long_description }}
                  </p>
                  <div class="company-meta">
                    <span v-if="item.team_size" class="meta-item">
                      Team: {{ item.team_size }}
                    </span>
                    <span v-if="item.stage" class="meta-item">
                      Stage: {{ item.stage }}
                    </span>
                  </div>
                  <div
                    v-if="item.industries && item.industries.length > 0"
                    class="company-tags"
                  >
                    <span
                      v-for="ind in item.industries"
                      :key="ind"
                      class="tag"
                    >
                      {{ ind }}
                    </span>
                  </div>
                  <a
                    v-if="item.website"
                    :href="item.website"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="company-link"
                  >
                    Visit website
                  </a>
                </div>
              </div>
            </template>
            <template #renderNoResults>
              <div>No results found</div>
            </template>
          </reactive-list>

          <!-- Debug Panel - Shows the queries and responses -->
          <div class="debug-panel">
            <h3>Debug Information</h3>
            <p>
              This example demonstrates vector search using the
              <code>vectorDataField</code> and <code>candidates</code> props.
            </p>
            <ul>
              <li>
                When you search in the search box, the value is used for the
                vector search
              </li>
              <li>
                The <code>vectorDataField</code> prop points to the vector field
                in your index
              </li>
              <li>
                The <code>candidates</code> prop controls how many nearest
                neighbors to return
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </reactive-base>
</template>

<script>
import {
  ReactiveBase,
  SearchBox,
  MultiList,
  ReactiveList,
  SelectedFilters,
} from '@appbaseio/reactivesearch-vue'

export default {
  name: 'App',
  components: {
    ReactiveBase,
    SearchBox,
    MultiList,
    ReactiveList,
    SelectedFilters,
  }
}
</script>
