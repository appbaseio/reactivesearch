---
title: 'API Reference'
meta_title: 'ReactiveSearch API Reference'
meta_description: 'ReactiveSearch API Reference. Learn about all the props and how to use them.'
keywords:
    - concepts
    - appbase
    - elasticsearch
    - reactivesearch
sidebar: 'docs'
---

This guide helps you to learn more about the each property of `ReactiveSearch` API and explains that how to use those properties to build the query for different use-cases.

`ReactiveSearch API` request body can be divided into two parts, `query` and `settings`. The `query` key is an `Array` of objects where each object represents a `ReactiveSearch` query to retrieve the results. Settings(`settings`) is an optional key which can be used to control the search experience. Here is an example of the request body of `ReactiveSearch` API to get the results for which the `title` field matches with `iphone`.

```js
{
    query: [{
        id: "phone-search",
        dataField: ["title"],
        size: 10,
        value: "iphone"
    }],
    settings: { // optional
        recordAnalytics: true, // to enable the analytics
        enableQueryRules: true, // to enable the query rules
    }
}
```

## Query Properties

### id

The unique identifier for the query can be referenced in the `react` property of other queries. The response of the `ReactiveSearch API` is a map of query ids to `Elasticsearch` response which means that `id` is also useful to retrieve the response for a particular query.

| Type     | Applicable on query of type | Required |
| -------- | --------------------------- | -------- |
| `string` | `all`                       | true     |

### dataField

database field(s) to be queried against. Accepts an `Array`, useful for applying search across multiple fields.

| Type            | Applicable on query of type | Required |
| --------------- | --------------------------- | -------- |
| `Array<string>` | `all`                       | true     |

> Note:
> Multiple `dataFields` are not applicable for `term` and `geo` queries.

### fieldWeights

To set the search weight for the database fields, useful when you are using more than one [dataField](/docs/search/reactivesearch-api/reference/#datafield). This prop accepts an array of `floats`. A higher number implies a higher relevance weight for the corresponding field in the search results.

For example, the below query has two data fields defined and each field has a different field weight.

```js
{
    query: [{
        id: "book-search",
        dataField: ["original_title", "description"],
        fieldWeights: [3, 1],
        value: "harry"
    }]
}
```

| Type         | Applicable on query of type | Required |
| ------------ | --------------------------- | -------- |
| `Array<int>` | `search`                    | false    |

### type

This property represents the type of the query which is defaults to `search`, valid values are `search`, `term`, `range` & `geo`. You can read more [here](/docs/search/reactivesearch-api/implement/#type-of-queries).

| Type     | Applicable on query of type | Required |
| -------- | --------------------------- | -------- |
| `string` | `all`                       | false    |

### value

Represents the value for a particular query [type](/docs/search/reactivesearch-api/reference/#type), each kind of query has the different type of value format.

| Type  | Applicable on query of type | Required |
| ----- | --------------------------- | -------- |
| `any` | `all`                       | false    |

You can check the `value` format for different `type` of queries:

#### format for `search` type

The value can be a `string` or `int`.

#### format for `term` type

The value can be a `string` or `Array<string>`.

#### format for `range` type

The value should be an `Object` in the following shape:

```js
{
   "start": int|string, // optional
   "end": int|string, // optional
   "boost": int
}
```

> Note:
>
> Either `start` or `end` property must present in the value.

#### format for `geo` type

The value should be an `Object` in the following shape:

```js
{
   // The following properties can be used to get the results within a particular distance and location.
   "distance": int,
   "location": string, // must be in `{lat}, {lon}` format
   "unit": string,
   // The following properties can be used to get the results for a particular geo bounding box.
   "geoBoundingBox": {
       topLeft: string, // required, must be in `{lat}, {lon}` format
       bottomRight: string, // required, must be in `{lat}, {lon}` format
   }
}
```
> Note: The `geoBoundingBox` property can not be used with `location` property, if both are defined than `geoBoundingBox` value will be ignored.

The below example represents a **geo distance** query:

```js
    {
        "id": "distance_filter",
        "type": "geo",
        "dataField": ["location"],
        "value":  {
            "distance":10,
            "location":"22.3184816, 73.17065699999999",
            "unit": "mi/yd/ft/km/m/cm/mm/nmi"
        }
    }
```

The below example represents a **geo bounding box** query:
```js
    {
        "id": "bounding_box_filter",
        "type": "geo",
        "dataField": ["location"],
        "value":  {
            "geoBoundingBox": {
                "topLeft": "40.73, -74.1",
                "bottomRight": "40.01, -71.12",
            }
        }
    }
```
### size

To set the number of results to be returned by a query.

| Type  | Applicable on query of type | Required |
| ----- | --------------------------- | -------- |
| `int` | `all`                       | false    |

### from

Starting document offset. Defaults to `0`.

| Type  | Applicable on query of type | Required |
| ----- | --------------------------- | -------- |
| `int` | `search`,`geo`,`range`      | false    |

### pagination
This property allows you to implement the `pagination` for `term` type of queries. If `pagination` is set to `true` then appbase will use the [composite aggregations](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-composite-aggregation.html) of Elasticsearch instead of [terms aggregations](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-terms-aggregation.html).

| Type  | Applicable on query of type | Required |
| ----- | --------------------------- | -------- |
| `bool` | `term`                     | false    |

> Note:
> 1. Sort by as `count` doesn't work with composite aggregations i.e when `pagination` is set to `true`.
> 2. The [missingLabel](/docs/search/reactivesearch-api/reference/#missinglabel) property also won't work when composite aggregations have been used.

### aggregationSize

To set the number of buckets to be returned by aggregations.

| Type  | Applicable on query of type | Required |
| ----- | --------------------------- | -------- |
| `int` | `term`                      | false    |

> Note:
> 1. This property can also be used for `search` type of queries when `aggregationField` is set.
> 2. This is a new feature and only available for appbase versions >= 7.41.0.

### queryFormat

Sets the query format, can be `or` or `and`. Defaults to `or`.

- `or` returns all the results matching any of the search query text's parameters. For example, searching for "bat man" with or will return all the results matching either "bat" or "man".

- On the other hand with `and`, only results matching both "bat" and "man" will be returned. It returns the results matching all of the search query text's parameters."

| Type     | Applicable on query of type | Required |
| -------- | --------------------------- | -------- |
| `string` | `all`                       | false    |


### fuzziness

Useful for showing the correct results for an incorrect search parameter by taking the fuzziness into account. For example, with a substitution of one character, `fox` can become `box`. Read more about it in the elastic search https://www.elastic.co/guide/en/elasticsearch/guide/current/fuzziness.html.

| Type           | Applicable on query of type | Required |
| -------------- | --------------------------- | -------- |
| `int | string` | `search`                    | false    |

> Note:
>
> This property doesn't work when the value of [queryFormat](/docs/search/reactivesearch-api/reference/#queryformat) property is set to `and`."

### categoryField

Data field which has the category values mapped.

| Type     | Applicable on query of type | Required |
| -------- | --------------------------- | -------- |
| `string` | `search`                    | false    |

### categoryValue

This is the selected category value. It is used for informing the search result.

| Type     | Applicable on query of type | Required |
| -------- | --------------------------- | -------- |
| `string` | `search`                    | false    |

### sortBy

This property can be used to sort the results in a particular format. The valid values are:
- `asc`, sorts the results in ascending order,
- `desc`, sorts the results in descending order,
- `count`, sorts the aggregations by `count`.


| Type     | Applicable on query of type | Required |
| -------- | --------------------------- | -------- |
| `string` | `all`*                      | false    |

> Note:
>
> Please note that the `count` value can only be applied when the query type is of `term`. In addition, the [pagination](/docs/search/reactivesearch-api/reference/#pagination) property for the query needs to be set to `false` (default behavior). When pagination is `true`, a composite aggregation is used under the hood, which doesn't support ordering by count.

### react

To specify dependent queries to update that particular query for which the react prop is defined. You can read more about it [here](/docs/reactivesearch/v3/advanced/reactprop/).

| Type     | Applicable on query of type | Required |
| -------- | --------------------------- | -------- |
| `Object` | `all`                       | false    |


### highlight

This property can be used to enable the highlighting in the returned results. If set to `false`, [highlightField](/docs/search/reactivesearch-api/reference/#highlightfield) and [customHighlight](/docs/search/reactivesearch-api/reference/#customhighlight) values will be ignored.

| Type   | Applicable on query of type | Required |
| ------ | --------------------------- | -------- |
| `bool` | `all`                       | false    |

### highlightField

When highlighting is `enabled`, this property allows specifying the fields which should be returned with the matching highlights. When not specified, it defaults to apply highlights on the field(s) specified in the `dataField` prop.

| Type            | Applicable on query of type | Required |
| --------------- | --------------------------- | -------- |
| `Array<string>` | `all`                       | false    |

### customHighlight

It can be used to set the custom highlight settings. You can read the `Elasticsearch` docs for the highlight options at [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-highlighting.html).

| Type     | Applicable on query of type | Required |
| -------- | --------------------------- | -------- |
| `Object` | `all`                       | false    |

### searchOperators

Defaults to `false`. If set to `true` then you can use special characters in the search query to enable an advanced search behavior. Read more about it [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html).

| Type   | Applicable on query of type | Required |
| ------ | --------------------------- | -------- |
| `bool` | `search`                    | false    |

> Note: If both properties `searchOperators` and `queryString` are set to `true` then `queryString` will have the priority over `searchOperators`.

### queryString

Defaults to `false`. If set to `true` than it allows you to create a complex search that includes wildcard characters, searches across multiple fields, and more. Read more about it [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html).

| Type   | Applicable on query of type | Required |
| ------ | --------------------------- | -------- |
| `bool` | `search`                    | false    |

> Note: If both properties `searchOperators` and `queryString` are set to `true` then `queryString` will have the priority over `searchOperators`.

### includeFields

Data fields to be included in search results. Defaults to `[*]` which means all fields are included.

| Type            | Applicable on query of type | Required |
| --------------- | --------------------------- | -------- |
| `Array<string>` | `all`                       | false    |

### excludeFields

Data fields to be excluded in search results.

| Type            | Applicable on query of type | Required |
| --------------- | --------------------------- | -------- |
| `Array<string>` | `all`                       | false    |


### showMissing

Defaults to `false`. When set to `true` then it also retrieves the aggregations for missing fields.

| Type   | Applicable on query of type | Required |
| ------ | --------------------------- | -------- |
| `bool` | `term`                      | false    |

### missingLabel
Defaults to `N/A`. It allows you to specify a custom label to show when [showMissing](/docs/search/reactivesearch-api/reference/#showmissing) is set to `true`.

| Type     | Applicable on query of type | Required |
| -------- | --------------------------- | -------- |
| `string` | `term`                      | false    |

> Note: This property doesn't work when [pagination](/docs/search/reactivesearch-api/reference/#pagination) is set to `true`.

### selectAllLabel
This property allows you to add a new property in the list with a particular value in such a way that when selected i.e `value` is similar/contains to that label(`selectAllLabel`) then `term` query will make sure that the `field` exists in the `results`.

| Type     | Applicable on query of type | Required |
| -------- | --------------------------- | -------- |
| `string` | `term`                      | false    |

### includeNullValues

If you have sparse data or documents or items not having the value in the specified field or mapping, then this prop enables you to show that data.

| Type   | Applicable on query of type | Required |
| ------ | --------------------------- | -------- |
| `bool` | `range`                     | false    |

### interval

To set the histogram bar interval, applicable when [aggregations](/docs/search/reactivesearch-api/reference/#aggregations) value is set to `["histogram"]`. Defaults to `Math.ceil((range.end - range.start) / 100) || 1`.

| Type  | Applicable on query of type | Required |
| ----- | --------------------------- | -------- |
| `int` | `range`                     | false    |


### aggregationField

`aggregationField` enables you to get `DISTINCT` results (useful when you are dealing with sessions, events, and logs type data). It utilizes [composite aggregations](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-composite-aggregation.html) which are newly introduced in ES v6 and offer vast performance benefits over a traditional terms aggregation.

| Type     | Applicable on query of type | Required |
| -------- | --------------------------- | -------- |
| `string` | `all`                       | false    |

### after
This property can be used to implement the pagination for `aggregations`. We use the [composite aggregations](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-composite-aggregation.html) of `Elasticsearch` to execute the aggregations' query, the response of composite aggregations includes a key named `after_key` which can be used to fetch the next set of aggregations for the same query. You can read more about the pagination for composite aggregations at [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-composite-aggregation.html#_pagination).

You need to define the `after` property in the next request to retrieve the next set of aggregations.

| Type     | Applicable on query of type | Required |
| -------- | --------------------------- | -------- |
| `Object` | `all`                       | false    |

### aggregations

It helps you to utilize the built-in aggregations for `range` type of queries directly, valid values are:
- `max`: to retrieve the maximum value for a `dataField`,
- `min`: to retrieve the minimum value for a `dataField`,
- `histogram`: to retrieve the histogram aggregations for a particular `interval`

| Type            | Applicable on query of type | Required |
| --------------- | --------------------------- | -------- |
| `Array<string>` | `range`                     | false    |

### nestedField

Set the path of the nested type under which the `dataField` is present. Only applicable only when the field(s) specified in the `dataField` is(are) present under a nested type mapping.

| Type     | Applicable on query of type | Required |
| -------- | --------------------------- | -------- |
| `string` | `all`                       | false    |

### defaultQuery

This property is useful to customize the source query, as defined in Elasticsearch Query DSL. It is different from the [customQuery](/docs/search/reactivesearch-api/reference/#customquery) in a way that it doesn't get leaked to other queries(dependent queries by `react` prop) and only modifies the query for which it has been applied.

You can read more about the `defaultQuery` usage over [here](/docs/reactivesearch/v3/advanced/customqueries/#when-to-use-default-query).

| Type     | Applicable on query of type | Required |
| -------- | --------------------------- | -------- |
| `Object` | `all`                       | false    |

### customQuery

Custom query property will be applied to the dependent queries by `react` property, as defined in Elasticsearch Query DSL. You can read more about the `customQuery` usage over [here](/docs/reactivesearch/v3/advanced/customqueries/#when-to-use-custom-query).

> Note:
>
> It'll not affect that particular query for which it has been defined, it'll only affect the query for dependent queries. If you want to customize the source query then use the [defaultQuery](/docs/search/reactivesearch-api/reference/#defaultquery) property instead.

| Type     | Applicable on query of type | Required |
| -------- | --------------------------- | -------- |
| `Object` | `all`                       | false    |


### execute

Sometimes it may require that you want to apply some query for results with the help of `react` property but want to avoid any un-necessary query execution for the performance reasons. If you set `execute` to `false` for a particular query then you can use it with `react` prop without executing it.
For example, consider a scenario where we want to filter the search query by some range. To implement it with RS API we need to define two queries(search & range type). Since you defined the two queries then by default both queries will get executed, however you can avoid this by setting `execute` to `false` for the range query.

| Type   | Applicable on query of type | Required |
| ------ | --------------------------- | -------- |
| `bool` | `all`                       | false    |

### enableSynonyms

This property can be used to control (enable/disable) the synonyms behavior for a particular query. Defaults to `true`, if set to `false` then fields having `.synonyms` suffix will not affect the query.

| Type   | Applicable on query of type | Required |
| ------ | --------------------------- | -------- |
| `bool` | `search`                    | false    |

### rankFeature
This property allows you to define the [Elasticsearch rank feature query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-rank-feature-query.html#query-dsl-rank-feature-query) to boost the relevance score of documents based on the `rank_feature` fields.

| Type   | Applicable on query of type | Required |
| ------ | --------------------------- | -------- |
| `object` | `search`                  | false    |

The `rankFeature` object must be in the following shape:
```ts
{
    "field_name": {
        "boost": 1.0,
        "function_name": "function_object"
    }
}
```
- `field_name` It represents the `dataField` that has the `rank_feature` or `rank_features` mapping.
- `boost` [optional] A floating point number (shouldn't be negative) that is used to decrease (if the value is between 0 and 1) or increase relevance scores (if the value is greater than 1). Defaults to 1.
- `function_name` To calculate relevance scores based on rank feature fields, the rank_feature query supports the following mathematical functions:
    - [saturation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-rank-feature-query.html#rank-feature-query-saturation)
    - [log](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-rank-feature-query.html#rank-feature-query-logarithm)
    - [sigmoid](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-rank-feature-query.html#rank-feature-query-sigmoid)
- `function_object` The function object can be used to override the default values for functions.
    - `saturation` function supports the `pivot` property that must be greater than zero.
    - `log` function supports the `scaling_factor` property
    - `sigmoid` function supports `pivot` and `exponent`[must be positive] properties

The following example uses a rank feature field named `pagerank` with `saturation` function.

```js
    {
        "id": "search",
        "dataField": ["content"],
        "value": "2016",
        "rankFeature": {
            "pagerank": {
                "saturation": {
                    "pivot": 2
                }
            }
        }
    }
```

The following example uses the `boost` property to boost the relevance score based on the `pagerank` field.

```js
    {
        "id": "search",
        "dataField": ["content"],
        "value": "2016",
        "rankFeature": {
            "pagerank": {
                "boost": 2.0
            }
        }
    }
```

The following example uses all three functions (`saturation`, `log` and `sigmoid`) to boost the relevance scores.

```js
    {
    "query": [
        {
            "id": "search",
            "dataField": [
                "content"
            ],
            "value": "2016",
            "rankFeature": {
                "pagerank": {
                    "saturation": {
                        "pivot": 2
                    }
                },
                "url_length": {
                    "log": {
                        "scaling_factor": 1
                    }
                },
                "topics.sports": {
                    "sigmoid": {
                        "pivot": 2,
                        "exponent": 1
                    }
                }
            }
        }
    ]
}
```

### distinctField
This property returns only the distinct value documents for the specified field. It is equivalent to the `DISTINCT` clause in SQL. It internally uses the collapse feature of Elasticsearch. You can read more about it over [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/collapse-search-results.html).

| Type     | Applicable on query of type | Required |
| ------   | --------------------------- | -------- |
| `string` | `all`                  | false    |

The following query would return the products for distinct brands.
```js
{
    "query": [
        {
            "id": "test",
            "dataField": [
                "product_name"
            ],
            "distinctField": "brand.keyword",
        }
    ]
}
```

### distinctFieldConfig
This property allows specifying additional options to the `distinctField` property. Using the allowed DSL, one can specify how to return K distinct values (default value of K=1), sort them by a specific order, or return a second level of distinct values. `distinctFieldConfig` object corresponds to the `inner_hits` key's DSL. You can read more about it over [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/collapse-search-results.html).

| Type     | Applicable on query of type | Required |
| ------   | --------------------------- | -------- |
| `object` | `all`                       | false    |

The following query would return the products for distinct brands. Additionally, it would return the top five products for each brand.
```js
{
    "query": [
        {
            "id": "test",
            "dataField": [
                "product_name"
            ],
            "distinctField": "brand.keyword",
            "distinctFieldConfig": {
                "inner_hits": {
                    "name": "most_recent",
                    "size": 5,
                    "sort": [
                        {
                            "crawl_timestamp.keyword": "asc"
                        }
                    ]
                },
                "max_concurrent_group_searches": 4
            }
        }
    ]
}
```

## Settings Properties

### recordAnalytics
`bool` defaults to `false`. If `true` then it'll enable the recording of Appbase.io analytics.

### enableQueryRules
`bool` defaults to `true`. It allows you to configure whether to apply the query rules for a particular query or not.

### customEvents
`Object` It allows you to set the custom events which can be used to build your own analytics on top of the Appbase.io analytics. Further, these events can be used to filter the analytics stats from the Appbase.io dashboard. In the below example, we're setting up two custom events that will be recorded with each search request.

```js
{
    query: [...],
    settings: {
        customEvents: {
            platform: "android",
            user_segment: "paid"
        }
    }
}
```

### userId
`String` It allows you to define the user id which will be used to record the Appbase.io analytics.
