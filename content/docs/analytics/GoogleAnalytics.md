---
title: 'Integrate Google Analytics'
meta_title: 'Implementing Appbase analytics - Core Concepts'
meta_description: 'A short guide on how to set up google analytics and track search terms and queries.'
keywords:
    - concepts
    - appbase
    - google-analytics
    - integrate
sidebar: 'docs'
---

##Setting Up Google Analytics
Even though ReactiveSearch provides analytics tailored to your search, you might want to integrate your search into your existing analytics tools.
The base library components don't provide a built-in widget to implement analytics with other providers.

Integrating with Google Analytics requires 2 steps:

-   set up the Google Analytics library in your search app
-   setup the search state change listener

To set up Google Analytics, the best way is to [follow the reference guide](https://developers.google.com/analytics/devguides/collection/analyticsjs/).

Once the GA library is installed on your website, follow the steps below on how Google Analytics can be integrated with different libraries.

##Setup The Search State Change Listener
Setting the search state change listener depends on how your search app is setup. If you are using one of the appbase.io libraries, you can refer to the sections below on how you can do this.

###ReactiveSearch
Track any component's state using `StateProvider` component as below. Read more about `StateProvider` over [here](https://docs.appbase.io/docs/reactivesearch/v3/advanced/stateprovider/):

```js
<ReactiveBase>
	<StateProvider
		onChange={({ prevState, nextState }) => {
			if (prevState !== nextState) {
				window.ga('set', 'page', `/?state=${JSON.stringify(nextState)}`);
				window.ga('send', 'pageview');
			}
		}}
	/>
</ReactiveBase>
```

If you only want to track your searchbox and you are using the [DataSearch](https://docs.appbase.io/docs/reactivesearch/v3/search/datasearch/) component for it, you can do the following.

```js
<ReactiveBase>
	<DataSearch
		onValueChange={value => {
			window.ga('set', 'page', `/?query=${value}`);
			window.ga('send', 'pageview');
		}}
	/>
</ReactiveBase>
```

###ReactiveSearch Vue
If you want to track your searchbox and you are using the [data-search](https://docs.appbase.io/docs/reactivesearch/vue/search/DataSearch/) component for it, you can do the following.

```vue
<data-search
	@valueChange="
		function(value) {
			window.ga('set', 'page', `/?query=${value}`);
			window.ga('send', 'pageview');
		}
	"
/>
```

###React SearchBox
Check the API docs for `React SearchBox` over [here](https://docs.appbase.io/docs/reactivesearch/react-searchbox/apireference/).

```js
<SearchBox
	app="good-books-ds"
	credentials="nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d"
	dataField={['original_title', 'original_title.search']}
	dataField
	onValueChange={(next, prev) => {
		if (prev !== next) {
			window.ga('set', 'page', `/?query=${next}`);
			window.ga('send', 'pageview');
		}
	}}
/>
```
