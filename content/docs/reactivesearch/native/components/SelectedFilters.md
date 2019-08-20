---
title: 'SelectedFilters'
meta_title: 'SelectedFilters'
meta_description: '`SelectedFilters` creates a selectable filter UI view displaying the current selected values from other components.'
keywords:
    - reactivesearch-native
    - selectedfilters
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'native-reactivesearch'
---

![Image to be displayed](https://imgur.com/WA6Gi88.png)

`SelectedFilters` creates a selectable filter UI view displaying the current selected values from other components. This component is useful for improving selection accessibility of other components.

Example uses:

-   displaying all the user selected facet filters together in the main view area for better accessibility.
-   building mobile responsive views where it is not practical to show all the UI components in the main view.

## Usage

### Basic Usage

```js
<SelectedFilters />
```

### Usage with All Props

```js
<SelectedFilters showClearAll={true} clearAllLabel="Clear filters" />
```

### Props

-   **showClearAll** `boolean` [optional] (defaults to `true`)
    When set to `true`, displays an additional button to clear all the filters
-   **clearAllLabel** `string` [optional] (defaults to `'Clear All'`)
    Sets the label for the clear all button.

Most ReactiveSearch filter components have a prop `showFilter` (defaults to `true`) which can be used to control whether the component's selected state appears in the SelectedFilters component. There is also a `filterLabel` prop which controls how that component is displayed.

> Note
>
> The `showFilter` and `filterLabel` prop updates are only reflected if the underlying query of the associated component has changed.

As an example, check [SingleDropdownList usage](/components/singledropdownlist.html#usage) to see how `showFilter` and `filterLabel` can be used.

### Demo

<br />

<div data-snack-id="@divyanshu013/selectedfilters-example" data-snack-platform="ios" data-snack-preview="true" data-snack-theme="dark" style="overflow:hidden;background:#212733;border:1px solid rgba(0,0,0,.16);border-radius:4px;height:505px;width:100%"></div>

<a href="https://snack.expo.io/@divyanshu013/selectedfilters-example" target="_blank">View on Snack</a>

### Styles

`SelectedFilters` component supports `style` prop. Read more about it [here](/docs/reactivesearch/native/advanced/Style/).

## Extending

`SelectedFilters` component can be extended to customize the look and feel with `style`.

```js
<SelectedFilters style={{ paddingBottom: 10 }} />
```

-   **style** `Object`
    CSS styles to be applied to the **SelectedFilters** component.
