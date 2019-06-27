---
title: 'CustomSuggestions'
meta_title: 'CustomSuggestions'
meta_description: 'Recipe for rendering custom suggestions with `DataSearch` and `CategorySearch` components using the `render` prop.'
keywords:
    - reactivesearch
    - customsuggestions
    - appbase
    - elasticsearch
sidebar: 'web-reactivesearch'
---

Recipe for rendering custom suggestions with `DataSearch` and `CategorySearch` components using the `render` prop.

ReactiveSearch uses the wonderful [downshift](https://github.com/paypal/downshift) for rendering dropdowns and `render` prop provides great extensibility for custom suggestions rendering. `render` is a [render function](https://reactjs.org/docs/render-props.html) which receives some parameters which you may use to build your own custom suggestions rendering

## Custom Suggestions for DataSearch

```js
<DataSearch
    ...
    render={
        ({
            loading,            // `true` means the query is still in progress
            error,              // error info
            data,               // parsed suggestions by Reactivesearch
            rawData,            // unmodified suggestions from Elasticsearch
            value,              // the current value in the search
            downshiftProps      // downshift props
        }) => JSX
    }
/>
```

Check out the [example](https://opensource.appbase.io/playground/?selectedKind=Search%20components%2FDataSearch&selectedStory=With%20custom%20renderer&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybooks%2Fstorybook-addon-knobs) on playground.

The `getItemProps` provides some props that you should pass to your suggestions for them to work properly with downshift. The paramter should be an object with key `item` which should have a `value` field. For example:

```js
<div {...getItemProps({ item: { value: suggestion } })} />
```

The `rawData` parameter receives all the unparsed suggestions from elasticsearch, however `data` are also passed which can also be used for suggestions rendering.

## Custom Suggestions for CategorySearch

```js
<CategorySearch
    ...
    render={
        ({
            loading,         // `true` means the query is still in progress
            error,           // error info
            data,            // suggestions + category suggestions
            categories,      // all parsed categories for the suggestions
            rawCategories,   // all categories for the suggestions
            suggestions,     // suggestions parsed by ReactiveSearch
            rawSuggestions   // unmodified suggestions from Elasticsearch
            value,           // the current value in the search
            downshiftProps   // downshift props
        }) => JSX
    }
/>
```

Check out the [example](https://opensource.appbase.io/playground/?selectedKind=Search%20components%2FCategorySearch&selectedStory=With%20custom%20renderer&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybooks%2Fstorybook-addon-knobs) on playground.

All the parameters received are very similar to the `DataSearch` besides `categories` which receives all the categories for the current query as an array of objects having the `key` attribute and the `doc_count` so you can compose a custom UI accordingly.

## Customizing individual suggestions

It's also possible to customize the individual suggestions by using `parseSuggestion` prop.

```js
<DataSearch
  ...
  parseSuggestion={(suggestion) => ({
    title: suggestion.source.original_title,
    description: suggestion.source.authors,
    image: suggestion.source.image,
    value: suggestion.source.original_title,  // required
    // optionally render the entire JSX using label
    label: <JSX>,  // has higher precedence over title, description, image
    source: suggestion.source  // for onValueSelected to work with parseSuggestion
  })}
/>
```
