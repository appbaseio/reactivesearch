---
title: 'Quickstart'
meta_title: 'Quickstart to Javascript'
meta_description: 'Appbase-js is a universal JavaScript client library for working with the appbase.io database.'
keywords:
    - quickstart
    - javascript
    - appbase
    - elasticsearch
sidebar: 'api-reference'
---

[appbase-js](https://github.com/appbaseio/appbase-js) is a universal JavaScript client library for working with the appbase.io database.

It can:

-   Index new documents or update / delete existing ones.
-   Stream updates to documents, queries or filters over `websockets`.
-   Work universally on Node.JS, Browser, and React Native.

It can't:

-   Configure mappings, change analyzers, or capture snapshots. All these are provided by [elasticsearch.js](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html) - the official Elasticsearch JS client library.

[Appbase.io - the database service](https://appbase.io) is opinionated about cluster setup and hence doesn't support the Elasticsearch devops APIs. See [rest.appbase.io](https://rest.appbase.io) for a full reference on the supported APIs.

## Create Cluster

You can start by creating an [Elasticsearch cluster with appbase.io](/docs/hosting/clusters/) or [bring your Elasticsearch cluster](/docs/hosting/byoc/) or [self-host appbase.io](https://docs.appbase.io/docs/hosting/byoc/#quickstart-recipes).

-   Log in to[Appbase Dashboard](https://dashboard.appbase.io), and create a new cluster.
-   Copy the URL of your cluster for further actions

You can read see the different options for creating a cluster and their pricing over [here](https://appbase.io/pricing/)

## Creating an Index

This gif shows how to create an index on appbase.io cluster, which we will need for this quickstart guide.

![](https://www.dropbox.com/s/qa5nazj2ajaskr6/wky0vrsPPB.gif?raw=1)

For this tutorial, we will use an index called `good-books-demo`. The credentials for this index are `376aa692e5ab:8472bf31-b18a-454d-bd39-257c07d02854`.

> Note <i class="fa fa-info-circle"></i>
>
> Appbase.io uses _HTTP Basic Auth_, a widely used protocol for simple username/password authentication. It also support creating various API credentials with different access. You can read more about access control in [docs](/docs/security/credentials/).

## Install appbase-js

We will fetch and install the **appbase-js** lib using npm. `4.0.0-beta` is the most current version.

```js
npm install appbase-js
```

Adding it in the browser should be a one line script addition.

```html
<script defer src="https://unpkg.com/appbase-js/dist/appbase-js.umd.min.js"></script>
```

Alternatively, a UMD build of the library can be used directly from [jsDelivr](https://cdn.jsdelivr.net/npm/appbase-js/dist/).

To write data or stream updates from [appbase.io](https://appbase.io), we need to first create a reference object. We do this by passing the appbase.io API URL, app name, and credentials into the `Appbase` constructor:

```js
var appbaseRef = Appbase({
	url: 'https://appbase-demo-ansible-abxiydt-arc.searchbase.io',
	app: 'good-books-demo',
	credentials: 'c84fb24cbe08:db2a25b5-1267-404f-b8e6-cf0754953c68',
});
```

**OR**

```js
var appbaseRef = Appbase({
	url:
		'https://c84fb24cbe08:db2a25b5-1267-404f-b8e6-cf0754953c68@appbase-demo-ansible-abxiydt-arc.searchbase.io',
	app: 'good-books-demo',
});
```

Credentials can also be directly passed as a part of the API URL.

## Storing Data

Once we have the reference object (called `appbaseRef` in this tutorial), we can insert any JSON object into it with the `index()` method.

```js
var jsonObject = {
	department_name: 'Books',
	department_name_analyzed: 'Books',
	department_id: 1,
	name: 'A Fake Book on Network Routing',
	price: 5595,
};
```

```js
appbaseRef
	.index({
		type: '_doc',
		id: 'X1',
		body: jsonObject,
	})
	.then(function(response) {
		console.log(response);
	})
	.catch(function(error) {
		console.log(error);
	});
```

The `index()` method (and all the other `appbase` methods) return a promise.

> Note <span class="fa fa-info-circle"></span>
>
> appbase.io uses the same APIs and data modeling conventions as [Elasticsearch](https://www.elastic.co/products/elasticsearch).

## GET Data

Unlike typical databases that support GET operations (or Read) for fetching data and queries, Appbase.io operates on both GET and stream modes.

### Getting a Document Back

Now that we are able to store data, let's try to get the data back from [appbase.io](https://appbase.io) with the `get()` method.

```js
appbaseRef.get({
 type: "_doc",
 id: "X1"
}).then(function(response) {
 console.log(response)
}).catch(function(error) {
 console.log(error)
})

/* get() response */
{
 "_index": "good-books-demo",
 "_type": "books",
 "_id": "X1",
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

### Subscribing to a Document Stream

Let's say that we are interested in subscribing to all the state changes that happen on a document. Here, we would use the `getStream()` method over `get()`, which keeps returning new changes made to the document.

```js
appbaseRef.getStream(
	{
		type: '_doc',
		id: 'X1',
	},
	function(response) {
		console.log('new document update: ', response);
	},
	function(error) {
		console.log('getStream() failed with: ', error);
	},
);
```

## Search Queries

`search` method helps you query the Elasticsearch with query DSL as its body.

For example, here we are trying to run `match_all` query that returns all the documents.

```js
appbaseRef.search({
 body: {
  query: {
   match_all: {}
  }
 }
}, function(response) {
 console.log(response);
}, function("search() response: ", error) {
 console.log("caught a error: ", error)
})

/* Response when a new data matches */
{
 "_type": "books",
 "_id": "X1",
 "_version": 5,
 "found": true,
 "_source": {
  "department_name": "Books",
  "department_name_analyzed": "Books",
  "department_id": 1,
  "name": "A Fake Book on Network Routing",
  "price": 6034
 }
}
```
