---
title: 'API Reference'
meta_title: 'API Reference Javascript'
meta_description: 'Appbase-js is a universal JavaScript client library for working with the appbase.io database.'
keywords:
    - apireference
    - javascript
    - appbase
    - elasticsearch
sidebar: 'api-reference'
---

[appbase-js](https://github.com/appbaseio/appbase-js) is a universal JavaScript client library for working with the appbase.io database.

## INSTANTIATION

### Appbase()

Returns an Appbase object (refered to as `appbaseRef` in all the following examples) using the `url`, `app` and `username`:`password` credentials.

```js
var appbaseRef = Appbase({
	"url": "https://scalr.api.appbase.io",
	"app": <YOUR_APP_NAME>,
	 // use a combination of username & password
	"username": <APP_CREDENTIAL>,
	"password": <APP_SECRET>,
	// OR can use direct credentials
	"credentials": <APP_KEY>
})
```

**Usage**

`Appbase(appData)`

-   **appData** `Object` <br>A JavaScript object containing the following fields and values

        	- **url** ``String`` <br>URL with the API version, always *https://scalr.api.appbase.io*
        	- **app** ``String`` <br>name of the app as displayed in the [dashboard](https://appbase.io/scalr)
        	- **username** ``String`` <br>username as displayed in the app dashboard
        	- **password** ``String`` <br>password as displayed in the app dashboard
        	- **credentials** ``String`` <br>Api key as displayed in the app dashboard<br>

**Note**: Either you can use a combination of `username` & `password` or use `credentials`.

**Returns**

`Object` **appbaseRef** _Appbase reference object_ - has `index()`, `update()`, `delete()`, `bulk()`, `search()`, `get()`, `getTypes()`, `getStream()`, `searchStream()` and `searchStreamToURL()` methods.

## WRITING DATA

### index()

Writes a JSON data object at a given `type` and `id` location, or replaces if an object already exists.

```js
appbaseRef
	.index({
		type: 'tweet',
		id: 'aX12c5',
		body: {
			msg: 'writing my first tweet!',
			by: 'jack',
			using: ['appbase.io', 'javascript', 'streams'],
			test: true,
		},
	})
	.then(function(res) {
		console.log('successfully indexed: ', res);
	})
	.catch(function(err) {
		console.log('indexing error: ', err);
	});
```

**Usage**

`appbaseRef.index(params)`

-   **params** `Object` <br>A JavaScript object containing the type, id and the JSON data to be indexed

        	- **type** ``String`` <br>The type (aka collection) under which the data will be indexed
        	- **body** ``Object`` <br>Data to be indexed, a valid JSON object
        	- **id** ``String`` <br>Unique ID for the JSON data. ``id`` is auto generated if not specified

### update()

Partially updates an existing document at a given `type` and `id` location. The important difference with the index() method is that the latter replaces the existing data values wholesale, while update() only replaces the values that are specified in the `body.doc` field.

```js
appbaseRef
	.update({
		type: 'tweet',
		id: 'aX12c5',
		body: {
			doc: {
				msg: 'editing my first tweet!',
				by: 'ev',
			},
		},
	})
	.then(function(res) {
		console.log('successfully updated: ', res);
	})
	.catch(function(err) {
		console.log('update document error: ', err);
	});
```

**Usage**

`appbaseRef.update(params)`

-   **params** `Object` <br>A JavaScript object containing the type, id, and the partial JSON data to be updated

        	- **type** ``String`` <br>The type (aka collection) under which the data will be indexed
        	- **body.doc** ``Object`` <br>Partial doc JSON to be updated (all the JSON data can only reside under the body.doc field)
        	- **id** ``String`` <br>Unique ID of the JSON document to be updated. ``id`` here is mandatory and should match an existing object.

### delete()

Delete a JSON data object by `id`.

```js
appbaseRef
	.delete({
		type: 'tweet',
		id: 'aX12c5',
	})
	.then(function(res) {
		console.log('successfully deleted: ', res);
	})
	.catch(function(err) {
		console.log('deletion error: ', err);
	});
```

**Usage**

`appbaseRef.delete(params)`

-   **params** `Object` <br>A JavaScript object containing the `type` and `id` of the JSON object to be deleted

        	- **type** ``String`` <br>The type (aka collection) of the object to be deleted
        	- **id** ``String`` <br>Unique ID for the JSON data

### bulk()

Apply many index / delete operations together, useful when importing data for the first time.

```js
appbaseRef
	.bulk({
		type: 'tweet',
		body: [
			// action#1 description
			{ index: { _id: 2 } },
			// the JSON data to index
			{
				msg: 'writing my second tweet!',
				by: 'Ev',
				using: ['appbase.io', 'javascript', 'streams'],
				test: true,
			},
			// action#2 description
			{ delete: { _id: 2 } },
			// deletion doesn't any further input
		],
	})
	.then(function(res) {
		console.log('successful bulk: ', res);
	})
	.catch(function(err) {
		console.log('bulk failed: ', err);
	});
```

**Usage**

`appbaseRef.bulk(params)`

-   **params** `Object` <br>A JavaScript object containing the `body` and optionally a default `type` to be used for actions

        	- **body** ``Array`` <br>A JavaScript array of actions to be performed written as a sequence of action#1, data#1, action#2, data#2, ... action#n, data#n
        	- **type** ``String`` <br>Default document type for actions that don't provide one

## GETTING DATA

### get()

Get the JSON document from a particular `type` and `id`. For subscribing to realtime updates on a document, check out `getStream()`.

```js
appbaseRef
	.get({
		type: 'tweet',
		id: 'aX12c5',
	})
	.then(function(res) {
		console.log('The document data: ', res);
	})
	.catch(function(err) {
		console.log('get() method failed with: ', err);
	});
```

**Usage**

`appbaseRef.get(params)`

-   **params** `Object` <br>A JavaScript object containing the `type` and `id` of the document to retrieve.
    -   **type** `String` <br>Document Type - **id** `String` <br>Unique ID of the JSON document

Returns the document at the given `type` and `id`.

### getTypes()

Get all the `types` of an app.

```js
appbaseRef
	.getTypes()
	.then(function(res) {
		console.log('All app types: ', res);
	})
	.catch(function(err) {
		console.log('getTypes() failed: ', err);
	});
```

**Usage**

`appbaseRef.getTypes()`

Returns all the `types` as an array.

### getMappings()

Get the mapping scheme of an app. You can read more about mappings [over here](https://www.elastic.co/guide/en/elasticsearch/reference/5.6/mapping.html#mapping).

```js
appbaseRef
	.getMappings()
	.then(function(res) {
		console.log('Mapping scheme is: ', res);
	})
	.catch(function(err) {
		console.log('getMappings() failed: ', err);
	});
```

**Usage**

`appbaseRef.getMappings()`

Returns the current app's mapping scheme as an object.

### search()

Search for matching documents in a type. It's a convenience method for ElasticSearch's `/_search` endpoint. For subscribing to realtime updates on the search query, check out `searchStream()`.

```js
appbaseRef
	.search({
		type: 'tweet',
		body: {
			query: {
				match_all: {},
			},
		},
	})
	.then(function(res) {
		console.log('query result: ', res);
	})
	.catch(function(err) {
		console.log('search error: ', err);
	});
```

**Usage**

`appbaseRef.search(params)`

-   **params** `Object` <br>A JavaScript object containing the query `type` and `body`.

        	- **type** ``String`` <br>Document type
        	- **body** ``Object`` <br>A JSON object specifying a valid query in the [ElasticSearch Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html) format

**Returns**
Promise.

### msearch()

Multi Search to allow execution of several search requests with same API. It's a convenience method for ElasticSearch's `/_msearch` endpoint.

```js
appbaseRef
	.msearch({
		type: 'tweet',
		body: [{}, { query: { match_all: {} } }, {}, { query: { match: { _id: 1 } } }],
	})
	.then(function(res) {
		console.log('query result: ', res);
	})
	.catch(function(err) {
		console.log('search error: ', err);
	});
```

**Usage**

`appbaseRef.msearch(params)`

-   **params** `Object` <br>A JavaScript object containing the query `type` and `body`.

        	- **type** ``String`` <br>Document type
        	- **body** ``Array`` <br>An array specifying search requests in header followed by body order for each request.

**Returns**
Promise.

## STREAMING DATA

### getStream()

Continuously stream new updates to a specific JSON document. If you wish to only fetch the existing value, `get()` is sufficient.

```js
appbaseRef.getStream(
	{
		type: 'tweet',
		id: 'aX12c5',
	},
	function(data) {
		console.log('data update: ', res);
	},
	function(err) {
		console.log('streaming error: ', err);
	},
	function(close) {
		console.log('streaming closed');
	},
);
```

**Usage**

`appbaseRef.getStream(params)`

-   **params** `Object` <br>A JavaScript object containing the `type` and `id` of the document to be streamed.

        	- **type** ``String`` <br>Document type
        	- **id** ``String`` <br>Document ID (The ID is always a ``String`` value)

> Note <span class="fa fa-info-circle"></span>
>
> The `streamOnly` field parameter is deprecated starting v0.9.0 onwards, and is the default for how `getStream()` works (previously `readStream()`).

**Returns**

An `Object` with

-   a **stop()** method to stop the stream
-   a **reconnect()** method to reconnect the stream

```js
var responseStream = appbaseRef.getStream(
	{
		type: 'tweet',
		id: 1,
	},
	function(res) {
		console.log('data update: ', res);
	},
);
```

> Note <i class="fa fa-info-circle"></i>
>
> appbase.js lib uses websockets to stream changes to a subscribed method.

### searchStream()

Continuously stream results of search query on a given `type`. Search queries can be a variety of things: from simple monitoring queries, finding an exact set of documents, full-text search queries, to geolocation queries.

`searchStream()` subscribes to search results on new document inserts, existing search results can be fetched via `search()` method.

```js
appbaseRef.searchStream(
	{
		type: 'tweet',
		body: {
			query: {
				match_all: {},
			},
		},
	},
	function(res) {
		console.log('query update: ', res);
	},
	function(err) {
		console.log('streaming error: ', err);
	},
);
```

**Usage**

`appbaseRef.searchStream(params)`

-   **params** `Object` <br>A JavaScript object containing the query `type` and `body`

        	- **type** ``String`` <br>Document type
        	- **body** ``Object`` <br>A JSON object specifying a valid query in the [ElasticSearch Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html) format

> Note <span class="fa fa-info-circle"></span>
>
> The `streamOnly` field parameter is deprecated starting v0.9.0 onwards, and is the default for how `searchStream()` works.

**Returns**

An `Object` with

-   a **stop()** method to stop the stream
-   a **reconnect()** method to reconnect the stream

```js
var responseStream = appbaseRef.searchStream(
	{
		type: 'tweet',
		body: {
			query: {
				match_all: {},
			},
		},
	},
	function(res) {
		console.log('data update: ', res);
	},
);

setTimeout(responseStream.stop, 5000); // stop stream after 5s
```

### searchStreamToURL()

Continuously stream results of search query on a given `type` to a URL. **searchStreamToURL()** executes a webhook query on document insertion.

`searchStreamToURL()` subscribes to search query results on new document inserts.

```js
appbaseRef.searchStreamToURL(
{
	type: "tweet",
	body: {
		query: {
			match_all: {}
		}
	}
}, {
	url: 'http://mockbin.org/bin/0844bdda-24f6-4589-a45b-a2139d2ccc84',
	string_body: {{{_source}}}
}, function(res) {
	console.log("Webhook registered: ", res)
}, function(err) {
	console.log("Error in registering webhook: ", err)
})
```

**Usage**

`appbaseRef.searchStreamToURL(queryParams, urlParams)`

-   **queryParams** `Object` <br>A JavaScript object containing the query `type` and `body`

        	- **type** ``String`` <br>Document type
        	- **body** ``Object`` <br>A JSON object specifying a valid query in the [ElasticSearch Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html) format

-   **urlParams** `Object` - A JavaScript object containing the `url` to which data would be streamed on a query match. It supports optional fields to attach JSON (or string) payloads, control the frequency and number of updates.

        	- **url** ``String`` <br>A URL string
        	- **body** ``Object`` <br>A JSON object to be sent to the URL (used as an alternative to **string_body**)
        	- **string_body** ``String`` <br>A raw string to be sent to the URL (used as an alternative to **body**)
        	- **count** ``Number`` <br># of times the result-request should be sent before terminating the webhook
        	- **interval** ``Number`` <br>Wait duration in seconds before the next result-request

> Note <span class="fa fa-info-circle"></span>
>
> **body** and **string_body** fields support [mustache syntax](http://mustache.github.io/mustache.5.html) for accessing values inside the matching result object.

**Returns**

An `Object` with

-   a **stop()** method to de-register the webhook
-   a **change()** method to replace the destination URL object

> Note <span class="fa fa-info-circle"></span>
>
> We recommend using both **change()** and **stop()** methods inside the `data` or `error` event handlers due to the async nature of the `searchStreamToURL()` method.

```js
var responseStream = appbaseRef.searchStreamToURL(
	{
		type: 'tweet',
		body: {
			query: {
				match_all: {},
			},
		},
	},
	{
		url: 'http://mockbin.org/bin/0844bdda-24f6-4589-a45b-a2139d2ccc84',
	},
	function(res) {
		console.log('webhook registered: ', res);
		responseStream.stop().then(function(res) {
			console.log('webhook de-registered: ', res);
		});
	},
);
```
