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

Click analytics have to be wired into the result components. Its supported in `ReactiveList`.When using `ReactiveList`, the `renderItem` or `renderAllData` prop|slot-scope receives an extra property to make click analytics work which you have to invoke with `onClick`.

```html
<reactive-list
    ...
    <div slot="renderItem" slot-scope="{ item,  triggerClickAnalytics}">
        <div onClick="triggerClickAnalytics">{{ item.title }}</div>
    </div>
>
```

When rendering your component using `renderAllData({ results, streamResults, loadMore, base, triggerClickAnalytics })` you have to call the `triggerClickAnalytics` after adding the `base` value to the `index` (`base` is calculated internally from `currentPage * size`). `index` is assumed to start from `0`. Example:

```html
<reactive-list
    ...
    <div slot="renderAllData" slot-scope=`
        { results, streamResults, loadMore, base, triggerClickAnalytics }
    `>
        <div
            v-for="(result, index) in results"
            @click="() => triggerClickAnalytics(base + index)"
        >
            {{ result.title }}
        </div>
    </div>
>
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
