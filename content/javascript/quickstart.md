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

-   Configure mappings, change analyzers, or capture snapshots. All these are provided by [elasticsearch.js](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html) - the official ElasticSearch JS client library.

[Appbase.io - the database service](https://appbase.io) is opinionated about cluster setup and hence doesn't support the ElasticSearch devops APIs. See [rest.appbase.io](https://rest.appbase.io) for a full reference on the supported APIs.

This is a quick start guide to whet the appetite with the possibilities of data streams.

## Creating an App

![](https://i.imgur.com/r6hWKAG.gif)

Log in to <span class="fa fa-external-link"></span> [appbase.io dashboard](https://dashboard.appbase.io/), and create a new app.

For this tutorial, we will use an app called `newstreamingapp`. The credentials for this app are `meqRf8KJC:65cc161a-22ad-40c5-aaaf-5c082d5dcfda`.

> Note <i class="fa fa-info-circle"></i>
>
> appbase.io uses **HTTP Basic Auth**, a widely used protocol for a username:password based authentication.

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
	url: 'https://scalr.api.appbase.io',
	app: 'newstreamingapp',
	credentials: 'meqRf8KJC:65cc161a-22ad-40c5-aaaf-5c082d5dcfda',
});
```

**OR**

```js
var appbaseRef = Appbase({
	url: 'https://meqRf8KJC:65cc161a-22ad-40c5-aaaf-5c082d5dcfda@scalr.api.appbase.io',
	app: 'newstreamingapp',
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
		type: 'books',
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

where `type: 'books'` indicate the collection (or table) inside which the data will be stored and the`id: '1'` is an optional unique identifier.

The `index()` method (and all the other `appbase` methods except streaming methods) return a promise.

> Note <span class="fa fa-info-circle"></span>
>
> appbase.io uses the same APIs and data modeling conventions as [ElasticSearch](https://www.elastic.co/products/elasticsearch). A **type** is equivalent to a collection in MongoDB or a table in SQL, and a **document** is similar to the document in MongoDB and equivalent to a row in SQL.

## GETing or Streaming Data

Unlike typical databases that support GET operations (or Read) for fetching data and queries, Appbase.io operates on both GET and stream modes.

### Getting a Document Back

Now that we are able to store data, let's try to get the data back from [appbase.io](https://appbase.io) with the `get()` method.

```js
appbaseRef.get({
	type: "books",
	id: "X1"
}).then(function(response) {
	console.log(response)
}).catch(function(error) {
	console.log(error)
})

/* get() response */
{
	"_index": "newstreamingapp",
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

Even though `get()` returns a single document data, appbase.io returns it as a stream object with the 'data' event handler.

### Subscribing to a Document Stream

Let's say that we are interested in subscribing to all the state changes that happen on a document. Here, we would use the `getStream()` method over `get()`, which keeps returning new changes made to the document.

```js
appbaseRef.getStream(
	{
		type: 'books',
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

Don't be surprised if you don't see anything printed, `getStream()` only returns when new updates are made to the document.

### Observe the updates in realtime

Let's see live updates in action. We will modify the book price in our original `jsonObject` variable from 5595 to 6034 and apply `index()` again.

For brevity, we will not show the `index()` operation here.

```js
/* getStream() response */
{
	"_type": "books",
	"_id": "X1",
	"_source": {
		"department_id": 1,
		"department_name": "Books",
		"department_name_analyzed": "Books",
		"name": "A Fake Book on Network Routing",
		"price": 6034
	}
}
```

In the new document update, we can see the price change (5595 -> 6034) being reflected. Subsequent changes will be streamed as JSON objects.

`Note:` Appbase always streams the final state of an object, and not the diff b/w the old state and the new state. You can compute diffs on the client side by persisting the state using a composition of (\_type, \_id) fields.

## Streaming Rich Queries

Streaming document updates are great for building messaging systems or notification feeds on individual objects. What if we were interested in continuously listening to a broader set of data changes? The `searchStream()` method scratches this itch perfectly.

In the example below, we will see it in action with a `match_all` query that returns any time a new document is added to the type 'books' or when any of the existing documents are modified.

```js
appbaseRef.searchStream({
	type: "books",
	body: {
		query: {
			match_all: {}
		}
	}
}, function(response) {
	console.log("searchStream(), new match: ", response);
}, function(error) {
	console.log("caught a searchStream() error: ", error)
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

`Note:` Like `getStream()`, `searchStream()` subscribes to the new matches. For fetching existing search results, check out [`search()`](/javascript/api-reference.html#search).

**v0.10.0** introduces a new method [`searchStreamToURL()`](/javascript/api-reference.html#searchstreamtourl) that streams results directly to a URL instead of streaming back.

In this tutorial, we have learnt how to index new data and stream both individual data and results of an expressive query.
