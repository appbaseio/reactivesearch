---
title: 'Search Relevancy'
meta_title: 'Appbase.io Dashboard - Search Relevancy Controls for ElasticSearch'
meta_description: 'Appbase.io offers a control plane for tuning search relevancy of your ElasticSearch queries.'
keywords:
    - concepts
    - appbase.io
    - search relevancy
    - elasticsearch
sidebar: 'docs'
---

A relevant search meets an end user's expectations every single time. However, both measuring and optimizing the search relevancy with ElasticSearch requires one to be an expert search engine user, and even then, it continues to be an ongoing effort that takes months to yield fruitful results.

Appbase.io now offers **Search Relevancy** - a control plane containing a suite of GUIs that enable user to improve their search relevancy settings without requiring any guesswork. Combined with Actionable Analytics, Search Relevancy enables you to optimize your search's relevance in a data-driven manner.

> **Note:** Search Relevancy control plane and APIs are available for all Production and Enterprise plan users.

## Language Settings

Language forms the core of a search engine. The **Language Settings** UI enables you to configure your search engine to work with the language that your users are going to search for.

Appbase.io offers support for 38 languages with the default relevancy configured to work universally.

![](https://i.imgur.com/CGUEBgG.png)

**Languages Supported:** arabic, armenian, basque, bengali, brazilian portuguese, bulgarian, catalan, chinese\*, czech, danish, dutch, english, estonian, finnish, french, galician, german, greek, hindi, hungarian, indonesian, irish, italian, japanese\*, korean\*, latvian, lithuanian, norwegian, persian, polish\*, portuguese, romanian, russian, sorani, spanish, swedish, turkish, ukranian\*, thai

When you select a primary language that's different from Universal, the universal analyzer continues to work with it. This way, you can benefit from a multi-lingual search.

\* The following languages require additional analyzer plugins to be installed in your ElasticSearch cluster.


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

Search Settings allow you to control your search query settings.

![](https://i.imgur.com/pCRaMAe.png)

The UI view lets you control and set the fields that have a search use-case and a variable field weight that's used to boost a match at search time.

By default, when appbase.io is used to import data for an ElasticSearch index, it sets the search use-case and the appropriate indexing and search analyzers for all the `text` fields. As a user, you can change the fields that are searchable.

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

**Manage Shards:** Allows you to change your shard size by re-indexing in place.

**Manage Replicas:** Allows you to update your index replica settings.

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


## Query Suggestions

Query Suggestions is a daily populated index by appbase.io based on search analytics. The Query Suggestions UI lets you set preferences for how this index should get populated. You can read more about it over [here](/docs/analytics/query-suggestions/).

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
