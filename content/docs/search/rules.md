---
title: 'Query Rules For Clusters'
meta_title: 'Query Rules For Clusters'
meta_description: 'Query Rules are essentially `If-This-Then-That`'
keywords:
    - concepts
    - appbaseio
    - elasticsearch
    - queryrules
sidebar: 'docs'
---

## Overview

Query Rules let you make precise, predetermined changes to your search results or search queries, thus allowing you to enhance the search experience. For example, you can reposition items in a user’s search results or activate filters based on query terms. Rules can also be enabled for a fixed period of time: this makes Rules a great way of implementing sales or promotions. Query Rules are essentially `If-This-Then-That` construct - **_If_** **search query contains 'Google',** **_then_**
**promote 'Chromebook'.** Query Rules serve a very specific purpose as far as search results and merchandising is concerned. When building a commercial search product, customers more often than not require commercializing the product based on certain search queries.

![query rule dashboard](https://www.dropbox.com/s/1n4uznradc78lch/Screenshot%202020-02-20%2011.06.00.png?raw=1)

> Query rules are available with **Production I, II, III, and IV** cluster plans or with the **Enterprise Plan** for Self Hosted Appbase.io.

## Use Cases

Here are some use cases where Query Rules can help you improve search relevance

-   Dynamically update facets based on the query. Example if a user is searching for "laptops", show filters related laptops only
-   Promote result during discounts/sale on your store
-   Hide products that are not available
-   Hide irrelevant results
-   Replace search term based on data available

## Configure **If** Condition

**If** conditions help in deciding when to trigger a query rule based on which configured actions will be executed. There are 2 types of trigger

1.  **Always:**

    This is helpful when you want to execute an action with all the search requests. For example, you want to always **hide** a product that is no longer available in store.

2.  **Condition**

    This is helpful when you want to execute an action with a specific search/filter condition. Example if query `contains` a specific search term. There are 4 types of search condition which you can configure

    -   `Query is`: applied when there is an **exact** query match
    -   `Query contains`: applied when a search query contains the specified query
    -   `Query starts with`: applied when a search query starts with the specified query
    -   `Query ends with`: applied when a search query ends with the specified query

    <br />
    Here, you can also configure filter conditions, which can help you set triggers based on filtering field and value. For example, `brand` is `apple`.

You can also configure rules for specific `indexes` in your ElasticSearch cluster and for a specific `time period` (example you only want to promote result for a seasonal sale on your e-commerce store ). By default, it is applicable on all the indexes and all the time.

![configure if condition](https://www.dropbox.com/s/3zdnfuzm9bnqln3/Screenshot%202020-02-20%2010.20.25.png?raw=1)

### Advanced Editor

Query Rules also comes with an advanced editor that allows writing truly expressive trigger conditions. A condition is of the form "`$field` `$operator` `$value`". It also allows combining conditions with AND/OR and ( ... ) clauses.

![](http://recordit.co/yuOlGhAZQj.gif)

A condition can be expressed using one of the following operators. Each operator operates on the `$field` and `$value`.

| Operator Name | Description                       |
|---------------|-----------------------------------|
| `exactlyMatches` | The field's value set by the search query should exactly match the provided value. |
| `doesNotMatch` | The field's value set by the search query should not match the provided value. |
| `contains` | The provided value is contained within the field's value set by the search query. |
| `doesNotContain` | The provided value is not contained within the field's value set by the search query. |
| `startsWith` | The field's value as set by the search query starts with the provided value. |
| `doesNotStartWith` | The field's value as set by the search query does not start with the provided value. |
| `endsWith` | The field's value as set by the search query ends with the provided value. |
| `doesNotEndWith` | The field's value as set by the search query does not end with the provided value. |
| `regularExpressionMatch` | Provide a regular expression to match the field's value as set by the search query with the provided value. |

Here are some example conditions:

1. `$query exactlyMatches "iphone x"`

2. `$query contains "iphone x" AND $query doesNotContain "iphone 8"`

3. `$query contains "smart phone" AND brand exactlyMatches "apple"`

4. `$query contains "smart phone" AND (brand exactlyMatches "apple" OR brand exactlyMatches "samsung")`


> Note:
> [regexone](https://regexone.com/) is a great place to learn about regular expressions. [regexr](https://regexr.com) is a great online util to test your regular expressions.

## Configure **Then** Actions

**Then** actions help you configure the actions that you want to invoke when triggering conditions are matched. Following are the actions that you can invoke

> Note: Actions are executed in the order in which are listed in your dashboard. You can drag and drop to change the sequence of executing actions.

### Promote Results

Helps in promoting results at a certain position in your result set. For example, when a user searches for `iphone` you want to promote `air pods`.

![promote result](https://www.dropbox.com/s/sxvshcbmwn7u24j/Screenshot%202020-02-20%2010.25.52.png?raw=1)

### Hide Results

It helps in hiding certain results from getting included in the actual search results. For example, you want to hide products that not available in the store, or you want to hide results that contain irrelevant data.

![hide result](https://www.dropbox.com/s/ppnhqqwytmxqqw1/Screenshot%202020-02-20%2010.35.40.png?raw=1)

### Custom Data

Helps in sending the custom `JSON` data in the search response. This will be helpful when you want to send some extra information to the frontend, which can help in rendering more specific information.

![custom data](https://www.dropbox.com/s/nhwr6vglqouxkh5/Screenshot%202020-02-20%2010.44.18.png?raw=1)

### Replace Search Term

It helps in replacing the user’s entire search query with another query. Helps in showing relevant results to users, especially when you are aware of the analytics that certain search term is returning no results.

![replace search term](https://www.dropbox.com/s/p0he4889pkbl1u8/Screenshot%202020-02-20%2010.50.10.png?raw=1)

### Replace Search Query
This action gives you more control over the search query in a way that you can modify the whole query by using the [ElasticSearch's Query String](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html) syntax.

For example, the following query returns all the documents for which  `height` and `width` matches `10` and `20` respectively.

```bash
height:10 + width:20
```
The above is just an example of ElasticSearch query string syntax where values are fixed. You can also use the variable values captured from the `query` value as per the regular expression defined in the trigger expression.

For example, let's define the trigger expression with the help of the `advanced editor`.

![trigger expression](https://i.imgur.com/mgNERHg.png)

The above rule will only get applied when the query value is of the following pattern.

```bash
{number_x} x {number_y}
```

Now define the `query` value which will replace the original query.

```bash
height:$1 + width:$2
```

Here `$1` and `$2` are variables that will get extracted from the regex capture groups defined in the trigger expression. Now if some user makes a search with value as `10 x 20` then the final query will be `height:10 + width:20`.

![replace search query](https://i.imgur.com/6kjzXz6.png)


### Remove Words

Removing words is the progressive loosening of query constraints to include more results when none are initially found.

For example, imagine an online smartphone shop that sold a limited inventory of iPhones in only 16GB and 32GB varieties. Users searching for “iphone 5 64gb” would see no results. This is not ideal behavior - it would be far better to show users some iPhone 5 results instead of a blank page.

You can remove multiple words by using the tag based UI.

![remove words](https://i.imgur.com/bVM7oFg.png)

### Replace Words

Rules offers an alternative. You can now replace words instead of adding new ones. For example, if you make `tv` a synonym for `television`, Rules will replace `tv` with `television` so that only `television` is used to search.

![replace-word](https://i.imgur.com/ps6JH9A.png)

### Add Filter

Add Filter action allows you to define the `term` filters that will get applied on the `search` type of queries. For example, if somebody searches for `iphone` then you may want to apply a `brand` filter with value as `apple`.

![add-filter](https://i.imgur.com/fAvEjVe.png)


### Search Settings

This action helps you to define the `dataField` and `fieldWeights` for your `search` type of queries. For example, if you want to always set `product_name` as `dataField` irrespective of what user defines in the search request.

> Note: The `dataField` and `fieldWeights` values set by this rule will override the `dataField` and `fieldWeights` values set in the search request.

![search settings](https://i.imgur.com/cE2jXvS.png)

### Functions

Helps in doing more customization with search or handling edge cases around search relevancy. Functions let you implement any custom action. For example, you want to perform natural language processing on the search query.

![function](https://www.dropbox.com/s/tsrj68q3yixcp2n/Screenshot%202020-02-20%2010.59.35.png?raw=1)

For more information you can read functions [docs](/docs/search/functions/).

> Note: a function linked with Query Rule cannot have its own triggering condition.
