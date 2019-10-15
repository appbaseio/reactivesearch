---
title: 'Searchbox'
meta_title: 'API Reference to Searchbox'
meta_description: 'Searchbox is a lightweight searchbox UI component to query your ElasticSearch app.'
keywords:
    - quickstart
    - searchbox
    - search library
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'searchbox'
---

![Image to be displayed](https://i.imgur.com/rxOM8Ut.png)

`SearchBox` offers a lightweight and performance focused searchbox UI component to query and display results from your ElasticSearch app (aka index).

Example uses of searchbox UI:

-   Searching a rental listing by its `name` or `description` fields.
-   Searching across e-commerce products.


## Usage

**index.html**
```html
<!-- Head elements -->
<body>
	<!-- Other elements -->
	<input type="text" id="git" placeholder="Search movies..." />
	<script src="./index.js"></script>
</body>
```

**index.js**

```js
import Searchbase from '@appbaseio/searchbase';
import searchbox from '@appbaseio/searchbox';

const instance = new Searchbase({
	index: 'gitxplore-latest-app',
	credentials: 'LsxvulCKp:a500b460-73ff-4882-8d34-9df8064b3b38',
	url: 'https://scalr.api.appbase.io',
	size: 5,
	dataField: [
		'name',
		'description',
		'name.raw',
		'fullname',
		'owner',
		'topics'
	]
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
			}
		}
	}
]);
```

## Global Options

When initializing an autocomplete, there are a number of global options you can configure.

-   **autoselect** – If `true`, the first rendered suggestion in the dropdown will automatically have the `cursor` class, and pressing `<ENTER>` will select it.

-   **autoselectOnBlur** – If `true`, when the input is blurred, the first rendered suggestion in the dropdown will automatically have the `cursor` class, and pressing `<ENTER>` will select it. This option should be used on mobile, see [#113](https://github.com/algolia/autocomplete.js/issues/113).

-   **tabAutocomplete** – If `true`, pressing tab will select the first rendered suggestion in the dropdown. Defaults to `true`.

-   **hint** – If `false`, the autocomplete will not show a hint. Defaults to `true`.

-   **debug** – If `true`, the autocomplete will not close on `blur`. Defaults to `false`.

-   **clearOnSelected** – If `true`, the autocomplete will empty the search box when a suggestion is selected. This is useful if you want to use this as a way to input tags using the `selected` event.

-   **openOnFocus** – If `true`, the dropdown menu will open when the input is focused. Defaults to `false`.

-   **appendTo** – If set with a DOM selector, doesn't wrap the input and appends the wrapper and dropdown menu to the first DOM element matching the selector. It automatically positions the wrapper under the input, and sets it to the same width as the input. Can't be used with `hint: true`, because `hint` requires the wrapper around the input.

-   **dropdownMenuContainer** – If set with a DOM selector, it overrides the container of the dropdown menu.

-   **templates** – An optional hash overriding the default templates.

    -   **dropdownMenu** – the dropdown menu template. The template should include all _dataset_ placeholders.
    -   **header** – the header to prepend to the dropdown menu
    -   **footer** – the footer to append to the dropdown menu
    -   **loader** – he template to display when the datasets is laoding results. The templating function
        is called with a context containing the underlying `query`.
    -   **empty** – the template to display when none of the datasets are returning results. The templating function
        is called with a context containing the underlying `query`.

-   **cssClasses** – An optional hash overriding the default css classes.

    -   **root** – the root classes. Defaults to `appbase-autocomplete`.
    -   **prefix** – the CSS class prefix of all nested elements. Defaults to `aa`.
    -   **noPrefix** - set this to true if you wish to not use any prefix. Without this option, all nested elements classes will have a leading dash. Defaults to `false`.
    -   **dropdownMenu** – the dropdown menu CSS class. Defaults to `dropdown-menu`.
    -   **input** – the input CSS class. Defaults to `input`.
    -   **hint** – the hint CSS class. Defaults to `hint`.
    -   **suggestions** – the suggestions list CSS class. Defaults to `suggestions`.
    -   **suggestion** – the suggestion wrapper CSS class. Defaults to `suggestion`.
    -   **cursor** – the cursor CSS class. Defaults to `cursor`.
    -   **dataset** – the dataset CSS class. Defaults to `dataset`.
    -   **empty** – the empty CSS class. Defaults to `empty`.
    -   **loader** – the loader CSS class. Defaults to `loader`.

-   **keyboardShortcuts** - Array of shortcut that will focus the input. For example if you want to bind `s` and `/`
    you can specify: `keyboardShortcuts: ['s', '/']`

-   **minLength** – The minimum character length needed before suggestions start
    getting rendered. Defaults to `1`.

-   **autoWidth** – This option allow you to control the width of autocomplete wrapper. When `false` the autocomplete wrapper will not have the width style attribute and you are be able to put your specific width property in your css to control the wrapper. Default value is `true`.

One scenario for use this option. e.g. You have a `max-width` css attribute in your `autocomplete-dropdown-menu` and you need to width grows until fill the `max-width`. In this scenario you put a `width: auto` in your autocomplete wrapper css class and the `max-width` in your autocomplete dropdown class and all done.

## Datasets

An autocomplete is composed of one or more datasets. When an end-user modifies the
value of the underlying input, each dataset will attempt to render suggestions for the
new value.

Datasets can be configured using the following options.

-   **source** – The backing data source for suggestions. Expected to be a function
    with the signature `(query, cb)`. It is expected that the function will
    compute the suggestion set (i.e. an array of JavaScript objects) for `query`
    and then invoke `cb` with said set. `cb` can be invoked synchronously or
    asynchronously.

-   **name** – The name of the dataset. This will be appended to `tt-dataset-` to
    form the class name of the containing DOM element. Must only consist of
    underscores, dashes, letters (`a-z`), and numbers. Defaults to a random
    number.

-   **displayKey** – For a given suggestion object, determines the string
    representation of it. This will be used when setting the value of the input
    control after a suggestion is selected. Can be either a key string or a
    function that transforms a suggestion object into a string. Defaults to
    `value`.
    Example function usage: `displayKey: function(suggestion) { return suggestion.nickname || suggestion.firstName }`

-   **templates** – A hash of templates to be used when rendering the dataset. Note
    a precompiled template is a function that takes a JavaScript object as its
    first argument and returns a HTML string.

    -   **empty** – Rendered when `0` suggestions are available for the given query.
        Can be either a HTML string or a precompiled template. The templating function
        is called with a context containing `query`, `isEmpty`, and any optional
        arguments that may have been forwarded by the source:
        `function emptyTemplate({ query, isEmpty }, [forwarded args])`.

    -   **footer** – Rendered at the bottom of the dataset. Can be either a HTML
        string or a precompiled template. The templating function
        is called with a context containing `query`, `isEmpty`, and any optional
        arguments that may have been forwarded by the source:
        `function footerTemplate({ query, isEmpty }, [forwarded args])`.

    -   **header** – Rendered at the top of the dataset. Can be either a HTML string
        or a precompiled template. The templating function
        is called with a context containing `query`, `isEmpty`, and any optional
        arguments that may have been forwarded by the source:
        `function headerTemplate({ query, isEmpty }, [forwarded args])`.

    -   **suggestion** – Used to render a single suggestion. The templating function
        is called with the `suggestion`, and any optional arguments that may have
        been forwarded by the source: `function suggestionTemplate(suggestion, [forwarded args])`.
        Defaults to the value of `displayKey` wrapped in a `p` tag i.e. `<p>{{value}}</p>`.

	-	**loader** - Rendered when the query is being fetched. Can be either a HTML string. The 			templating function is called with a context containing `query`, `isLoading`, and any optional
        arguments that may have been forwarded by the source:
        `function laodingTemplate({ query, isLoading }, [forwarded args])`.

-   **debounce** – If set, will postpone the source execution until after `debounce` milliseconds
    have elapsed since the last time it was invoked.

## Events

The autocomplete component triggers the following custom events.

-   **autocomplete:opened** – Triggered when the dropdown menu of the autocomplete is
    opened.

-   **autocomplete:shown** – Triggered when the dropdown menu of the autocomplete is
    shown (opened and non-empty).

-   **autocomplete:empty** – Triggered when all datasets are empty.

-   **autocomplete:closed** – Triggered when the dropdown menu of the autocomplete is
    closed.

-   **autocomplete:updated** – Triggered when a dataset is rendered.

-   **autocomplete:cursorchanged** – Triggered when the dropdown menu cursor is moved
    to a different suggestion. The event handler will be invoked with 3
    arguments: the jQuery event object, the suggestion object, and the name of
    the dataset the suggestion belongs to.

-   **autocomplete:selected** – Triggered when a suggestion from the dropdown menu is
    selected. The event handler will be invoked with the following arguments: the jQuery
    event object, the suggestion object, the name of the dataset the
    suggestion belongs to and a `context` object. The `context` contains
    a `.selectionMethod` key that can be either `click`, `enterKey`, `tabKey` or
    `blur`, depending how the suggestion was selected.

-   **autocomplete:cursorremoved** – Triggered when the cursor leaves the selections
    or its current index is lower than 0

-   **autocomplete:autocompleted** – Triggered when the query is autocompleted.
    Autocompleted means the query was changed to the hint. The event handler will
    be invoked with 3 arguments: the jQuery event object, the suggestion object,
    and the name of the dataset the suggestion belongs to.

-   **autocomplete:redrawn** – Triggered when `appendTo` is used and the wrapper is resized/repositionned.

All custom events are triggered on the element initialized as the autocomplete.

## Styles

Add the following CSS rules to add a default style:

```css
.appbase-autocomplete {
	width: 100%;
}
.appbase-autocomplete .aa-input,
.appbase-autocomplete .aa-hint {
	width: 100%;
}
.appbase-autocomplete .aa-hint {
	color: #999;
}
.appbase-autocomplete .aa-dropdown-menu {
	width: 100%;
	background-color: #fff;
	border: 1px solid #999;
	border-top: none;
}
.appbase-autocomplete .aa-dropdown-menu .aa-suggestion {
	cursor: pointer;
	padding: 5px 4px;
}
.appbase-autocomplete .aa-dropdown-menu .aa-suggestion.aa-cursor {
	background-color: #b2d7ff;
}
.appbase-autocomplete .aa-dropdown-menu .aa-suggestion em {
	font-weight: bold;
	font-style: normal;
}
```


## Demo
### Demo with different options applied on Search

<iframe src="https://codesandbox.io/embed/github/appbaseio/searchbox/tree/master/examples/search?fontsize=14&hidenavigation=1&view=preview" title="autocomplete-example" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### Demo with Results

<iframe src="https://codesandbox.io/embed/github/appbaseio/searchbox/tree/master/examples/search-with-results?fontsize=14&hidenavigation=1&view=preview" title="search-with-results-example" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

