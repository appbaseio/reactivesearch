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

## Overview

Set Trigger allows you to specify when to invoke this function. Function can be invoked **always** or we can set **filter** based on which it will conditionally invoke the functions for specific requests only. Invoking function **always** can be helpful if we want to trigger function globally for all the incoming / outgoing requests, _example Authorize user_. We can **filter** the invocation using filter expression with environment variables. Following are the supported environment variables for which you can set expressions.

> Note: A function linked with Query Rule cannot have its own triggering condition.

| Variable    | Description                                                                                                                                                   | Example values     |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `$category` | Category is the classification of the type of the incoming request. It can be one of `docs` , `search` , `indices` , `cat` , `clusters` , `misc`, `analytics` | `search`           |
| `$acl`      | An ACL is granular classification of the category of the incoming request. You can see the full list of values over here                                      | `msearch`          |
| `$index`    | The search index/indices used in the incoming request, default to ["*"] if no index is present                                                                | `["my-index"]`     |
| `$query`    | The search query string when present, default to "" if no query is present.                                                                                   | budget smart phone |
| `$filter`   | The search filters (aka facets) if present in the search query. If no filters are passed, this will contain an empty array.                                   | `{ "year": 2012 }` |
| `$now`      | Request timestamp in seconds since epoch.                                                                                                                     | `1578485425`       |

Here are some examples on how you can set triggers

| Example                                                 | Description                                                                                    |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `$category matches 'search'`                            | Triggers when the incoming request is of type `search`.                                        |
| `$category matches 'search' and $acl matches 'msearch'` | Triggers when the incoming request is of type search and `acl` matches `msearch` specifically. |
| `'my-index' in $index`                                  | Triggers when at least `my-index` is include in the request                                    |
| `$query startsWith 'iphone'`                            | Triggers when search query starts with `iphone`                                                |
| `$filter.year matches 2012`                             | Trigger when filter on year field matches 2012                                                 |
| `$now > 1578485425`                                     | Trigger when time is greater than Jan 08 2020                                                  |

We use [expr](https://github.com/antonmedv/expr/blob/master/docs/Language-Definition.md) package to evaluate the expressions. Know more about syntax over [here](https://github.com/antonmedv/expr/blob/master/docs/Language-Definition.md).

## Example

Now let us how we can set trigger for our _Promote Result_ function [created](/docs/search/functions/create/) and [deployed](/docs/search/functions/deploy/) in previously

In our [Create Function](/docs/search/functions/create/) example we added logic to promote result `after` the query is executed on `phones` index. For that we will be executing our function after search and only for the `phones` index.

![](https://www.dropbox.com/s/ckziwma2lr2tpr7/Screenshot%202020-01-31%2009.19.09.png?raw=1)
