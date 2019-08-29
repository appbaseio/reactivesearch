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

**[SingleList](/docs/reactivesearch/v3/list/singlelist/)** is useful for displaying a list of values where only one item can be selected at a time, and the values are retrieved by a database query on the field specified in the **dataField** prop.

</p>

<p>

**[MultiList](/docs/reactivesearch/v3/list/multilist/)** is useful for displaying a list of values where multiple values can be selected at a time. Similar to SingleList, these values are retrieved by a database query on the field specified in the **dataField** prop.

</p>

<p>

**[SingleDataList](/docs/reactivesearch/v3/list/singledatalist/)** is useful for displaying a list of user defined values where only one value item can be selected at a time. Unlike SingleList and MultiList where the values are auto-fetched, here the **data** prop allows curation of which values to display.

</p>

<p>

**[MultiDataList](/docs/reactivesearch/v3/list/multidatalist/)** is useful for displaying a list of user defined values where multiple value items can be selected at a time. Similar to the SingleDataList component, the **data** prop allows curation of which values to display.

</p>

> List vs DataList
>
> Use-cases where curation is important and only a few items need to be shown should use DataList components. Since it doesn't need to auto-fetch the results, it also saves a network request.

<p>

**[SingleDropdownList](/docs/reactivesearch/v3/list/singledropdownlist/)** displays a dropdown list UI where only one item can be selected at a time. It is similar to SingleList but is presented in a dropdown format to save space.

</p>

<p>

**[MultiDropdownList](/docs/reactivesearch/v3/list/multidropdownlist/)** displays a dropdown list UI where multiple items can be selected at a time. It is similar to MultiList.

</p>
<br>

> When to use dropdown lists
>
> Dropdown lists take up less space. If you have many filters to display or a smaller display area (like on phones), it is better to use dropdown lists.

<p>

**[ToggleButton](/docs/reactivesearch/v3/list/togglebutton/)** component applies on a String or Text datatype field where you want users to select a choice (or choices) amongst a small number of total choices.

</p>

<p>

**[TagCloud](/docs/reactivesearch/v3/list/tagcloud/)** is useful for showing a weighted tag cloud of items based on the frequency of occurrences.

</p>

## 2. Range Components

The following are all the possible UI components for a numeric datatype field in your appbase.io app. These apply a **range** database query on the selected item(s).

<p>

**[SingleRange](/docs/reactivesearch/v3/range/singlerange/)** displays a curated list of items where only one item can be selected at a time. Each item represents a range of values, specified in the **data** prop of the component.

</p>

> <i class="fa fa-info-circle"></i> Note
>
> Its counterpart for a String datatype would be **SingleDataList** component.

<p>

**[MultiRange](/docs/reactivesearch/v3/range/multirange/)** displays a curated list of items where multiple items can be selected at a time. Each item represents a range of values, specified in the **data** prop of the component.

</p>

> <i class="fa fa-info-circle"></i> Note
>
> Its counterpart for a String datatype would be **MultiDataList** component.

<p>

**[SingleDropdownRange](/docs/reactivesearch/v3/range/singledropdownrange/)** displays a dropdown list UI where only one item can be selected at a time. Each item in this dropdown list represents a range, specified in the **data** prop of the component.

</p>

<p>

**[MultiDropdownRange](/docs/reactivesearch/v3/range/multidropdownrange/)** displays a dropdown list UI where only multiple items can be selected at a time. Each item in this dropdown list represents a range, specified in the **data** prop of the component.

</p>

### RangeSlider

<p>

**[RangeSlider](/docs/reactivesearch/v3/range/rangeslider/)** component applies on a numeric datatype (ideally an integer) field and displays a slider UI.

</p>

> RangeSlider vs Range lists
>
> A RangeSlider is useful when the selection of values is homogeneous, e.g. price across a set of products.

### DynamicRangeSlider

<p>

**[DynamicRangeSlider](/docs/reactivesearch/v3/range/dynamicrangeslider/)** is a more specific version of the [RangeSlider](/docs/reactivesearch/v3/range/rangeslider/) component where the available range is dynamically set based on the sub-set of data filtered by other components in the view.

</p>

### RangeInput

<p>

**[RangeInput](/docs/reactivesearch/v3/range/rangeinput/)** component displays a [RangeSlider](/docs/reactivesearch/v3/range/rangeslider/) with input controls.

</p>

### NumberBox

<p>

**[NumberBox](/docs/reactivesearch/v3/range/numberbox/)** component applies on a numeric datatype field where you want to display a selectable field value that can be incrementally increased or decreased, e.g. no of guests field in a hotel booking app.

</p>

### DatePicker and DateRange

<p>

**[DatePicker](/docs/reactivesearch/v3/range/datepicker/)** and **[DateRange](/docs/reactivesearch/v3/range/daterange/)** components are useful for showing selectable date fields. They apply to Date datatype field, and internally apply a date range query on the database.

</p>

### RatingsFilter

<p>

**[RatingsFilter](/docs/reactivesearch/v3/range/ratingsfilter/)** is useful for showing a UI selection choice based on ratings score. To be applied on a numeric datatype field.

</p>

## 3. Search Components

The following are UI components that represent searchbar UIs. The datatype for the `dataField` in these components should be a `Text` (or `String`) or `Keyword`, along with custom analyzer (like ngrams) based mappings defined in sub-fields.

### DataSearch

<p>

**[DataSearch](/docs/reactivesearch/v3/search/datasearch/)** displays a search input box. It supports autosuggestions, highlighting of results and querying against more than one fields via props.

</p>

### CategorySearch

<p>

**[CategorySearch](/docs/reactivesearch/v3/search/categorysearch/)** is a more specific version of the [DataSearch](/docs/reactivesearch/v3/basic/datasearch/) component. The main difference is that it can show suggestions within specific categories besides the general auto-suggestions that appear in the search dropdown.

</p>

## 4. Result Components

Result components are used for displaying the results (aka hits).

> How do result components fetch results by combining queries from multiple components?
>
> They do this via [**react**](/docs/reactivesearch/v3/advanced/react/) prop, which allows each component to specify their dependent components using a DSL that mirrors Elasticsearch's compound query DSL for bool clause.

### ReactiveList

<p>

**[ReactiveList](/docs/reactivesearch/v3/result/reactivelist/)** displays the results in a configurable list layout. Reactivesearch also provides two components which can be used with `ReactiveList` to display a decorated list and card based layout.

</p>

### ResultList

<p>

**[ResultList](/docs/reactivesearch/v3/result/resultlist/)** displays a particular result list item.

</p>

### ResultCard

<p>

**[ResultCard](/docs/reactivesearch/v3/result/resultcard/)** displays a particular result card item.

</p>

### ReactiveComponent

<p>

**[ReactiveComponent](/docs/reactivesearch/v3/advanced/reactivecomponent/)** is a wrapper component that allows you to connect custom component(s) (passed as children) with the Reactivesearch ecosystem, e.g. if we are building an e-commerce store where we have a react component called `ColorPicker` which renders the `colors` passed to it as tiles, allowing us to filter the products by their colors.

</p>

## 5. Map Components

Map components are useful for displaying geospatial data.

### GeoDistanceSlider

<p>

**[GeoDistanceSlider](/docs/reactivesearch/v3/map/geodistanceslider/)** displays a places search UI component to then filter by a distance range slider based on the selected location.

</p>

### GeoDistanceDropdown

<p>

**[GeoDistanceDropdown](/docs/reactivesearch/v3/map/geodistancedropdown/)** displays a places search UI component to then filter by a distance range dropdown based on the selected location.

</p>

> <i class="fa fa-info-circle"></i> Note
>
> Both **GeoDistance** components location search UI is flexible: It uses Google Places search to filter location by default, but if a **dataField** prop is present - it searches on the data present in the field.

### ReactiveMap

<p>

**[ReactiveMap](/docs/reactivesearch/v3/map/reactivegooglemap/)** displays results on a map UI component. It can also be classified as a result component.

</p>

## 6. Base Components

`Base components` are useful primitive components that don’t belong to any of the above categories.

### SelectedFilters

**[SelectedFilters](/docs/reactivesearch/v3/base/selectedfilters/)** is a selection component to render the selected values from other components with a "Clear All" option.
