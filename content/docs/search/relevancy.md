---
title: 'Search Relevancy'
meta_title: 'Appbase.io Dashboard - Search Relevancy Controls for Elasticsearch'
meta_description: 'Appbase.io offers a control plane for tuning search relevancy of your Elasticsearch queries.'
keywords:
    - concepts
    - appbase.io
    - search relevancy
    - elasticsearch
sidebar: 'docs'
---

A relevant search meets an end user's expectations every single time. However, both measuring and optimizing the search relevancy with Elasticsearch requires one to be an expert search engine user, and even then, it continues to be an ongoing effort that takes months to yield fruitful results.

Appbase.io now offers **Search Relevancy** - a control plane containing a suite of GUIs that enable user to improve their search relevancy settings without requiring any guesswork. Combined with Actionable Analytics, Search Relevancy enables you to optimize your search's relevance in a data-driven manner.

[![](https://i.imgur.com/1uywifE.jpg)](https://youtu.be/pES6u-GG3hc)
👆Watch this 4-mins video to see it in action

> **Note:** Search Relevancy control plane and APIs are available for all Production and Enterprise plan users.

## Language Settings

Language forms the core of a search engine. The **Language Settings** UI enables you to configure your search engine to work with the language that your users are going to search for.

Appbase.io offers support for 38 languages with the default relevancy configured to work universally.

![](https://i.imgur.com/CGUEBgG.png)

**Languages Supported:** arabic, armenian, basque, bengali, brazilian portuguese, bulgarian, catalan, chinese\*, czech, danish, dutch, english, estonian, finnish, french, galician, german, greek, hindi, hungarian, indonesian, irish, italian, japanese\*, korean\*, latvian, lithuanian, norwegian, persian, polish\*, portuguese, romanian, russian, sorani, spanish, swedish, turkish, ukranian\*, thai

When you select a primary language that's different from Universal, the universal analyzer continues to work with it. This way, you can benefit from a multi-lingual search.

\* The following languages require additional analyzer plugins to be installed in your Elasticsearch cluster.


| Language | Plugin Required | Context |
|----------|-----------------|---------|
| chinese  | [smartcn](https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-smartcn.html)         |  The chinese language falls back to the built-in `cjk` analyzer, but it's recommended to install the smartcn analyzer for a better chinese or mixed chinese-english text analysis. |
| japanese | [kuromoji](https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-kuromoji.html) |  The kuromoji analyzer enables the analysis of japanese text. |
| korean | [nori](https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-nori.html) | The korean language falls back to the built-in `cjk` analyzer, but it's recommended to install the nori analyzer for a better korean text analysis. |
| polish | [stempel](https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-stempel.html) | The stempel analyzer enables high-quality stemming for polish text. |
| ukranian | [ukranian](https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-ukrainian.html) | The ukranian analyzer enables the analysis of ukranian text. |

#### Other Options

Outside of the choice of the primary language, an index can also be configured with the following additional language specific settings.

**Stopwords:** Enable/disable or configure custom stopwords (i.e. words to be ignored by the search engine)

**Stemming Exceptions:** Set words that are excluded from your language's stemming process.

**Normalize Diacritics:** Enabled by default, this setting controls whether diacritics are normalized for search matches or not.


## Search Settings

Search Settings enables you to control search query and relevance settings.

![](https://i.imgur.com/pCRaMAe.png)

The UI view lets you control and set the fields that have a search use-case and a variable field weight that's used to boost a match at search time.

By default, when appbase.io is used to import data for an Elasticsearch index, it sets the search use-case and the appropriate indexing and search analyzers for all the `text` fields. As a user, you can change the fields that are searchable.

#### Advanced Settings

For each field, you can toggle the advanced settings view to granularly control how the field gets searched.

![](https://i.imgur.com/SFZzWKc.png)

Available options to search a field include:
- `keyword`: Searches on the exact value of the field. You typically want to enable this and provide it the highest weight.
- `autosuggest`: Searches on the prefix value of the field. Enable this when you want users to do an autocomplete/suggestions search on the field. You should set a relatively lower weight for it.
- `search`: Searches on an infix value of the field. Enable this when you want users to be able to find results by entering partial values. You should set a relatively lower weight for it.
- `language`: Searches on the language analyzed value (as set in language settings) for the field. You should set a relatively moderate weight for it.
- `synonyms`: Enable this when you want users to be able to find results when searching for synonym pairs as set in the Synonyms view. You should set a relatively lower weight for it.
- `delimiter`: Searches for values with non-alphanumeric characters effectively. Enable this if you have those values for the field. You should set a relatively moderate weight for it.

By default, all of these options are searched against. The search relevance weights are preset for these options, but you can also set them manually. By disabling an option depending on the field's search use-case, you can also improve the search latency performance.

#### Relevance Tuning with Rank Feature


**What is a rank feature**: A [rank_feature](https://www.elastic.co/guide/en/elasticsearch/reference/current/rank-feature.html) field works similarly to a regular float field from the outside, but indexes data in a way that allows Elasticsearch to run queries efficiently when it is used for ranking. Appbase.io natively supports applying additional relevance tuning using rank feature.

You can add a rank_feature field from the [Schema UI view](#schema).

Then from the **Search Settings** view, you can configure the rank feature based relevance tuning parameters.

![](https://i.imgur.com/6BaJtOa.png)

If the relevance tuning were defined as above, the new relevance score would be computed as:

`new_relevance = search_based_relevance + 1.0*saturation(rank) + 2.0*log(popularity, 5)`

The following options are supported with rank feature based relevance tuning.

- **Boost** [optional] - A floating point number (shouldn't be negative) that is used to decrease (if the value is between 0 and 1) or increase relevance scores (if the value is greater than 1). Defaults to 1.
- **Function** - `Saturation`, `Logarithm`, and `Sigmoid` functions are supported. Each function takes input parameters that define how they influence the relevance scores.
  - `Saturation`: The saturation function gives a score equal to S / (S + pivot), where S is the value of the rank feature field and pivot is a configurable pivot value so that the result will be less than 0.5 if S is less than pivot and greater than 0.5 otherwise. Scores are always (0,1).
      - `Pivot`: This function expects pivot as an input parameter. When not set explicitly, a default value equal to the approximate geometric mean of all rank feature values in the index is set.
  - `Logarithm`: The log function gives a score equal to log(scaling_factor + S), where S is the value of the rank feature field and scaling_factor is a configurable scaling factor. Scores are unbounded.
      - `Scaling Factor`: This function expects scaling factor as an input parameter. It should be a positive floating number value.
  - `Sigmoid`: The sigmoid function is an extension of the saturation function and adds a configurable exponent. Scores are computed as S^exp^ / (S^exp^ + pivot^exp^). Like for the saturation function, pivot is the value of S that gives a score of 0.5 and scores are (0,1).
      - `Pivot`: This function expects pivot as an input parameter. When not set explicitly, a default value equal to the approximate geometric mean of all rank feature values in the index is set.
      - `Exponent`: The exponent must be positive and is typically in [0.5, 1]. A good value should be computed via training. If you don’t have the opportunity to do so, we recommend you use the saturation function instead.

You can read more about rank_feature query over [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-rank-feature-query.html).



#### Other Options

Outside of the ability to set searchable fields and optionally their weights, you can also set the following search settings.

**Search Operators:** Enabling Search Operators allows your end-users to use search operators and construct advanced queries like: `"fried eggs" +(eggplant | potato) -frittata"` that are allowed in advanced modes of popular consumer search engines. Internally, this setting translates the query term to use a [simple query string query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html). This setting is disabled by default.

**Enable Typo Tolerance:** Enabling typo tolerance allows your end-users room to be slightly off with their search queries and have the search engine still interpret those correctly.

Once typo tolerance is enabled, you can use it in one of these three modes:

![](https://i.imgur.com/orlSubI.png)

`AUTO` lets the search engine decide the number of acceptable characters that are off based on the length of the search query. We recommend this as a good default.

`1` lets the search engine allow up to 1 character to be off from the indexed content.

`2` lets the search engine allow up to 2 characters to be off from the indexed content.

Allowing typo-tolerance beyond 2 isn't recommended as that can yield a lot of false positive hits. You should instead set specific synonyms in such cases.

**Enable Synonyms:** Enabling synonyms lets you set a dictionary of synonyms that is used at search time to map to the indexed content. This setting is disabled by default.

**Enable N-grams:** appbase.io adds an n-grams tokenizer to enable partial infix matching of search terms, but this comes with a substantial storage increase. By disabling n-grams, you can make significant storage savings.

## Aggregation Settings

Aggregation Settings allows you to set the fields that should be used for aggregations (aka search facets).

![](https://i.imgur.com/IutaXX1.png)

The UI view lets you control and set the fields that have an aggregations use-case and select the type of the aggregation: `Term` (which applies to both text or numeric data fields) or `Range` (which applies to only numeric data fields).

Once a type is set, the Search Preview UI shows the facets for the aggregation fields. Here's an example showing how it would look like:

![](https://i.imgur.com/qKKqH4C.png)


#### Other Options

These are some other options available in the Aggregations settings.

**Default Size For Aggregations:** This indicates the number of unique facet values to retrieve for a given aggregation field. Defaults to `10`. We recommending not setting this more than `1000`.

**Default Sort:** This indicates the default sort order of facet values for a given aggregation field. Defaults to Count (highest value first), but it can also be set to either an ascending or a descending order.

**Include Null Values:** This setting dictates whether null (or empty) value data would be returned and displayed as a facet value for a given aggregation field. Defaults to `true`.


## Result Settings

Aggregation Settings allows you to set the result page size, which fields to return back and set result highlight settings.


![](https://i.imgur.com/JkJa3qo.png)

#### Available Options

**Page Size:** Set the number of results to return in one search query's response. Defaults to `10`.

**Fields To Return:** Set the fields to exclude and include using specific fields or patterns. This lets you control the response size and as a consequence, lead to an improved latency.

**Result Highlight Settings:** Enable highlighting and set specific fields to highlight, set the highlight tag (e.g. `<em>` or `<mark>`), set the total highlight fragments and the max fragment size to return. Controlling these lets you optimize the response size with highlighting tailored for your use-case.

## Index Settings

Index Settings lets you configure the shards and replica settings for your index.

![](https://imgur.com/4Be2CSz.png)

**Manage Shards:** Allows you to change your index's shard size by re-indexing in place.

How to think about sharding:

Each shard is a self-contained index. An Elasticsearch index is just a logical grouping of the physical shards.

1. Data within different shards can be processed parallely when executing a search query. The higher the number of shards, the faster the search can execute given that CPU cores and memory are sufficiently available.
2. At the same time, shards come with a significant overhead. There is a soft limit of 1,000 shards per data node. You want to keep the total shards per node below this limit.

**Manage Replicas:** Allows you to update your index replica settings.

A 1-replica setup implies all the primary shards are replicated, resulting in twice the number of net shards. Replication makes your search high availabile by ensuring redundancy of data. A no-replica setup implies no redundancy. In case of a node failover, data residing in the shards of the node will become unavailable.

A good rule of thumb is to have a 1-replica setup whenever you have at least two nodes in the cluster. For an even higher redundancy, you can opt for a 2-replica setup.

You can read more about shards and replicas over [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/scalability.html).

## Schema

The Schema view gives you an overall view of your index's fields. You can set a specific use-case, data type, add a new field to the index or remove a field from the index.

![](https://imgur.com/GqtEsRr.png)

## Synonyms

The Synonyms view allows you to add or edit synonyms for your search index. Synonyms set here are applied at query time and thus don't require re-indexing of data.

![](https://imgur.com/Hvmiq9U.png)

All searchable fields (i.e. use-case=search) get a `.synonyms` field assigned to them. You should search against this particular field to take advantage of synonyms matching.

There are two types of synonyms supported:

1. Equivalent Synonyms: Equivalent synonyms lets you set two or more synonym words and treat all the words as equal.

![](https://i.imgur.com/cNoAU9N.png)

2. One way Synonyms: One way Synonyms let you set one or more alternative words for a given search term (an indexed content term). This then maps the alternative words to the given search term but not vice-versa.

![](https://i.imgur.com/xK9P7QY.png)

> **Fun Fact:** Synonyms set are case insensitive and they can also span multiple words.


## Popular Suggestions

Popular Suggestions is a daily populated index by appbase.io based on search analytics. The Popular Suggestions UI lets you set preferences for how this index should get populated. You can read more about it over [here](/docs/analytics/popular-suggestions/).

![](http://imgur.com/jL40KPa.png)

## Query Rules

Query Rules allows you to set rules based on the incoming search query, filters or universally. A rule can allow you to:
1. Promote a particular result (useful for merchandizing),
2. Hide an irrelevant result,
3. Apply an additional facet,
4. Modify the incoming search term,
5. Return custom data (useful for advertising/merchandizing),
6. Run a user-defined function - providing endless possibilities to extend search.

Learn more about query rules over [here](/docs/search/rules/).

![](https://i.imgur.com/hbJWhZM.png)

## Functions

Functions allow you to run user-defined functions to extend the search engine. Read more about them over [here](/docs/search/functions/).

![](https://imgur.com/4LPHTlw.png)

## Test Search Relevancy

The **Search Preview UI** is at the core of Search Relevancy views. It lets you test your configured search, aggregation, results settings and review them prior to setting them live.

![](https://i.imgur.com/088vv3q.png)

You can see it present on all the views with a `Test Search Relevancy` button.

**Raw view:** The Raw view lets you see the underlying search API call as well as modify it and see the response as a raw JSON. Under the hood, appbase.io uses the [ReactiveSearch API](/docs/search/reactivesearch-api/) to make the search requests.

![](https://i.imgur.com/j2K7nYB.png)

You can export the Search Preview UI using the `Open in Codesandbox` button. This produces a React boilerplate codebase built using [ReactiveSearch](https://github.com/appbaseio/reactivesearch).

![](https://i.imgur.com/DuVJ07V.png)
