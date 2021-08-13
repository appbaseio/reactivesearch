---
title: 'REST'
meta_title: 'Examples using REST API'
meta_description: 'Interactive examples using ReactiveSearch REST API'
keywords:
    - REST
    - examples
    - appbase
    - elasticsearch
sidebar: 'api-reference'
---

Interactive Examples using the ReactiveSearch REST API

While appbase.io maintains 100% API compatibility with Elasticsearch, it also provides a  declarative API to query Elasticsearch. This is the recommended way to query via web and mobile apps as it prevents query injection attacks. It composes well with Elasticsearch's query DSL, and lets you make use of appbase.io features like caching, query rules, server-side search settings, and analytics.


## ReactiveSearch API Examples

You can read the API reference for the ReactiveSearch API over [here](http://docs.appbase.io/docs/search/reactivesearch-api/reference). In the following section, we will show interactive examples for using the API.

### Basic Usage

In the basic usage example, we will see how to apply a search query using the ReactiveSearch API.

<iframe frameborder="1px" width="100%" height="400px" src="https://play.reactivesearch.io/embed/7DMPYAJwc7c6ShQKdbpH"></iframe>

### Search + Facet

In this example, we will see how to apply a search and a facet query together. This makes use of two queries.

We also introduce a concept for executing a query that depends on another query using the `react` and `execute` properties. Here, the search query also utilizes the value of the facet query while returning the documents.

<iframe frameborder="1px" width="100%" height="400px" src="https://play.reactivesearch.io/embed/EP8JxD28q9ZvgWxvnGsK"></iframe>

### Search + Facet + Result

In this example, we will be using three queries: search + facet + result. If you had a UI, visualize a scenario where the user has entered something in the searchbox and selected a value in the facet filter. These two should inform the final results that get displayed.

<iframe frameborder="1px" width="100%" height="400px" src="https://play.reactivesearch.io/embed/rJ8D5eXoXhEDvZqESJ36"></iframe>

> Note: `execute` property's usage shows whether we expect the particular query to return a response. It's set to `true` only for the results (books) query, as a result, only that key is returned back.


### Search + Facet + Range + Result

In this example, we will see a more complex use-case where an additional range filter is also applied.

<iframe frameborder="1px" width="100%" height="400px" src="https://play.reactivesearch.io/embed/6BIlBCcMTypegPy5jIkH"></iframe>

### Search + Geo

In this example, we will see an application of a search query along with a geo query. We are searching for earthquakes within 100mi distance of a particular location co-ordinate.

<iframe frameborder="1px" width="100%" height="400px" src="https://play.reactivesearch.io/embed/wqWD4ExcqpWUt1NxI6R0"></iframe>

### Search on multiple indices

In this example, we make two search queries - each on a different index.

<iframe frameborder="1px" width="100%" height="400px" src="https://play.reactivesearch.io/embed/dOGzXghh3neWzy2E9mYE"></iframe>

### Return DISTINCT results

In this example, we show how to only return distinct results back from a search query, the equivalent of a DISTINCT / GROUP BY clause in SQL.

<iframe frameborder="1px" width="100%" height="400px" src="https://play.reactivesearch.io/embed/1oQWktybgk51C40HlF6x"></iframe>


### Use Elasticsearch Query DSL

In this example, we show how to use Elasticsearch's query DSL using the `defaultQuery` property. This provides the flexibility of overriding the ReactiveSearch API completely for advanced use-cases.

<iframe frameborder="1px" width="100%" height="400px" src="https://play.reactivesearch.io/embed/ypuApUdLieTU43WZh59s"></iframe>

### Combining ReactiveSearch API + Elasticsearch Query DSL

In this example, we show how to use Elasticsearch's query DSL for writing a term query using the `customQuery` property. This query is then applied to the search results query, which is composed using the ReactiveSearch API.

<iframe frameborder="1px" width="100%" height="400px" src="https://play.reactivesearch.io/embed/evOFFUyJsSGbRmrLFk80"></iframe>

### Configuring Search Settings

In this example, we see usage of advanced search settings that show how to record custom analytics events, enable query rules, and enable cache (per request).

<iframe frameborder="1px" width="100%" height="400px" src="https://play.reactivesearch.io/embed/K8NH1CvyQQPkFKh4WvR5"></iframe>
