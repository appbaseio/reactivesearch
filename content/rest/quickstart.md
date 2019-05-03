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

## Creating an App

This gif shows how to create an app on appbase.io, which we will need for this quickstart guide.

![](https://i.imgur.com/r6hWKAG.gif")

Log in to <span class="fa fa-external-link"></span> [Appbase Dashboard](https://appbase.io/scalr/), and create a new app.

For this tutorial, we will use an app called `newstreamingapp`. The credentials for this app are `meqRf8KJC:65cc161a-22ad-40c5-aaaf-5c082d5dcfda`.

> Note <i class="fa fa-info-circle"></i>
>
> appbase.io uses _HTTP Basic Auth_, a widely used protocol for simple username/password authentication. This is similar to how GitHub's authentication works over `https`, just imagine every repository (app in our context) having it's unique &lt;username>:&lt;password> combination, found under the **Credentials** tab of the dashboard.

> The full REST API reference is available at https://rest.appbase.io.

## Setup

Here's an example authenticated `GET` request. We will set the `app` name and `credentials` as bash variables and reuse them in the requests.

```bash
# SET BASH VARIABLES
app="newstreamingapp"
credentials="meqRf8KJC:65cc161a-22ad-40c5-aaaf-5c082d5dcfda"

curl https://$credentials@scalr.api.appbase.io/$app

RESPONSE
{
	status: 200,
	message: "You have reached /newstreamingapp/ and are all set to make API requests"
}
```

## Storing Data

Let's insert a JSON object. We create a **type** `books` inside our app and add a JSON document `1` with a PUT request.

```bash
curl -XPUT https://$credentials@scalr.api.appbase.io/$app/books/1 -d '{
	"department_name":"Books",
	"department_name_analyzed":"Books",
	"department_id":1,
	"name":"A Fake Book on Network Routing",
	"price":5595
}'
```

> Note <i class="fa fa-info-circle"></i>
>
> appbase.io uses the same APIs as [ElasticSearch](https://www.elastic.co/products/elasticsearch). A **type** is equivalent to a _collection in MongoDB_ or a _table in SQL_, and a document is similar to the document in MongoDB or a _row in SQL_.

## GETing or Streaming Data

Getting live updates to a document is as simple as suffixing `?stream=true` to a GET request. It's so awesome that we recommend using this as the default way to GET things.

```bash
curl -N https://$credentials@scalr.api.appbase.io/$app/books/1?stream=true

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

appbase.io keeps an open connection so that every time there is an update in the `/$app/books/1` document, it is streamed via the connection.

### Modify the Document

Let's modify the book price to 6034.

```bash
curl -XPUT https://$credentials@scalr.api.appbase.io/$app/books/1 --data-binary '{
	"price": 6034,
	"department_name": "Books",
	"department_name_analyzed": "Books",
	"department_id": 1,
	"name": "A Fake Book on Network Routing"
}'
```

### Observe the Streams

```bash
curl -N https://$credentials@scalr.api.appbase.io/$app/books/1?stream=true

RESPONSE AFTER 2.a
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
{
	"_type": "books",
	"_id": "1",
	"_source": {
		"department_id": 1,
		"department_name": "Books",
		"department_name_analyzed": "Books",
		"name": "A Fake Book on Network Routing",
		"price": 6034
	}
}
```

In the new document update, we can see the price change (5595 -> 6034) being reflected. Subsequent changes will be streamed to the response as raw JSON objects. As we see, there are no delimiters between between two consecutive JSON responses.

> For every `?stream=true` request, appbase.io keeps an open connection up to a max of 6 hrs.

## Streaming Search

Streaming document updates seems straightforward, can we apply rich filters and queries to our streams? Yes, we can. We can specify any ElasticSearch Query DSL request, and get responses via streams.

We will see it here with a `match_all` query request.

```bash
curl -N -XPOST https://$credentials@scalr.api.appbase.io/$app/books/_search?stream=true -d '{"query": {"match_all":{}}}'

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
