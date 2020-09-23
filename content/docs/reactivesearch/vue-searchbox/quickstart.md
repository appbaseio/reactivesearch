---
title: 'QuickStart'
meta_title: 'QuickStart to Vue SearchBox'
meta_description: 'vue-searchbox is a lightweight library that provides scaffolding to create search experiences powered by Elasticsearch.'
keywords:
    - quickstart
    - vue-searchbox
    - search library
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'vue-searchbox-reactivesearch'
---

[vue-searchbox](https://github.com/appbaseio/searchbox/tree/master/packages/vue-searchbox) provides declarative props to query Elasticsearch, and bind UI components with different types of search queries. As the name suggests, it provides a default UI component for searchbox.

## Installation

To install `vue-searchbox`, you can use `npm` or `yarn` to get set as follows:

### Using npm

```js
npm install @appbaseio/vue-searchbox
```

### Using yarn

```js
yarn add @appbaseio/vue-searchbox
```

## Basic usage

### A simple example

The following example renders an autosuggestion search bar(`search-component`) with one custom component(`result-component`) to render the results. The `result-component` watches the `search-component` for input changes and updates its UI when the user selects a suggestion.

```html
<template>
  <Search-base
    index="good-books-ds"
    credentials="a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61"
    url="https://arc-cluster-appbase-demo-6pjy6z.searchbase.io"
    :analyticsConfig="{
      recordAnalytics: true,
      enableQueryRules: true,
      userId: 'jon@appbase.io',
      customEvents: {
        platform: 'ios',
        device: 'iphoneX'
      }
    }"
  >
  <!-- An auto-complete search box to display the suggestions and filter the 
    results based on the selected value -->
  <Search-box
      id="search-component"
      :dataField="[
        {
          field: 'original_title',
          weight: 1
        },
        {
          field: 'original_title.search',
          weight: 3
        }
      ]"
      title="Search"
      defaultValue="Songwriting"
      placeholder="Search for Books"
      autosuggest
      :defaultSuggestions="[
        {
          label: 'Songwriting',
          value: 'Songwriting'
        },
        {
          label: 'Musicians',
          value: 'Musicians'
        }
      ]"
      :size="10"
      queryFormat="or"
      fuzziness="AUTO"
      showClear
      showVoiceSearch
      URLParams
      className="custom-class"
      enableQuerySuggestions
      iconPosition="left"
      :style="{ padding: 10 }"
      @valueChange="handleValue"
      @valueSelected="handleSelect"
      @queryChange="handleQueryChange"
    />
    <!-- A custom component having the `react` dependency on the
    searchbox component to display the filtered results based on the
    selected search value -->
    <search-component
      id="result-component"
      dataField="original_title"
      :react="{
        and: 'search-component'
      }"
    >
    <div
      slot-scope="{ loading, error, results }"
    >
      <div v-if="loading">Loading Results....</div>
      <div v-else-if="!!error">Something went wrong: {error.message}</div>
      <p>
        {{results.numberOfResults}} results found in {{results.time}}ms
      </p>
      <div v-bind:key="item._id" v-for="item in results.data">
        <img
          :src="item.image"
          alt="Book Cover"
        />
        <p>{{item.original_title}}</p>
      </div>
    </div>
    </search-component>
  </search-base>
</template>

<script>
import { SearchBase, SearchBox, SearchComponent } from '@appbaseio/vue-searchbox';

export default {
  name: "App",
  components: {
    SearchBase, SearchBox, SearchComponent
  },
  methods: {
    handleValue(value) {
      console.log('current value: ', value);
    },
    handleSelect(value, cause, source) {
      console.log('current value: ', value);
    },
    handleQueryChange(prevQuery, nextQuery) {
      // use the query with other js code
        console.log('prevQuery', prevQuery);
        console.log('nextQuery', nextQuery);
    },
  }
};
</script>
```

You can play with this example over [here](https://codesandbox.io/s/thirsty-fast-jhlhg?file=/src/App.vue).

### An example with a facet

```html
<template>
  <div id="app">
    <search-base
      index="good-books-ds"
      credentials="a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61"
      url="https://arc-cluster-appbase-demo-6pjy6z.searchbase.io"
      :analyticsConfig="{
        recordAnalytics: true,
        enableQueryRules: true,
        userId: 'jon@appbase.io',
        customEvents: {
          platform: 'ios',
          device: 'iphoneX'
        }
      }"
    >
      <div>
        <search-box
          id="search-component"
          :dataField="[
            {
              field: 'original_title',
              weight: 1
            },
            {
              field: 'original_title.search',
              weight: 3
            }
          ]"
          title="Search"
          placeholder="Search for Books"
          :autosuggest="true"
          :defaultSuggestions="[
            {
              label: 'Songwriting',
              value: 'Songwriting'
            },
            {
              label: 'Musicians',
              value: 'Musicians'
            }
          ]"
          :size="10"
          :debounce="100"
          queryFormat="or"
          fuzziness="AUTO"
          :showClear="true"
          :showVoiceSearch="true"
          :URLParams="true"
          :enableQuerySuggestions="true"
          iconPosition="left"
        />
        <div>
          <div>
            <search-component
              id="author-filter"
              type="term"
              dataField="authors.keyword"
              :subscribeTo="['aggregationData', 'requestStatus', 'value']"
              :URLParams="true"
              :react="{ and: ['search-component'] }"
              :value="[]"
            >
              <div
                slot-scope="{ aggregationData, loading, value, setValue }"
              >
                <div v-if="loading">Fetching Results ....</div>
                <div v-if="!loading">
                  <div
                    v-bind:key="item._key"
                    v-for="item in aggregationData.data"
                  >
                    <div key="{{item._key}}">
                      <input
                        type="checkbox"
                        :value="item._key"
                        :checked="value ? value.includes(item._key) : false"
                        @change="handleChange($event, value, setValue)"
                      />
                      <label :htmlFor="item._key">
                        {{ item._key }} ({{ item._doc_count }})
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </search-component>
          </div>
          <div>
            <search-component
              id="result-component"
              :dataField="['original_title']"
              :size="5"
              :react="{ and: ['search-component', 'author-filter'] }"
            >
              <div
                slot-scope="{ loading, error, results }"
              >
                <div v-if="loading">Fetching Results ....</div>
                <div v-if="Boolean(error)">
                  Something went wrong! Error details
                  {{ JSON.stringify(error) }}
                </div>
                <p v-if="!loading && !error">
                  {{ results.numberOfResults }} results found in
                  {{ results.time }}ms
                </p>
                <div v-if="!loading && !error">
                  <div v-bind:key="item._id" v-for="item in results.data">
                    <div key="item._id">
                      <img
                        :src="item.image"
                        alt="Book Cover"
                      />
                      <div>
                        <div >{{ item.original_title }}</div>
                        <div>
                          <div>
                              by <span>{{ item.authors }}</span>
                          </div>
                          <span>Pub {{ item.original_publication_year }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </search-component>
          </div>
        </div>
      </div>
    </search-base>
  </div>
</template>

<script>
import {
  SearchBase,
  SearchComponent,
  SearchBox
} from '@appbaseio/vue-searchbox';
import './styles.css';

export default {
  name: 'app',
  components: {
    SearchBase,
    SearchBox,
    SearchComponent
  },
  methods: {
    isChecked(value, key) {
      return value ? value.includes(key) : false;
    },
    handleChange(e, value, setValue) {
      const values = value || [];
      if (values && values.includes(e.target.value)) {
        values.splice(values.indexOf(e.target.value), 1);
      } else {
        values.push(e.target.value);
      }
      // Set filter value and trigger custom query
      setValue(values, {
        triggerDefaultQuery: false,
        triggerCustomQuery: true,
        stateChanges: true
      });
    }
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

```

## Demo

The following demo explains the `vue-searchbox` integration to build a basic search experience with a facet.

<iframe src="https://codesandbox.io/embed/github/appbaseio/searchbox/tree/master/packages/vue-searchbox/examples/demo" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

You can check out the docs for API Reference over [here](/docs/reactivesearch/vue-searchbox/apireference/).
