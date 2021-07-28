---
title: 'Analytics'
meta_title: 'Search and Analytics Data'
meta_description: 'Search analytics work out of the box with `analytics` prop in `ReactiveBase`.'
keywords:
    - reactivesearch
    - analytics
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'vue-reactivesearch'
---

You can take advantage of search and click analytics when using [Appbase.io](https://appbase.io) as a backend with ReactiveSearch. Search analytics work out of the box with `analytics` prop in `ReactiveBase`. This recipe explains how to implement click analytics for your app.

## Click Analytics

Click analytics have to be wired into the result components. Its supported in `ReactiveList`.When using `ReactiveList`, the `renderItem` or `render` prop|slot-scope receives an extra property to make click analytics work which you have to invoke with `onClick`. This method also supports the document id(optional) as the second param. If document id is not set then ReactiveSearch will calculate it based on the click position.

```html
<reactive-list>
    <div slot="renderItem" slot-scope="{ item,  triggerClickAnalytics}">
        <div onClick="triggerClickAnalytics">{{ item.title }}</div>
    </div>
</reactive-list>
```

When rendering your component using `render` you have to call the `triggerClickAnalytics` function by using the `_click_id` property of the result items as an argument. This method also supports the document id(optional) as the second param. If document id is not set then ReactiveSearch will calculate it based on the click position. Example:


```html
<reactive-list>
    <div slot="render" slot-scope="{ data, triggerClickAnalytics }">
        <div
            v-for="(item, index) in data"
            @click="triggerClickAnalytics(item._click_id)"
        >
            {{ item.title }}
        </div>
    </div>
</reactive-list>
```

## Track Impressions for Search Results

Impressions tracking is tied to the result components. You may have to do some extra setup in the `ReactiveList` component to track the impressions. Please follow the following instructions for different kind of use-cases.

1. If you're using the `render` or `renderItem` slot for the results UI then you have to define the `id` property for each result element. The value of `id` property must be the `_id` value from the elasticsearch hit object.

For an example, the following example uses the `renderItem` slot
```html
<reactive-list>
    <div slot="renderItem" slot-scope="{ hit }">
        <div :id="hit._id" :key="hit._id">{{ hit.title }}</div>
    </div>
</reactive-list>
```

Check this example with the `render` slot

```html
<reactive-list>
    <div slot="render" slot-scope="{ data }">
        <div
            v-for="(hit, index) in data"
            :id="hit._id"
            :key="hit._id"
        >
            {{ hit.title }}
        </div>
    </div>
</reactive-list>
```

2. If you're using `render` slot with `ResultCard` or `ResultList` components then you have to define the `id` prop for those components.

For an example,

```html
<reactive-list componentId="SearchResult">
    <div slot="render" slot-scope="{ data }">
        <result-cards-wrapper>
            <result-card
                v-for="(hit, index) in data"
                :id="hit._id"
                :key="hit._id"
            >
                <result-card-title>{{ item.original_title }}</result-card-title>
                <result-card-description>by {{ item.authors }}</result-card-description>
            </result-card>
        </result-cards-wrapper>
    </div>
</reactive-list>
```

## Configure the analytics experience
You can define the `appbaseConfig` prop in the `ReactiveBase` component to customize the analytics experience when appbase.io is used as a backend. It accepts an object which has the following properties:
- **recordAnalytics** `Boolean` allows recording search analytics (and click analytics) when set to `true` and appbase.io is used as a backend. Defaults to `false`.
- **searchStateHeader** `Boolean` If `true`, then appbase.io will record the search state with every search request made from `ReactiveSearch`. Defaults to `false`.
- **emptyQuery** `Boolean` If `false`, then appbase.io will not record the analytics for the empty queries i.e `match_all` queries. Defaults to `true`.
- **enableQueryRules** `Boolean` If `false`, then appbase.io will not apply the query rules on the search requests. Defaults to `true`.
- **suggestionAnalytics** `Boolean` If `false`, then appbase.io will not record the click analytics for the suggestions. Defaults to `true`.
- **userId** `String` It allows you to define the user id to be used to record the appbase.io analytics. Defaults to the client's IP address.
- **customEvents** `Object` It allows you to set the custom events which can be used to build your own analytics on top of appbase.io analytics. Further, these events can be used to filter the analytics stats from the appbase.io dashboard.
<br/>
For example in the following code, we're setting up two custom events that will be recorded with each search request.

```html
<template>
	<reactive-base :analyticsConfig="analyticsConfig" />
</template>
<script>
	export default {
		name: 'app',
		methods: {
			computed: {
				analyticsConfig() {
					return {
						customEvents: {
							platform: 'ios',
							device: 'iphoneX',
						},
					};
				},
			},
		},
	};
</script>
```
