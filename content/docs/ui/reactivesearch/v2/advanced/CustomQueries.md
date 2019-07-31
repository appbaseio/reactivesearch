---
title: 'Custom Queries'
meta_title: 'Custom Queries'
meta_description: 'Customize query using Custom Queries.'
keywords:
    - reactivesearch
    - customqueries
    - appbase
    - elasticsearch
sidebar: 'web-v2-reactivesearch'
---

### Data Aware UI components

One of the key ideas behind Reactive Search and Reactive Maps is the abstraction of a query interface.

The UI components are already associated with the data queries. For instance,

-   **SingleList** and **MultiList** components create a exact term match query based on the selected items.
-   A **RangeSlider** component creates a numeric range query based on the selected `start` and `end` values.

Components rely on the `dataField` prop for selecting the database field on which the query needs to be applied.

However, there are cases where you would wish to override the associated query with your own. For example,

### Defining a Custom Query

Each component has a `customQuery` prop that accepts a function. The function should return a query object compatible with <a href="https://www.elastic.co/guide/en/elasticsearch/reference/2.4/query-dsl.html" target="_blank">Elasticsearch Query DSL</a>. Here is a simple query object that applies a match query.

```javascript
<TextField
  ...
  customQuery={this.customQuery}
/>

this.customQuery=function() {
  return {
    "match": { "fieldName": "text to match" }
  }
}
```

Here is another example that applies a `match_phrase_prefix` query.

```javascript
<DataSearch
  ...
  customQuery={this.customQuery}
/>

this.customQuery=function() {
  return {
    "match_phrase_prefix": {
      "fieldName": {
        "query": "hello world",
        "max_expansions": 10
      }
    }
  }
}
```

### Extending a Custom Query

When you pass a function to the `customQuery` prop, it receives two parameters, `value` (current value of the component) and `props` (current props of the component). Using these parameters, you can construct a query as per your needs. For example, if you wish to use a [**TextField**](/basic-components/textfield.html) component to search on any model of a specific car you may write your component as:

```js{1-5,12-13}
const myQuery = (value, props) => ({
  match: {
    name: `${props.car} ${value}`
  }
});

...
// in your render function

<TextField
  ...
  car="Audi"
  customQuery={myQuery}
/>
```

### Data Controller Component

Reactive Maps UI library comes with a specific component that is designed to be truly customizable, [**DataController**](/basic-components/datacontroller.html). It's a UI optional component that requires defining the `customQuery` prop.

For example, let's say you want to apply a query filter to represent an end-user's global preferences within the UI without adding a widget. Data Controller allows you to define a query without needing a UI widget.

### Not familiar to Elasticsearch?

You need to write a custom query but haven't worked with Elasticsearch. Okay, as a super quick primer, Elasticsearch is a data store search engine with a NoSQL JSON data model.

The docs link above is a good way to explore ElasticSearch in depth. Another alternative to get started with the query syntax is [Mirage](https://opensource.appbase.io/mirage), a GUI for composing Elasticsearch queries.
