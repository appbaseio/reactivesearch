---
title: 'Quickstart'
meta_title: 'Quickstart to REST API'
meta_description: 'This is a quick start guide to working with the appbase.io REST API.'
keywords:
    - quickstart
    - rest
    - appbase
    - elasticsearch
sidebar: 'api-reference'
---

This is a quick start guide to working with the [appbase.io REST API](https://rest.appbase.io).

## Create Cluster

You can start by creating an [Elasticsearch cluster with appbase.io](/docs/hosting/clusters/) or [bring your Elasticsearch cluster](/docs/hosting/byoc/) or [self-host appbase.io](https://docs.appbase.io/docs/hosting/byoc/#quickstart-recipes).

-   Log in to[Appbase Dashboard](https://dashboard.appbase.io), and create a new cluster.
-   Copy the URL of your cluster for further actions

You can read see the different options for creating a cluster and their pricing over [here](https://appbase.io/pricing/).

## Creating an Index

This gif shows how to create an index on appbase.io cluster, which we will need for this quickstart guide.

![](https://www.dropbox.com/s/qa5nazj2ajaskr6/wky0vrsPPB.gif?raw=1)

For this tutorial, we will use an index called `good-books-demo`. The credentials for this index are `376aa692e5ab:8472bf31-b18a-454d-bd39-257c07d02854`.

> Note <i class="fa fa-info-circle"></i>
>
> Appbase.io uses _HTTP Basic Auth_, a widely used protocol for simple username/password authentication. It also support creating various API credentials with different access. You can read more about access control in [docs](/docs/security/credentials/).

## Setup

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

## Indexing Data

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


## GET Data

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

## Search

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

# REST API Reference

The full API reference with example snippets in cURL, Ruby, Python, Node, PHP, Go, jQuery can be browsed at [rest.appbase.io](https://rest.appbase.io).
