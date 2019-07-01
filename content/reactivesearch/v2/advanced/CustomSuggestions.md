---
id: customsuggestions
title: 'Custom Suggestions'
layout: docs
sectionid: docs
permalink: advanced/customsuggestions.html
prev: theming/class.html
prevTitle: 'Theming: ClassName Injection'
next: advanced/customquery.html
nextTitle: 'Custom Query'
redirect_from:
    - 'advanced'
    - 'reactive-manual/v2/advanced'
---

Recipe for rendering custom suggestions with `DataSearch` and `CategorySearch` components using the `renderSuggestions` prop.

ReactiveSearch uses the wonderful [downshift](https://github.com/paypal/downshift) for rendering dropdowns and `renderSuggestions` prop provides great extensibility for custom suggestions rendering. `renderSuggestions` is a [render function](https://reactjs.org/docs/render-props.html) which receives some parameters which you may use to build your own custom suggestions rendering

## Custom Suggestions for DataSearch

```js
<DataSearch
    ...
    renderSuggestions={
        ({
            currentValue,       // the current value in the search
            isOpen,             // isOpen from downshift
            getItemProps,       // item props to be passed to suggestions
            highlightedIndex,   // index value which should be highlighted
            suggestions,        // unmodified suggestions from Elasticsearch
            parsedSuggestions,  // suggestions parsed by ReactiveSearch
        }) => JSX
    }
/>
```

Check out the [example](https://opensource.appbase.io/playground/?selectedKind=Search%20components%2FDataSearch&selectedStory=With%20renderSuggestions&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybooks%2Fstorybook-addon-knobs) on playground.

The `getItemProps` provides some props that you should pass to your suggestions for them to work properly with downshift. The paramter should be an object with key `item` which should have a `value` field. For example:

```js
<div {...getItemProps({ item: { value: suggestion } })} />
```

The `suggestions` parameter receives all the unparsed suggestions from elasticsearch, however `parsedSuggestions` are also passed which can also be used for suggestions rendering.

## Custom Suggestions for CategorySearch

```js
<CategorySearch
    ...
    renderSuggestions={
        ({
            currentValue,       // the current value in the search
            isOpen,             // isOpen from downshift
            getItemProps,       // item props to be passed to suggestions
            highlightedIndex,   // index value which should be highlighted
            suggestions,        // unmodified suggestions from Elasticsearch
            parsedSuggestions,  // suggestions parsed by ReactiveSearch
            categories,         // all categories for the suggestions
        }) => JSX
    }
/>
```

Check out the [example](https://opensource.appbase.io/playground/?selectedKind=Search%20components%2FCategorySearch&selectedStory=With%20renderSuggestions&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybooks%2Fstorybook-addon-knobs) on playground.

All the parameters received are very similar to the `DataSearch` besides `categories` which receives all the categories for the current query as an array of objects having the `key` attribute and the `doc_count` so you can compose a custom UI accordingly.
