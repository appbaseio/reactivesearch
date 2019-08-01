---
title: 'Components Overview'
meta_title: 'Components Overview'
meta_description: 'ReactiveMaps is a complimentary library to ReactiveSearch.'
keywords:
    - reactivesearch
    - components
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'web-reactivesearch'
---

**ReactiveSearch** provides React UI components for Elasticsearch. This document explains the different kinds of components offered by the library and walks throughs scenarios of when to use which component.

Components are divided into five broad categories:

1. `List components` represent all kinds of list related UI components which typically create a term query.
2. `Range components` represent all kinds of numbers and dates related UI components which typically create a range based query.
3. `Search components` represent searchbar UIs, which typically apply search on full-text data.
4. `Result components` are components for displaying results (aka hits) from queries created by other components.
5. `Map components` are components for displaying geospatial data.

Besides these five specific categories, we also have `Base components` that are useful primitives and components that don't belong to any of the above categories.

## 1. List Components

List is one of the most used data-driven UI displays and hence naturally, we offer a variety of ways to use this UI style.

#### String or Text Datatype

The following are all the possible UI components for a `Text` or `String` datatype field in your appbase.io app. These apply a **term** or **terms** database query on the selected item(s).

The components can also be used with `Numeric` datatype fields.

<p>

**[SingleList](/list-components/singlelist.html)** is useful for displaying a list of values where only one item can be selected at a time, and the values are retrieved by a database query on the field specified in the **dataField** prop.

</p>

<p>

**[MultiList](/list-components/multilist.html)** is useful for displaying a list of values where multiple values can be selected at a time. Similar to SingleList, these values are retrieved by a database query on the field specified in the **dataField** prop.

</p>

<p>

**[SingleDataList](/list-components/singledatalist.html)** is useful for displaying a list of user defined values where only one value item can be selected at a time. Unlike SingleList and MultiList where the values are auto-fetched, here the **data** prop allows curation of which values to display.

</p>

<p>

**[MultiDataList](/list-components/multidatalist.html)** is useful for displaying a list of user defined values where multiple value items can be selected at a time. Similar to the SingleDataList component, the **data** prop allows curation of which values to display.

</p>

> List vs DataList
>
> Use-cases where curation is important and only a few items need to be shown should use DataList components. Since it doesn't need to auto-fetch the results, it also saves a network request.

<p>

**[SingleDropdownList](/list-components/singledropdownlist.html)** displays a dropdown list UI where only one item can be selected at a time. It is similar to SingleList but is presented in a dropdown format to save space.

</p>

<p>

**[MultiDropdownList](/list-components/multidropdownlist.html)** displays a dropdown list UI where multiple items can be selected at a time. It is similar to MultiList.

</p>
<br>

> When to use dropdown lists
>
> Dropdown lists take up less space. If you have many filters to display or a smaller display area (like on phones), it is better to use dropdown lists.

<p>

**[ToggleButton](/list-components/togglebutton.html)** component applies on a String or Text datatype field where you want users to select a choice (or choices) amongst a small number of total choices.

</p>

<p>

**[TagCloud](/list-components/tagcloud.html)** is useful for showing a weighted tag cloud of items based on the frequency of occurrences.

</p>

## 2. Range Components

The following are all the possible UI components for a numeric datatype field in your appbase.io app. These apply a **range** database query on the selected item(s).

<p>

**[SingleRange](/range-components/singlerange.html)** displays a curated list of items where only one item can be selected at a time. Each item represents a range of values, specified in the **data** prop of the component.

</p>

> <i class="fa fa-info-circle"></i> Note
>
> Its counterpart for a String datatype would be **SingleDataList** component.

<p>

**[MultiRange](/range-components/multirange.html)** displays a curated list of items where multiple items can be selected at a time. Each item represents a range of values, specified in the **data** prop of the component.

</p>

> <i class="fa fa-info-circle"></i> Note
>
> Its counterpart for a String datatype would be **MultiDataList** component.

<p>

**[SingleDropdownRange](/range-components/singledropdownrange.html)** displays a dropdown list UI where only one item can be selected at a time. Each item in this dropdown list represents a range, specified in the **data** prop of the component.

</p>

<p>

**[MultiDropdownRange](/range-components/multidropdownrange.html)** displays a dropdown list UI where only multiple items can be selected at a time. Each item in this dropdown list represents a range, specified in the **data** prop of the component.

</p>

### RangeSlider

<p>

**[RangeSlider](/range-components/rangeslider.html)** component applies on a numeric datatype (ideally an integer) field and displays a slider UI.

</p>

> RangeSlider vs Range lists
>
> A RangeSlider is useful when the selection of values is homogeneous, e.g. price across a set of products.

### DynamicRangeSlider

<p>

**[DynamicRangeSlider](/range-components/dynamicrangeslider.html)** is a more specific version of the [RangeSlider](/range-components/rangeslider.html) component where the available range is dynamically set based on the sub-set of data filtered by other components in the view.

</p>

### RangeInput

<p>

**[RangeInput](/range-components/rangeinput.html)** component displays a [RangeSlider](/range-components/rangeslider.html) with input controls.

</p>

### NumberBox

<p>

**[NumberBox](/range-components/numberbox.html)** component applies on a numeric datatype field where you want to display a selectable field value that can be incrementally increased or decreased, e.g. no of guests field in a hotel booking app.

</p>

### DatePicker and DateRange

<p>

**[DatePicker](/range-components/datepicker.html)** and **[DateRange](/range-components/daterange.html)** components are useful for showing selectable date fields. They apply to Date datatype field, and internally apply a date range query on the database.

</p>

### RatingsFilter

<p>

**[RatingsFilter](/range-components/ratingsfilter.html)** is useful for showing a UI selection choice based on ratings score. To be applied on a numeric datatype field.

</p>

## 3. Search Components

The following are UI components that represent searchbar UIs. The datatype for the `dataField` in these components should be a `Text` (or `String`) or `Keyword`, along with custom analyzer (like ngrams) based mappings defined in sub-fields.

### DataSearch

<p>

**[DataSearch](/search-components/datasearch.html)** displays a search input box. It supports autosuggestions, highlighting of results and querying against more than one fields via props.

</p>

### CategorySearch

<p>

**[CategorySearch](/search-components/categorysearch.html)** is a more specific version of the [DataSearch](/basic-components/datasearch.html) component. The main difference is that it can show suggestions within specific categories besides the general auto-suggestions that appear in the search dropdown.

</p>

## 4. Result Components

Result components are used for displaying the results (aka hits).

> How do result components fetch results by combining queries from multiple components?
>
> They do this via [**react**](/advanced/react.html) prop, which allows each component to specify their dependent components using a DSL that mirrors Elasticsearch's compound query DSL for bool clause.

### ReactiveList

<p>

**[ReactiveList](/result-components/reactivelist.html)** displays the results in a configurable list layout. Reactivesearch also provides two components which can be used with `ReactiveList` to display a decorated list and card based layout.

</p>

### ResultList

<p>

**[ResultList](/result-components/resultlist.html)** displays a particular result list item.

</p>

### ResultCard

<p>

**[ResultCard](/result-components/resultcard.html)** displays a particular result card item.

</p>

### ReactiveComponent

<p>

**[ReactiveComponent](/advanced/reactivecomponent.html)** is a wrapper component that allows you to connect custom component(s) (passed as children) with the Reactivesearch ecosystem, e.g. if we are building an e-commerce store where we have a react component called `ColorPicker` which renders the `colors` passed to it as tiles, allowing us to filter the products by their colors.

</p>

## 5. Map Components

Map components are useful for displaying geospatial data.

### GeoDistanceSlider

<p>

**[GeoDistanceSlider](/map-components/geodistanceslider.html)** displays a places search UI component to then filter by a distance range slider based on the selected location.

</p>

### GeoDistanceDropdown

<p>

**[GeoDistanceDropdown](/map-components/geodistancedropdown.html)** displays a places search UI component to then filter by a distance range dropdown based on the selected location.

</p>

> <i class="fa fa-info-circle"></i> Note
>
> Both **GeoDistance** components location search UI is flexible: It uses Google Places search to filter location by default, but if a **dataField** prop is present - it searches on the data present in the field.

### ReactiveMap

<p>

**[ReactiveMap](/map-components/reactivemap.html)** displays results on a map UI component. It can also be classified as a result component.

</p>

## 6. Base Components

`Base components` are useful primitive components that don’t belong to any of the above categories.

### SelectedFilters

**[SelectedFilters](/base-components/selectedfilters.html)** is a selection component to render the selected values from other components with a "Clear All" option.
