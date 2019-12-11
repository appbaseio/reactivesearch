---
title: 'Query Suggestions'
meta_title: 'Leverage Analytics Data - Query Suggestions'
meta_description: 'A short guide on how to setup query suggestions.'
keywords:
    - concepts
    - appbase
    - analytics
    - implement
    - query
    - suggestions
sidebar: 'docs'
---

## Overview

Providing suggestions helps users type longer queries, a good suggestion ensures the best results. It is easy to build an auto-complete experience with appbase.io but <strong>query suggestions</strong> allows you to display more specific and popular suggestions.

We extract query suggestions from the Appbase analytics and store them in a separate index named `.suggestions`. We populate this index on a daily basis so that your users will see fresh and relevant suggestions at all the times. Below is the representation of how a query suggestion is stored.

```json
{
	"key": "iphone x",
	"count": 255
}
```

Here, the `key` represents the suggestion name and `count` represents the number of times that particular suggestion has been searched for actively.

> Note:
>
> Query suggestions is available as an enterprise feature. You need to have at least `Production-I` plan or an `Arc Enterprise` plan to avail this. 

### When to use it?

Query Suggestions is useful to curate search suggestions based on actual search queries that your users are making. This can be used by itself or alongside suggestions based on the product data to provide an augmented search experience.

Because query suggestions roll up the search queries based on the unique occurrences in a period relevant to you, the suggestions index created this way is very fast. In addition to the automated job of popularising the query suggestions index daily, you can also add external suggestions from other sources.


## Query Suggestions Preferences

<!-- TODO: Add screenshot of Suggestions UI -->
![alt Query suggestions GUI](https://i.imgur.com/6EYqFtj.png)

You can set the preferences for query suggestions from appbase.io dashboard's <strong>Query Suggestions GUI</strong> under `Develop` section. These help optimize the behavior of suggestions for your specific use-case.


### Filter by minimum count

It lets you define the minimum count value which means that only those suggestions which have the larger `count` value will get populated in the suggestions index. The default value is set to `1`.

### Filter by minimum hits

By default, the suggestions index only includes queries that return at least five results in the source index. You can configure this limit from the dashboard.

### Blacklist queries

You can define a set of unwanted queries which will be ignored to extract the suggestions.

### Whitelist indices

It allows you to define which index/indices should be considered to populate the suggestions.

### Number of days

By default, we calculate the suggestions for past `30` days which is <strong>configurable</strong>. We recommend to not use a value less than `30` so you have enough data in your index.

### External Suggestions

Since analytics is the only source to populate the `.suggestions` index. When you get started, you'll need some kind of starting data which can be helpful to display the suggestions.

You can define the external suggestions in the JSON format, each suggestion must have the `key` and `count` keys. The value of the `count` key determines the popularity of a particular suggestion.
You can check the below example of external query suggestions:

```json
[
	{
		"key": "iphoneX",
		"count": 10000, // scoring parameter
		"meta": {
			// define meta properties
			"image": "https://abc.com/cat.png"
		}
	},
	{
		"key": "samsung",
		"count": 700
	}
]
```

## How to query suggestions

We populate the suggestions in `.suggestions` index, to use the query suggestions you just need to use the `.suggestions` index to get the hits.

### Usage Example With Searchbox

```js
import Searchbase from '@appbaseio/searchbase';
import searchbox from '@appbaseio/searchbox';

const instance = new Searchbase({
	index: '.suggestions',
	credentials: `CLUSTER_CREDENTIALS`,
	url: 'CLUSTER_URL',
	size: 5,
	dataField: [
		{
			field: "key",
			weight: 3
		},
		{
			field: "key.autosuggest",
			weight: 1
		}
	],
});
searchbox('#git', {}, [
	{
		source: searchbox.sources.hits(instance),
		templates: {
			suggestion: function(suggestion) {
				return `<p class="is-4">${suggestion.label}</p>`;
			},
			empty: function() {
				return `<div>No Results</div>`;
			},
			loader: function() {
				return `<div>Loader</div>`;
			},
			footer: function({ query, isEmpty }) {
				return `
                    <div style="background: #eaeaea; padding: 10px;">Footer</div>
                `;
			},
			header: function({ query, isEmpty }) {
				return `
                    <div style="background: #efefef; padding: 10px;">
                        Hello From Header
                    </div>
                `;
			},
		},
	},
]);
```

### Usage Example With ReactiveSearch

<!-- TODO: The example is not complete -->

```js
import React from 'react';
import { ReactiveBase, DataSearch } from '@appbaseio/reactivesearch';

const Main = () => (
    <ReactiveBase
        app=".suggestions"
        credentials="CLUSTER_CREDENTIALS"
    >
        <div className="col">
            <DataSearch
                title="DataSearch"
                dataField={["key", "key.autosuggest"]}
				fieldWeights={[3, 1]}
                componentId="SearchComponent"
            />
        </div>
    </ReactiveBase>
);

export default Main;
```
