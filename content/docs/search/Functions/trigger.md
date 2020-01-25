---
title: 'Set Trigger'
meta_title: 'Appbase Functions'
meta_description: 'How to use functions with ElasticSearch.'
keywords:
    - concepts
    - appbase
    - elasticsearch
    - serverless
    - functions
sidebar: 'docs'
---

Set Trigger allows you to specify when to invoke this function. Function can be invoked **always** or we can set **filter** based on which it will conditionally invoke the functions for specific requests only. Invoking function **always** can be helpful if we want to trigger function globally for all the incoming / outgoing requests, _example Authorize user_. We can **filter** the invocation using filter expression with environment variables. Following are the supported environment variables for which you can set expressions.

| Variable | Description | Example values |
|---|---|---|
| `$category` | Category is the classification of the type of the incoming request. It can be one of `docs` , `search` , `indices` , `cat` , `clusters` , `misc`, `analytics` | `search` |
| `$acl` | An ACL is granular classification of the category of the incoming request. You can see the full list of values over here | `msearch` |
| `$index` | The search index/indices used in the incoming request, default to ["*"] if no index is present | `["my-index"]` |
| `$query` | The search query string when present, default to "" if no query is present. | budget smart phone |
| `$filter` | The search filters (aka facets) if present in the search query. If no filters are passed, this will contain an empty array. | `{ "year": 2012 }` |
| `$now` | Request timestamp in seconds since epoch. | `1578485425`

Here are some examples on how you can set triggers

| Example | Description |
|---|---|
| $category matches search | Filters the search requests.|
| $category matches search and $acl matches msearch | Filters the _msearch requests |
| my-index in $index | Filters the requests by my-index |
| $query startsWith iphone | Filters the requests for which search query starts with iphone |
| $filter.year matches 2012 | Filters the requests for which year filter is set to 2012 |
| $now > 1578485425 | Filters the requests made after Jan 08 2020 |

We use [expr](https://github.com/antonmedv/expr/blob/master/docs/Language-Definition.md) package to evaluate the expressions. Know more about syntax over [here](https://github.com/antonmedv/expr/blob/master/docs/Language-Definition.md).

## Example

Now let us how we can set trigger for our *Promote Result* function [created](/docs/search/Functions/create) and [deployed](/docs/search/Functions/deploy) in previously

In our [Create Function](/docs/search/Functions/create) example we added logic to promote result after the query is executed on `phones` index. For that we will be executing our function after search and only for the `phones` index.

<iframe width="600" height="315" src="https://www.youtube.com/embed/wQZ5_mbbU5I" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
