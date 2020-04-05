---
title: 'Implement ReactiveSearch API'
meta_title: 'ReactiveSearch API - Implementation guide'
meta_description: 'ReactiveSearch API - Implementation guide. Learn more about the API concepts and see examples of each type of API.'
keywords:
    - concepts
    - appbase
    - elasticsearch
    - reactivesearch
sidebar: 'docs'
---

## Concepts

The `ReactiveSearch` API is derived from the `ReactiveSearch` library. If you're already using `ReactiveSearch` in your projects, then you will feel right at home because API maintains a 100% prop parity with the library. Even if you haven't worked with `ReactiveSearch` before, you should be able to follow along as we'll cover all aspects of `ReactiveSearch API` in this document.

### Query Identifier(ID)

Every query made via the `ReactiveSearch API` must have an `id` property defined. `id` is a unique identifier for each query. The `id` property is also useful to access the response for a particular query if multiple queries are defined within a single ReactiveSearch API call. The id can be referenced in the `react` property of any other queries that wish to also apply this query. We'll talk more about the usage of `react` property later and will explain how to reference an `id` in `react` property to combine multiple queries.

### Type of Queries

`ReactiveSearch API` has four types of queries, each serving a different use-case. You can decide which query has to be used by defining the `type` property in the query object.

#### Search Query (default)

Search queries (`type: search`) allow you to find documents for which the `value` matches in any of the fields specified in its `dataField` property. Search queries can take into account the text analysis process, partial words, as-you-type queries, can handle typo tolerance, offer response highlighting and search on synonyms. All of these are configurable by the search query's properties.

You should use this query type when:

- you want to provide an approximate or intelligent match instead of or in addition to providing an exact match.

**Example**

The below query returns all the books for which either the `title` or `description` fields match with the value as `harry`.

```js
{
	id: "book_search",
	type: "search",
	dataField: ["title", "title.keyword", "title.search", "description", "description.keyword", "description.search"],
	value: "harry"
}
```

**Note:** The above example searches on `title`, `title.keyword` and `title.search` fields.

When you use appbase.io, it indexes all the search use-case fields using a variety of analyzers so that they are searchable no matter what the context is. The table below explains the sub-fields indexed by appbase.io and when to use them:

| Field | Description | When To Use |
|-------|-------------|-------------|
| `${field}` | Analyzed field using a standard analyzer. | A good default field to search on. |
| `${field}.keyword` | Non-analyzed field. | Useful for finding exact matches. |
| `${field}.search` | Analyzed field using a {2, 9} n-gram analyzer. | This is useful for partial word matches. |
| `${field}.autosuggest` | Analyzed field using a {2, 20} edge n-gram analyzer. | This is useful for longer partial word matches, typically suited for an autosuggest search. |
| `${field}.lang` | Analyzed field using the user provided language. | This is useful when searching on text in a specific language, e.g. Spanish. It also supports matching of synonyms. |


#### Term

Term queries (`type: term`) allow you to find documents that contain an `exact` term match in the field specified in its `dataField` property. Term queries also return the terms aggregation (unique terms present for the field with the counts) for the specified `dataField`.

You use this query type when:

- you want to provide an exact match filter,
- you want to show a list of unique terms with their counts, e.g. as a facet filter.

**Note:** Term queries can further `filter` on a subset of the search results based on other queries that are applied alongside the term query using the [react](/docs/search/reactivesearch-api/APIReference#react) property.

**Example**

The below query returns all the books for which `authors.keyword` field has a value of `J.K. Rowling`.

```js
{
	id: "author_search",
	type: "term",
	dataField: ["authors.keyword"],
	value: "J.K. Rowling"
}
```

#### Range

Range (`type: range`) queries allow you to find documents that contain a range match on the fields specified in its `dataField` property. The field's mapping must of either numeric or date type.

You use this query type when:

- you want to provide a range filter that optionally can aggregate on provided intervals.

**Example**

The below query returns all the books for which the `price` field has a value between `200` to `400`.

```js
{
	id: "book_search",
	type: "range",
	dataField: ["price"],
	value: {
		start: 200,
		end: 400
	},
}
```

#### Geo
Geo queries (`type: geo`) allow you to find documents within a provided distance of a location.

You use this query type when:

- you want to search on a field of `geopoint` mapping.

**Example**

The below query returns all the restaurants within a `50` miles radius of the provided `location` value.

```js
{
	id: "restaurant_search",
	type: "geo",
	dataField: ["location"],
	value: {
		"distance": 50,
		"unit": "mi",
		"location": "22.3184816, 73.17065699999999"
	}
}
```

### How to define a query

Let's have a look at this simple search query with `ReactiveSearch` API. It retrieves all the results for which the `title` field matches the value `iphone`.

```js
{
    query: [{
        id: "phone-search",   // Unique identifier for the query
        dataField: ["title"], // data field in the database
        value: "iphone",      // search term
        size: 10              // sizes of the documents to retrieve
    }]
}
```

Instead of what would typically be an imperative query DSL, we are using a declarative API. The above query will return up to `10` documents for which the `title` field matches with the search term `iphone`. The response will have the following structure:

```js
{
    "phone-search": {
        "hits": {
            "hits": [
                {
                    ....
                },
                {
                    ....
                },
                ....
            ]
            "max_score": 6.967817,
            "total": {
                "relation": "eq",
                "value": 25
            }
        },
        "status": 200,
        "timed_out": false,
        "took": 362
    },
    "settings": { // reserved key
        "took": 369
    }
}
```

### How do multiple queries work?

It's simple to define multiple queries with the `ReactiveSearch API` endpoint. Check the example below which executes two different queries in a single API request. This is the equivalent of using the `msearch` API of ElasticSearch.

```js
{
    query: [
        {
            id: "phone-search",
			type: "search",
            dataField: ["title"],
            value: "iphone", // search term
            size: 10 // size of the documents to retrieve
        },
        {
            id: "launch-year",
            type: "term",
            dataField: ["launched_year"],
            size: 10 // size of the aggregations to retrieve
        }
    ]
}
```

The first query is a `search` query and the second query is a `term` query to return the aggregated results for the `launched_year` field.

The above query will return the response in the following shape:

```js
{
    "phone-search": {
        "hits": {
            "hits": [
                {
                    ....
                },
                {
                    ....
                },
                ....
            ]
            "max_score": 6.967817,
            "total": {
                "relation": "eq",
                "value": 25
            }
        },
        "status": 200,
        "timed_out": false,
        "took": 362
    },
    "launch-year": {
        "aggregations": {
            "launched_year": {
                ...
            }
        },
        "hits": {
            "hits": [],
            "max_score": null,
            "total": {
                "relation": "eq",
                "value": 10
            }
        },
        "status": 200,
        "timed_out": false,
        "took": 56
    },
    "settings": { // reserved key
        "took": 369
    }
}
```

### How to combine multiple queries?

In the above example, we showed an example that defines multiple queries using the `ReativeSearch API`. Now, in addition - we want a defined query to also influence another query's results. We can do this with the help of the `react` property.

```js
{
    query: [
        {
            id: "phone-search",
			type: "search",
            dataField: ["title"],
            value: "iphone",
            size: 10,
            react: { // `react` property defines a dependency on the `launch-year` query id
                and: "launch-year"
            }
        },
        {
            id: "launch-year",
            type: "term",
            dataField: ["launched_year"],
            size: 10,
            execute: false // Set `execute` property to false to prevent execution of the query
        }
    ]
}
```

### Custom and Default Queries

Although `ReactiveSearch API` covers most of the common use-cases for search, sometimes you may require a complete control over the query that is being generated. Query customization is possible with the help of `customQuery` and `defaultQuery` properties. You can read more about it in the ReactiveSearch [API Reference](/docs/search/reactivesearch-api/APIReference).


## How to implement?

### REST API

[POST /:index/_reactivesearch.v3](https://arc-api.appbase.io/?version=latest#1aef5770-2211-4607-b1f1-176de3e129ef) endpoint allows you to execute the `ReactiveSearch` queries from any platform of your choice.

For example:

```bash
curl --location --request POST 'http://{{user}}:{{password}}@{{host}}/{{index}}/_reactivesearch.v3' \
--header 'Content-Type: application/json' \
--data-raw '{
    "query": [
        {
            "id": "book_search",
            "dataField": [
                "original_title"
            ],
            "value": "harry",
            "size": 10
        }
    ]
}'
```
### Frontend libraries

We have a set of frontend libraries for different platforms that support the `ReactiveSearch API`. These libraries have a property called `enableAppbase` which can be set to `true` to use the `ReactiveSearch API` instead of using Elasticsearch's query DSL.

Here is a list of all frontend libraries available for different platforms:

| Library                |  Variant    | Docs                                               |
| -------------------- | ----------  | -----------------------------------------------------------|
| **`ReactiveSearch`** | `React`     | [Learn More](/docs/reactivesearch/v3/overview/quickstart/)    |
| **`ReactiveSearch`** | `Vue`       | [Learn More](/docs/reactivesearch/vue/overview/QuickStart/)  |
| **`SearchBox`**      | `VanillaJS` | [Learn More](/docs/reactivesearch/searchbox/api/)  |
| **`SearchBox`**      | `React`     | [Learn More](/docs/reactivesearch/react-searchbox/apireference/)  |
| **`SearchBox`**      | `Vue`       | [Learn More](/docs/reactivesearch/vue-searchbox/apireference/)  |
| **`SearchBase`**     | `VanillaJS` | [Learn More](/docs/reactivesearch/searchbase/overview/apireference/)  |
