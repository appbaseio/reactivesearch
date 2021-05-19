---
title: 'Overview'
meta_title: 'Appbase.io REST APIs: Overview'
meta_description: 'An overview of the REST APIs for appbase.io and how to use them'
keywords:
    - overview
    - rest
    - appbase
    - elasticsearch
sidebar: 'api-reference'
---

Appbase.io provides an API gateway and control plane for Elasticsearch -  with a mission of powering the most demanding application search use-cases.

To get started with the APIs, the first pre-requisite is to create an appbase.io cluster. You can do this by creating a cluster [using the cloud service](/docs/hosting/clusters/), or [bring your existing Elasticsearch](/docs/hosting/byoc/) cluster, or [self-host appbase.io](https://docs.appbase.io/docs/hosting/byoc/#using-docker).

## REST APIs

Appbase.io maintains a 100% API compatibility with Elasticsearch. Any Elasticsearch REST API will work as is when using appbase.io. The primary set of Elasticsearch APIs that would be relevant are:
1. [Index (read collections) APIs](https://www.elastic.co/guide/en/elasticsearch/reference/current/indices.html) and [document (read data) APIs](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs.html)
2. [Search APIs](https://www.elastic.co/guide/en/elasticsearch/reference/current/search.html): Querying data

Besides this, Appbase.io takes an API-first approach for all of the value-added features and also makes this available with a separate gateway. These features include:
1. [ReactiveSearch API](https://docs.appbase.io/docs/search/reactivesearch-api/reference) - A alternative API to query Elasticsearch declaratively. This is the recommended way to query via web and mobile apps as it prevents query injection attacks. It also composes well with Elasticsearch's query DSL and allows utilizing additional appbase.io features like query rules.
2. [Appbase.io Features APIs](https://arc-api.appbase.io/) - All of the appbase.io value-add features like search relevance, caching, query rules, actionable analytics, access control, UI builder are available as APIs. Everything that one can do from appbase.io dashboard is achievable with these APIs.


![Elasticsearch and Appbase.io API gateways](https://i.imgur.com/w15086V.png)
**Image:** Appbase.io dashboard view provides both Elasticsearch and appbase.io gateway endpoints separately

## Elasticsearch API: Quickstart

In this section, we will look at the basics of using the Elasticsearch APIs: creating an index, indexing data into this index, and searching on this index.

> Think of the index as a collection in .

### Creating an Index

This gif shows how to create an index on appbase.io cluster, which we will need for this quickstart guide.

![](https://www.dropbox.com/s/qa5nazj2ajaskr6/wky0vrsPPB.gif?raw=1)

For this tutorial, we will use an index called `good-books-demo`. The credentials for this index are `376aa692e5ab:8472bf31-b18a-454d-bd39-257c07d02854`.

> Note <i class="fa fa-info-circle"></i>
>
> Appbase.io uses _HTTP Basic Auth_, a widely used protocol for simple username/password authentication. It also support creating various API credentials with different access. You can read more about access control in [docs](/docs/security/credentials/).

### Setup

Here's an example authenticated `GET` request. We will set the `app` name and `credentials` as bash variables and reuse them in the requests.

```bash
# SET BASH VARIABLES
index="good-books-demo"
credentials="c84fb24cbe08:db2a25b5-1267-404f-b8e6-cf0754953c68"
url="appbase-demo-ansible-abxiydt-arc.searchbase.io"

curl https://$credentials@$url/$index

RESPONSE
{
  "good-books-demo": {
   "mappings": {
    // properties / fields
   }
  }
}
```

### Indexing Data

Let's insert a JSON object. We add a JSON document `1` with a PUT request.

```bash
curl -XPUT https://$credentials@$url/$index/_doc/1 -d '{
 "department_name":"Books",
 "department_name_analyzed":"Books",
 "department_id":1,
 "name":"A Fake Book on Network Routing",
 "price":5595
}'
```


### GET Data

Retrieves the specified JSON document from an index.

```bash
curl -N https://$credentials@$url/$index/_doc/1

# INITIAL RESPONSE
{
 "_index": "app`248",
 "_type": "books",
 "_id": "1",
 "_version": 5,
 "found": true,
 "_source": {
  "department_name": "Books",
  "department_name_analyzed": "Books",
  "department_id": 1,
  "name": "A Fake Book on Network Routing",
  "price": 5595
 }
}
```

### Search

Returns search hits that match the query DSL defined in the request. Read more about search API [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html).

We will see it here with a `match_all` query request.

```bash
curl -N -XPOST https://$credentials@$url/$index/_search -d '{"query": {"match_all":{}}}'

INITIAL RESPONSE
{
 "took": 1,
 "timed_out": false,
 "_shards": {
  "total": 1,
  "successful": 1,
  "failed": 0
 },
 "hits": {
  "total": 1,
  "max_score": 1,
  "hits": [{
   "_index": "app`248",
   "_type": "books",
   "_id": "1",
   "_score": 1,
   "_source": {
    "price": 6034,
    "department_name": "Books",
    "department_name_analyzed": "Books",
    "department_id": 1,
    "name": "A Fake Book on Network Routing"
   }
  }]
 }
}
```

## ReactiveSearch API: Overview

ReactiveSearch API derives its name from [ReactiveSearch](https://github.com/appbaseio/reactivesearch), a declarative UI library for building search interfaces. ReactiveSearch extends this ability in a client/framework agnostic manner.

Here's a basic example showing the use of ReactiveSearch API to query Elasticsearch.

<iframe frameborder="0" width="100%" height="600px" src="https://replit.com/@appbaseio/ReactiveSearch-API-Basic-Usage?lite=true"></iframe>

You can view more examples on our [interactive examples page](/api/examples/rest/).

You can learn the concepts behind ReactiveSearch API over [here](/docs/search/reactivesearch-api/implement/), or view the API reference over [here](/docs/search/reactivesearch-api/reference/).
