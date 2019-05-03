---
title: 'Webhooks Guide'
meta_title: 'Webhooks Javascript'
meta_description: 'Webhooks (aka streaming to a URL) allows you to set up integrations which respond to events'
keywords:
    - webhooks
    - javascript
    - appbase
    - elasticsearch
sidebar: 'api-reference'
---

> Note <i class="fa fa-info-circle"></i>
>
> Introduced in [appbase-js](https://github.com/appbaseio/appbase-js) `v0.10.0`. Read the [getting started guide](/javascript/quickstart.html) for some familiarity with the JS lib.

Webhooks (aka streaming to a URL) allows you to set up integrations which respond to events in appbase.io. Webhooks can be used to send transaction emails, post on a slack channel when a new user signs up, update the pricing plan when the data storage crosses a threshold.

## How webhooks are triggered

Webhooks are continuous queries whose results are subscribed by a URL. A webhooks object contains 1) continuous query and 2) subscribed URL's configurations (headers, body payload, count, interval).

Webhooks can be triggered when a new document is inserted, an existing document changes it's value, or when a new document matches a specific continuous query condition.

## Composing Webhooks Queries

Since registering a webhook is a method of the `Appbase` object, we will start with instantiating an Appbase object.

```js
var appbaseRef = Appbase({
	url: 'https://RIvfxo1u1:dee8ee52-8b75-4b5b-be4f-9df3c364f59f@scalr.api.appbase.io',
	app: 'createnewtestapp01',
});
```

Webhooks in appbase-js are supported by [`searchStreamToURL()`](javascript/api-reference.html#searchstreamtourl). The behavior is very similar to [`searchStream()`](javascript/api-reference.html#searchstream), where the results are subscribed via a streams interface. Instead of subscribing the results back to the user, webhooks subscribe them to a URL.

```js
appbaseRef.searchStreamToURL(
	{
		type: 'tweet',
		body: {
			query: {
				match_all: {},
			},
		},
	},
	{
		url: 'http://requestb.in/v0mz3hv0?inspect',
		interval: 60,
	},
	function(res) {
		console.log('webhook successfully registered: ', res);
	},
);
```

Here, we set the webhook request to be sent every time there is a document insert in the `type` tweet. To control for the noise, we set the `interval` to 60s.

### Modifying a Webhook's URL

The `searchStreamToURL()` method returns a stream object with a method `change()` which can be used to change the webhook's subscribed URL for the original continuous query.

```js
appbaseRef.searchStreamToURL(
	{
		type: 'tweet',
		body: {
			query: {
				match_all: {},
			},
		},
	},
	{
		url: 'http://requestb.in/v0mz3hv0',
		interval: 60,
	},
	function(res) {
		console.log('webhook successfully registered: ', res);
		this.change({
			url: 'http://mockbin.org/bin/0844bdda-24f6-4589-a45b-a2139d2ccc84',
			interval: 60,
		});
	},
);
```

`change(object)` method accepts a URL object which completely replaces the previous URL object.

### Deregistering the Webhook Query

The `searchStreamToURL()` method returns a stream object with a method `stop()` which deletes the webhook query.

```js
appbaseRef.searchStreamToURL(
	{
		type: 'tweet',
		body: {
			query: {
				match_all: {},
			},
		},
	},
	{
		url: 'http://requestb.in/v0mz3hv0',
		interval: 60,
	},
	function(res) {
		console.log('webhook successfully registered: ', res);
		this.stop().on('data', function(res) {
			console.log('webhook successfully stopped: ', res);
		});
	},
);
```

`stop()` method deletes the webhook query. It's important to call this method only after the webhook is successfully registered.

## Adding Dynamic Data in Webhooks

Webhooks in appbase.io are designed for configurability.

1. Supports [mustache syntax](http://mustache.github.io/mustache.5.html) in the body payload where the body can be a JSON or a raw string,
2. Supports `interval` to send a webhook request only after a certain time interval (controls for noise),
3. Supports `count` to send a fixed number of webhook requests before de-registering the URL.

Together, these three features allow for a very versatile webhooks streaming. In this doc, we will look at composing webhook queries and a number of different usage scenarios for webhooks.

### Mustache Syntax

One of the biggest uses of webhooks is sending transaction notifications, like sending an email or a push notification within the app. We support Mustache syntax for enabling sending dynamic data in webhook request's body payload.

```js
{
  "tweet": {
      "msg": "#Expanse is one of the best TV space opera after firefly #scifi",
      "tags": ["Expanse", "scifi"],
      "by": "@siddharthlatest",
      "timestamp": 14224544242
  }
}
```

---

| Mustache                          | Rendered                                                                                                                                                                               | Note(s)                                  |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| {{{_source}}}                     | {"tweet": {"msg": "#Expanse has to be one of the best television space opera after firefly #scifi", "tags": ["Expanse", "scifi"], "by": "@siddharthlatest", "timestamp": 14224544242}} | Renders the entire data JSON             |
| {{#tweet}}{{timestamp}}{{/tweet}} | 14224544242                                                                                                                                                                            | Renders the nested property inside tweet |
| {{#tweet}}{{tags}}{{/tweet}}      | ["Expanse", "scifi"] Renders the nested array inside the tweet object                                                                                                                  |

---

## Usage Scenarios

-   Top 10 daily recommendations

-   Pricing plan change and notification

-   Bitcoin price alert
