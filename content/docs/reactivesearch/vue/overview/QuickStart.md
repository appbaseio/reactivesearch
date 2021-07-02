---
title: 'ReactiveSearch Vue: Quickstart'
meta_title: 'ReactiveSearch Vue: Quickstart'
meta_description: 'Getting started with ReactiveSearch Vue, a search UI components library for Elasticsearch'
keywords:
    - reactivesearch
    - quickstart
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'vue-reactivesearch'
---

### Step 0: Create Boilerplate with Vue CLI

In this quickstart guide, we will create a books based search engine based on a dataset of 10,000 books using ReactiveSearch.

This is how your final app will look like at the end of following this tutorial, in just 10 minutes 🚀.

<iframe src="https://codesandbox.io/embed/reactivesearch-vue-final-app-2ru69?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="reactivesearch-vue-final-app"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

We can either add ReactiveSearch to an existing app or create a boilerplate app with [Vue Cli](https://cli.vuejs.org/guide/installation.html). For this quick start guide, we will use the Vue CLI.



#### Install Vue Cli

```bash
yarn global add @vue/cli
```

#### Create Project

```bash
vue create my-awesome-search && cd my-awesome-search
```

or

Alternatively, you can go to Codesandbox.io and choose the Vue Template

![Vue Template, Codesandbox](https://i.imgur.com/Vl4BVZ0.png).

### Step 1: Install ReactiveSearch

We will fetch and install [`reactivesearch-vue`](https://www.npmjs.com/package/@appbaseio/reactivesearch-vue) module using yarn or npm.

```bash
yarn add @appbaseio/reactivesearch-vue
```

or

```bash
npm install @appbaseio/reactivesearch-vue
```

or

Alternatively, you can directly add the `@appbaseio/reactivesearch-vue`  dependency to codesandbox.io.


### Step 2: Register Components

To use ReactiveSearch components you need to register them in your app, you can globally import the components in the `main.js` file of your project.

#### Register all components

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

#### Only register the components you need (recommended)

```js
import Vue from 'vue';
import { ReactiveBase } from '@appbaseio/reactivesearch-vue';
import App from './App';

Vue.config.productionTip = false;

Vue.use(ReactiveBase);

new Vue({
	el: '#app',
	components: { App },
	template: '<App/>',
});
```

---

### Step 3: Adding the first component

Lets add our first ReactiveSearch component: [ReactiveBase](/docs/reactivesearch/vue/overview/ReactiveBase/), it is a backend connector where we can configure the Elasticsearch index / authorization setup.

We will be using `kebab-case` here. You can read more about component naming convention [here](https://vuejs.org/v2/guide/components-registration.html#Name-Casing).

We will demonstrate creating an index using [appbase.io](https://appbase.io) service, although you can use any Elasticsearch backend within ReactiveBase.

![create an appbase.io app](https://www.dropbox.com/s/qa5nazj2ajaskr6/wky0vrsPPB.gif?raw=1)

**Caption:** For the example that we will build, the app is called **good-books-ds** and the associated read-only credentials are **04717bb076f7:be54685e-db84-4243-975b-5b32ee241d31**. You can browse and export the dataset to JSON or CSV from [here].(https://dejavu.appbase.io/?appname=good-books-ds&url=https://04717bb076f7:be54685e-db84-4243-975b-5b32ee241d31@appbase-demo-ansible-abxiydt-arc.searchbase.io&mode=edit).

**Note:** Clone app option will not work with these credentials here have very narrow access scope (to prevent abuse).

We will update our `src/App.vue` file to add the ReactiveBase component.

```html
<template>
	<div id="app">
		<reactive-base
			url="https://appbase-demo-ansible-abxiydt-arc.searchbase.io"
			app="good-books-ds"
			credentials="04717bb076f7:be54685e-db84-4243-975b-5b32ee241d31"
			enableAppbase
		>
			<h1>Hello from ReactiveBase 👋</h1>
		</reactive-base>
	</div>
</template>
```

**Note:** You can set `enableAppbase={false}` if you are directly connecting to an Elasticsearch service without using the appbase.io API gateway. However, we **now offer an open-source and free version** of appbase.io service and highly recommend using it over querying your Elasticsearch cluster directly. appbase.io as an API gateway provides access control for search and prevents script injection attacks that are possible if you query Elasticsearch directly from frontend.



This is how the app should look after running the `yarn run serve` command.

<iframe src="https://codesandbox.io/embed/reactivesearch-quickstart-helloapp-l0mf0?fontsize=14&hidenavigation=1&theme=dark&view=preview"
	style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
	title="reactiveSearch-quickStart-helloApp"
	allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
	sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

---

### Step 4: Adding Search and Aggregation components

For this app, we will be using [data-search](/docs/reactivesearch/vue/search/DataSearch/), [multi-list](/docs/reactivesearch/vue/list/MultiList/) and [single-range](/docs/reactivesearch/vue/range/SingleRange/) components for searching and filtering on the index. And [reactive-list](/docs/reactivesearch/vue/result/ReactiveList/) component for showing the search results.

Lets add them within the ReactiveBase component. But before we do that, we will look at the important props for each.

#### DataSearch

```html
<data-search
	componentId="SearchBox"
	placeholder="Search for books or authors"
	:dataField="[
		'authors',
		'authors.autosuggest',
		'original_title',
		'original_title.autosuggest',
	]"
	:fieldWeights="[3, 1, 5, 1]"
/>
```
The [data-search](/docs/reactivesearch/vue/search/DataSearch/) component creates a searchbox UI component that queries on the specified fields with weights as specified by `fieldWeights` prop. That's all it takes to create a functional search component.

At this point, you should see the following:

<iframe src="https://codesandbox.io/embed/reactivesearch-quickstart-datasearch-g1kqq?fontsize=14&hidenavigation=1&theme=dark&view=preview"
	style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
	title="reactiveSearch-quickStart-dataSearch"
	allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
	sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

#### MultiList

Next, we will add the [multi-list](/docs/reactivesearch/vue/list/MultiList/) component. As the name suggests, it creates a multiple selection aggregation (aka facet) to filter our search results by.

```html
<multi-list
	componentId="Authors"
	dataField="authors.keyword"
	title="Popular Authors"
	:aggregationSize="5"
/>
```

Aggregation components like MultiList fire a term type query. You can think of a term query as an exact match query, unlike a search query which involves more nuances. The use of the `.keyword` suffix for the `authors` field informs the search engine that the query here is of an exact type.

The `aggregationSize` prop is used to specify the total aggregations (think buckets) that you want returned based on the dataField value.

**Note:** The `dataField` value in MultiList is of string type, since an aggregation is always performed on a single field. In contrast, you may want to search on multiple fields in different ways, so the DataSearch component uses an array of fields instead.

#### SingleRange

Next, we will add the [single-range](/docs/reactivesearch/vue/range/SingleRange/) component for creating a ratings based filter for our book search.

```html
<single-range
    componentId="Ratings"
	dataField="average_rating"
	defaultValue="All Books"
	:data="[
		{ start: 0, end: 5, label: 'All Books' },
		{ start: 4, end: 5, label: '4 stars and up' },
		{ start: 3, end: 5, label: '3 stars and up' },
	]"
	title="Book Ratings"
/>
```

The SingleRange operates on a numeric datatype field and fires a range query. The `data` prop of SingleRange allows specifying a [start, end] range and a label associated with it. Using `defaultValue`, we can preselect a particular option. In this case, we're preselecting all the books that have a rating of `All Books`.

At this point, this is how our app should be looking:

<iframe src="https://codesandbox.io/embed/reactivesearch-quickstart-aggregatedcomponents-tl12t?fontsize=14&hidenavigation=1&theme=dark&view=preview"
	style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
	title="reactiveSearch-quickStart-aggregatedComponents"
	allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
	sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

### Step 5: Adding Results Component

Finally, we need a component to show the matching results. [**reactive-list**](/docs/reactivesearch/vue/result/ReactiveList/) does exactly this.

```html
 <reactive-list
	componentId="SearchResult"
	dataField="original_title.keyword"
	:pagination="true"
	:from="0"
	:size="5"
	:react="{ and: ['Ratings', 'Authors', 'SearchBox'] }"
	>
	<div slot="renderItem" slot-scope="{ item }">
		<div key="item._id">
			<img
				:src="item.image"
				alt="Book Cover"
			/>
			<div>{{ item.original_title }}</div>
			<div>by {{ item.authors }}</div>               
			<div>({{ item.average_rating }} avg)</div>                    
			<div>Pub {{ item.original_publication_year }}</div>
		</div>
	</div>
</reactive-list>
```

The `react` prop here specifies that the result should depend on the queries for our searchbox, authors filter and the ratings filter. It's pretty neat!. Every time the user changes the input value, a new query is fired -- you don't need to write a manual query for any of the UI components here, although you can override it via `customQuery` prop.

Now, we will put all three components together to create the UI view.

```html
<template>
  <div id="app">
    <reactive-base
      url="https://appbase-demo-ansible-abxiydt-arc.searchbase.io"
      app="good-books-ds"
      credentials="04717bb076f7:be54685e-db84-4243-975b-5b32ee241d31"
      enableAppbase
    >
      <data-search
        componentId="SearchBox"
        placeholder="Search for books or authors"
        :dataField="[
          'authors',
          'authors.autosuggest',
          'original_title',
          'original_title.autosuggest',
        ]"
        :fieldWeights="[3, 1, 5, 1]"
      />
      <multi-list
        componentId="Authors"
        dataField="authors.keyword"
        title="Select Authors"
        selectAllLabel="All Authors"
        placeholder="Search for authors"
        :aggregationSize="5"
      />
      <single-range
		componentId="Ratings"
		dataField="average_rating"
		defaultValue="All Books"
		:data="[
			{ start: 0, end: 5, label: 'All Books' },
			{ start: 4, end: 5, label: '4 stars and up' },
			{ start: 3, end: 5, label: '3 stars and up' },
		]"
		title="Book Ratings"
	  />

      <reactive-list
        componentId="SearchResult"
        dataField="original_title.keyword"
        :pagination="true"
        :from="0"
        :size="5"
        :react="{ and: ['Ratings', 'Authors', 'SearchBox'] }"
      >
        <div slot="renderItem" slot-scope="{ item }">
          <div key="item._id">
            <img :src="item.image" alt="Book Cover" />
            <div>{{ item.original_title }}</div>
            <div>by {{ item.authors }}</div>
            <div>({{ item.average_rating }} avg)</div>
            <div>Pub {{ item.original_publication_year }}</div>
          </div>
        </div>
      </reactive-list>
    </reactive-base>
  </div>
</template>

```

At this point, you should be seeing our entire app functionally (minus the layouting and styles):

<iframe src="https://codesandbox.io/embed/reactivesearch-quickstart-results-t2mip?fontsize=14&hidenavigation=1&theme=dark&view=preview"
	style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
	title="reactiveSearch-quickStart-results"
	allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
	sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

We have built our entire search UI in just 80 lines!

The only thing missing at this point is the styling. ReactiveSearch doesn't use a layout system internally. For example, if you are using a grid from Bootstrap or Materialize, you can use that to style the layout. Or if you prefer to use Flex, you can use that. We can now import CSS to make the app look cleaner.

---

### Step 6: Adding Layout and Styles

ReactiveSearch doesn't use a layout system internally. For example, if you are using a grid from Bootstrap or Materialize, you can use that to style the layout. Or if you prefer to use Flex, you can use that. Here, we will just make use of CSS Flex.

```html
<reactive-base>
    <div v-bind:style="{ 'display': 'flex', 'flex-direction': 'row' }">
        <div
          v-bind:style="{
            'width': '30%',
            'display': 'flex',
            'flex-direction': 'column',
            'text-align': 'left',
            'padding': '10px',
			'font-size': '14px',
          }"
        >
            <multi-list/>
            <single-range/>
        </div>
        <div
          v-bind:style="{
            'display': 'flex',
            'flex-direction': 'column',
            'padding': '10px',
            'margin-top': '25px',
            'width': '66%',
          }"
        >
            <data-search/>
            <reactive-list/>
        </div>
    </div>
</reactive-base>
```

To make the cards look aligned, add styles to the wrapper `div` within the reactive-list:

```html
<reactive-list
	componentId="SearchResult"
	dataField="original_title.keyword"
	:class="{ full: showBooks }"
	:pagination="true"
	:from="0"
	:size="5"
	:react="{ and: ['Ratings', 'Authors', 'SearchBox'] }"
	>
	<div slot="renderItem" slot-scope="{ item }">
		<div
		key="item._id"
		v-bind:style="{
			display: 'flex',
			background: 'white',
			margin: '10px 0',
			'box-shadow':
			'0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
		}"
		>
			<img
				:src="item.image"
				alt="Book Cover"
				v-bind:style="{
				height: '150px',
				width: '110px',
				'background-size': 'cover',
				}"
			/>
			<div v-bind:style="{ 'text-align': 'left' }">
				<div
				v-bind:style="{
					'font-weight': 'bold',
					padding: '10px 10px 5px 10px',
				}"
				>
					{{ item.original_title }}
				</div>
				<div v-bind:style="{ padding: '5px 10px' }">
					by {{ item.authors }}
				</div>
				<div v-bind:style="{ padding: '5px 10px' }">
					({{ item.average_rating }} avg)
				</div>
				<div v-bind:style="{ padding: '5px 10px' }">
					Pub {{ item.original_publication_year }}
				</div>
			</div>
		</div>
	</div>
</reactive-list>
```

If you have followed along, this is how our app should look now.

<iframe src="https://codesandbox.io/embed/reactivesearch-vue-final-app-2ru69?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="reactivesearch-vue-final-app"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

For convenience, you can check out the final code from the ReactiveSearch demos - https://github.com/appbaseio/reactivesearch/tree/next/packages/vue/demos/good-books.