---
title: 'SelectedFilters'
meta_title: 'SelectedFilters'
meta_description: 'SelectedFilters creates a selectable filter UI view displaying the current selected values from other components.'
keywords:
    - reactivesearch
    - selectedfilters
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'web-reactivesearch'
---

![Image to be displayed](https://i.imgur.com/6GqSVW2.png)

`SelectedFilters` creates a selectable filter UI view displaying the current selected values from other components. This component is useful for improving selection accessibility of other components.

Example uses:

-   displaying all the user selected facet filters together in the main view area for better accessibility.
-   building mobile responsive views where it is not practical to show all the UI components in the main view.

## Usage

### Basic Usage

```jsx
<SelectedFilters />
```

### Usage with All Props

```jsx
<SelectedFilters showClearAll={true} clearAllLabel="Clear filters" />
```

### Props

-   **showClearAll** `boolean` [optional] (defaults to `true`)
    When set to `true`, displays an additional button to clear all the filters
-   **clearAllLabel** `string` [optional] (defaults to `'Clear All'`)
    Sets the label for the clear all button.
-   **onChange** `function` [optional]
    Provides access to the current selected values. This enables you to retrieve the selected filters and current search state in a convenient way.
-   **onClear** `function` [optional]
    a callback function which will be called when a particular filter(value) has been removed from the selected filters, provides the `component` and `value`. <br/><br/>
    Example:

```jsx
<SelectedFilters
	onClear={(component, value) => {
		console.log(`${component} has been removed with value as ${value}`);
	}}
/>
```

Most ReactiveSearch filter components have a prop `showFilter` (defaults to `true`) which can be used to control whether the component's selected state appears in the SelectedFilters component. There is also a `filterLabel` prop which controls how that component is displayed.

> Note
>
> The `showFilter` and `filterLabel` prop updates are only reflected if the underlying query of the associated component has changed.

As an example, check [MultiList usage](/docs/reactivesearch/v3/list/multilist#usage) to see how `showFilter` and `filterLabel` can be used.

### Demo

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/dev/packages/web/examples/SelectedFilters" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### Styles

`SelectedFilters` component supports `innerClass` prop with the following keys:

-   `button`

Read more about it [here](/docs/reactivesearch/v3/theming/classnameinjection/).

## Extending

`SelectedFilters` component can be extended to customize the look and feel with `className`, `style`.

```jsx
<SelectedFilters className="custom-class" style={{ paddingBottom: '10px' }} />
```

-   **className** `String`
    CSS class to be injected on the component container.
-   **style** `Object`
    CSS styles to be applied to the **SelectedFilters** component.
-   **render** `Function`
    Enables custom rendering for **SelectedFilters** component. It provides an object as a param which contains all the props needed to render the custom selected-filters, including the functions to clear and update the component values. [Check the usage here](https://github.com/appbaseio/reactivesearch/blob/dev/packages/web/examples/CustomSelectedFilters/src/index.js).

### Examples

SelectedFilters work with most ReactiveSearch components. See more stories for SelectedFilters with a SingleList on playground.

<a href="https://opensource.appbase.io/playground/?selectedKind=List%20components%2FSingleList" target="_blank">SingleList with SelectedFilters</a>
