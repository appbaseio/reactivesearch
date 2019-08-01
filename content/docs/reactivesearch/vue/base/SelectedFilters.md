---
title: 'SelectedFilters'
meta_title: 'SelectedFilters'
meta_description: '`SelectedFilters` creates a selectable filter UI view displaying the current selected values from other components.'
keywords:
    - reactivesearch
    - selectedfilters
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'vue-reactivesearch'
---

![Image to be displayed](https://i.imgur.com/6GqSVW2.png)

`SelectedFilters` creates a selectable filter UI view displaying the current selected values from other components. This component is useful for improving selection accessibility of other components.

Example uses:

-   displaying all the user selected facet filters together in the main view area for better accessibility.
-   building mobile responsive views where it is not practical to show all the UI components in the main view.

## Usage

### Basic Usage

```js
<template>
	<selected-filters />
</template>
```

### Usage with All Props

```js
<selected-filters
    clearAllLabel="Clear filters"
    :showClearAll="true"
/>
```

### Props

-   **showClearAll** `boolean` [optional] (defaults to `true`)
    When set to `true`, displays an additional button to clear all the filters
-   **clearAllLabel** `string` [optional] (defaults to `'Clear All'`)
    Sets the label for the clear all button.
-   **title** `string` [optional]
    Can be used to set a title

Most ReactiveSearch filter components have a prop `showFilter` (defaults to `true`) which can be used to control whether the component's selected state appears in the SelectedFilters component. There is also a `filterLabel` prop which controls how that component is displayed.

> Note
>
> The `showFilter` and `filterLabel` prop updates are only reflected if the underlying query of the associated component has changed.

As an example, check [MultiList usage](/basic-components/multilist.html#usage) to see how `showFilter` and `filterLabel` can be used.

### Styles

`SelectedFilters` component supports `innerClass` prop with the following keys:

-   `button`

Read more about it [here](/theming/class.html).

## Extending

`SelectedFilters` component can be extended to customize the look and feel with `className`.

```js
<selected-filters className="custom-class" />
```

-   **className** `String`
    CSS class to be injected on the component container.
-   **slot-scope** ( Default Slot )
    Enables custom rendering for **SelectedFilters** component. It provides an object as a param which contains all the props needed to render the custom selected-filters, including the functions to clear and update the component values.
