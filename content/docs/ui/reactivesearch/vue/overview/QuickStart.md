---
title: 'ReactiveSearch Quickstart'
meta_title: 'ReactiveSearch Quickstart'
meta_description: 'Get started with ReactiveSearch.'
keywords:
    - reactivesearch
    - quickstart
    - appbase
    - elasticsearch
sidebar: 'vue-reactivesearch'
---

### Step 0: Create Boilerplate with Vue Cli

We can either add ReactiveSearch to an existing app or create a boilerplate app with [Vue Cli](https://cli.vuejs.org/guide/creating-a-project.html#vue-create). For this quickstart guide, we will use the Vue Cli.

```bash
vue create my-awesome-search && cd my-awesome-search
```

### Step 1: Install ReactiveSearch

We will fetch and install [`reactivesearch-vue`](https://www.npmjs.com/package/@appbaseio/reactivesearch-vue) module using yarn or npm.

```bash
yarn add @appbaseio/reactivesearch-vue
```

or

```bash
npm install @appbaseio/reactivesearch-vue
```

#### Use ReactiveSearch's Components

### Fully Import

```js
import Vue from 'vue';
import ReactiveSearch from '@appbaseio/reactivesearch-vue';
import App from './App';
Vue.config.productionTip = false;

Vue.use(ReactiveSearch);

/* eslint-disable no-new */
new Vue({
	el: '#app',
	components: { App },
	template: '<App/>',
});
```

The above imports ReactiveSearch entirely.

### Only import the components you need

```js
import Vue from 'vue';
import { ReactiveBase } from '@appbaseio/reactivesearch-vue';
import App from './App';

Vue.config.productionTip = false;

Vue.component(ReactiveBase.name, ReactiveBase);

/* eslint-disable no-new */
new Vue({
	el: '#app',
	components: { App },
	template: '<App/>',
});
```

---

### Step 2: Adding the first component

Lets add our first ReactiveSearch component: [ReactiveBase](/getting-started/reactivebase.html), it is a backend connector where we can configure the Elasticsearch index / authorization setup.

We will be using `kebab-case` here. You can read more about component naming convention [here](https://vuejs.org/v2/guide/components-registration.html#Name-Casing).

We will demonstrate creating an index using [appbase.io](https://appbase.io) service, although you can use any Elasticsearch backend within ReactiveBase.

![create an appbase.io app](https://i.imgur.com/r6hWKAG.gif)

**Caption:** For the example that we will build, the app is called **good-books-ds** and the associated read-only credentials are **nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d**. You can browse and clone the dataset into your own app from [here](https://opensource.appbase.io/dejavu/#?input_state=XQAAAAKJAQAAAAAAAAA9iIqnY-B2BnTZGEQz6wkFsvRMTQJ5ZqWKZTLY3aEkMgq8JpWAf6hdaFvES_EOh3Q67hkj9KexzVueOZtE9Yjzg5dWJ-8Co_BW4I0eJMMtcp-5tCsJFBZNEjgqrRMtI9N3OoxR241W75d89FYYHDzKqqAKi_BCSdnByUfb528IbiGgi-j92TSCbITs9uTy9_yjInAoiKbggwlnVy_AIXjEo0lKFzSTYxxluneRw0SMjWPvUX3wjbvnfFoP_pPSSgunirljth1UqBDKNxI6ijC5k_pdjV4G2JO5X-x4MzPpGy0oFDosAKi5GMAntlMoaJhi4vOi-TuCb4T4SODO-5WmBc8GoNbXsv_siHjA&editable=false).

We will update our `src/App.vue` file to add ReactiveBase component.

```js
<template>
  <div id="app">
    <reactive-base
      app="good-books-ds"
      credentials="nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d"
    >
      <h1>Hello from ReactiveBase 👋</h1>
    </reactive-base>
  </div>
</template>

<script>
  export default {
    name: "App",
  };
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

This is how the app should look after running the `yarn run serve` command.

![Image](https://i.imgur.com/6gKpAEI.png)

---

### Step 3: Adding Filters and Result Components

For this app, we will be using [multi-list](/search-components/multilist.html) and [single-range](/basic-components/singlerange.html) components for filtering the dataset. And [reactive-list](/search-components/reactivelist.html) component for showing the search results.

Lets add them within the ReactiveBase component. But before we do that, we will look at the important props for each.

```js
<multi-list
	componentId="Authors"
	dataField="authors.raw"
	class="filter"
	title="Select Authors"
	selectAllLabel="All Authors"
/>
```

The [**multi-list**](/search-components/multilist.html) creates a multiple selection based list UI component that is connected to a database field and shows items using the `author.raw` field in the dataset. Here is how it will look visually.

![](https://i.imgur.com/WOvQKGj.png)

Next, we will look at the [**single-range**](/basic-components/singlerange.html) component for creating a ratings based filter.

```js
<single-range
  componentId="Ratings"
  dataField="average_rating"
  :data="[
    { 'start': 0, 'end': 3, 'label': 'Rating < 3' },
    { 'start': 3, 'end': 4, 'label': 'Rating 3 to 4' },
    { 'start': 4, 'end': 5, 'label': 'Rating > 4' }
  ]"
  title="Book Ratings"
  class="filter"
/>
```

![](https://i.imgur.com/EVW0ran.png)

**single-range** filters the DB by `rating` field based on the UI choice the user makes. We also set the _Rating > 4_ option to be default selected when the UI loads up first.

Finally, we need a component to show the matching results. [**reactive-list**](/search-components/reactivelist.html) does exactly this.

```js
<reactive-list
  componentId="SearchResult"
  dataField="original_title.raw"
  className="result-list-container"
  :class="{ full: showBooks }"
  :pagination="true"
  :from="0"
  :size="5"
  :react="{and: ['Ratings','Authors']}"
>
  <div slot="renderData" slot-scope="{ item }">
    <div class="flex book-content" key="item._id">
      <img :src="item.image" alt="Book Cover" class="book-image" />
      <div class="flex column justify-center ml20">
        <div class="book-header">{{ item.original_title }}</div>
          <div class="flex column justify-space-between">
              <div>
                <div>
                  by <span class="authors-list">{{ item.authors }}</span>
                </div>
                <div class="ratings-list flex align-center">
                  <span class="stars">
                <i v-for="(item, index) in Array(item.average_rating_rounded).fill('x')" class="fas fa-star" :key="index" />
              </span>
              <span class="avg-rating">({{item.average_rating}} avg)</span>
            </div>
          </div>
          <span class="pub-year">Pub {{item.original_publication_year}}</span>
        </div>
      </div>
    </div>
  </div>
</reactive-list>
```

The `:react` prop here specifies that it should construct a query based on the current selected values of searchbox and ratingsfilter components. Every time the user changes the input value, a new query is fired -- you don't need to write a manual query for any of the UI components here, although you can override it via `:customQuery` prop.

This is how the app looks after adding ReactiveList component:

![](https://i.imgur.com/4p2Nn0i.jpg)

Now, we will put all three components together to create the UI view.

```js
<template>
  <div id="app">
    <reactive-base app="good-books-yj" credentials="gBgUqs2tV:3456f3bf-ea9e-4ebc-9c93-08eb13e5c87c" >
      <div class="filters-container">
        <multi-list
          componentId="Authors"
          dataField="authors.raw"
          class="filter"
          title="Select Authors"
          selectAllLabel="All Authors"
        />
        <single-range
          componentId="Ratings"
          dataField="average_rating"
          :data="[
            { 'start': 0, 'end': 3, 'label': 'Rating < 3' },
            { 'start': 3, 'end': 4, 'label': 'Rating 3 to 4' },
            { 'start': 4, 'end': 5, 'label': 'Rating > 4' }
          ]"
          title="Book Ratings"
          class="filter"
        />
      </div>
      <reactive-list
        componentId="SearchResult"
        dataField="original_title.raw"
        className="result-list-container"
        :pagination="true"
        :from="0"
        :size="5"
        :react="{and: ['Ratings','Authors']}"
      >
        <div slot="renderData" slot-scope="{ item }">
          <div class="flex book-content" key="item._id">
            <img :src="item.image" alt="Book Cover" class="book-image" />
            <div class="flex column justify-center ml20">
              <div class="book-header">{{ item.original_title }}</div>
                <div class="flex column justify-space-between">
                    <div>
                      <div>
                        by <span class="authors-list">{{ item.authors }}</span>
                      </div>
                      <div class="ratings-list flex align-center">
                        <span class="stars">
                      <i v-for="(item, index) in Array(item.average_rating_rounded).fill('x')" class="fas fa-star" :key="index" />
                    </span>
                    <span class="avg-rating">({{item.average_rating}} avg)</span>
                  </div>
                </div>
                <span class="pub-year">Pub {{item.original_publication_year}}</span>
              </div>
            </div>
          </div>
        </div>
      </reactive-list>
    </reactive-base>
  </div>
</template>

<script>
  export default {
    name: "app",
  };
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
```

If you have followed along so far, you should a screen similar to:

![Image](https://i.imgur.com/pFCAq8d.jpg)

We have built our entire search UI in just 80 lines!

The only thing missing at this point is the styling, ReactiveSearch doesn't use a layout system internally. For example, if you are using a grid from Bootstrap or Materialize, you can use that to style the layout. Or if you prefer to use Flex, you can use that. We can now import css to make the app look more clean.

---

### Step 4: Adding CSS

By importing `styles.css` file, here is our final app layout and responsive methods to switch between container.

```js
<script>
import "./styles.css";

export default {
  name: "app",
  data: function() {
    return {
      showBooks: window.innerWidth <= 768 ? true : false
    };
  },
  methods: {
    switchContainer: function() {
      return (this.showBooks = !this.showBooks);
    }
  }
};
</script>
```

If you have followed along, this is how our app should look now.

![](https://i.imgur.com/gAuWhsN.jpg)

For convenience, you can checkout the final code from the ReactiveSearch demos - https://github.com/appbaseio/vue-reactivesearch/tree/master/packages/demos/good-books.
