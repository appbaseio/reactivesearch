---
title: 'Components Overview'
meta_title: 'Components Overview'
meta_description: 'React UI components for Elasticsearch.'
keywords:
    - reactivesearch
    - components
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'web-v2-reactivesearch'
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
<img src="https://imgur.com/p2PBKh6.png" style="float:left">

**[SingleList](/list-components/singlelist.html)** is useful for displaying a list of values where only one item can be selected at a time, and the values are retrieved by a database query on the field specified in the **dataField** prop.

</p>

<p>
<img src="https://imgur.com/waVNdgr.png" style="float:left">

**[MultiList](/list-components/multilist.html)** is useful for displaying a list of values where multiple values can be selected at a time. Similar to SingleList, these values are retrieved by a database query on the field specified in the **dataField** prop.

</p>

<p>
<img src="https://imgur.com/b9l8Mhd.png" style="float:left">

**[SingleDataList](/list-components/singledatalist.html)** is useful for displaying a list of user defined values where only one value item can be selected at a time. Unlike SingleList and MultiList where the values are auto-fetched, here the **data** prop allows curation of which values to display.

</p>

<p>
<img src="https://imgur.com/2b1iVDZ.png" style="float:left">

**[MultiDataList](/list-components/multidatalist.html)** is useful for displaying a list of user defined values where multiple value items can be selected at a time. Similar to the SingleDataList component, the **data** prop allows curation of which values to display.

</p>

> List vs DataList
>
> Use-cases where curation is important and only a few items need to be shown should use DataList components. Since it doesn't need to auto-fetch the results, it also saves a network request.

<p>
<img src="https://imgur.com/a1be47e.png" style="float:left">

**[SingleDropdownList](/list-components/singledropdownlist.html)** displays a dropdown list UI where only one item can be selected at a time. It is similar to SingleList but is presented in a dropdown format to save space.

</p>

<p>
<img src="https://imgur.com/UVymwfo.png" style="float:left">

**[MultiDropdownList](/list-components/multidropdownlist.html)** displays a dropdown list UI where multiple items can be selected at a time. It is similar to MultiList.

</p>
<br>

> When to use dropdown lists
>
> Dropdown lists take up less space. If you have many filters to display or a smaller display area (like on phones), it is better to use dropdown lists.

## 2. Range Components

The following are all the possible UI components for a numeric datatype field in your appbase.io app. These apply a **range** database query on the selected item(s).

<p>
<img src="https://imgur.com/tPi76EU.png" style="float:left">

**[SingleRange](/range-components/singlerange.html)** displays a curated list of items where only one item can be selected at a time. Each item represents a range of values, specified in the **data** prop of the component.

</p>

> <i class="fa fa-info-circle"></i> Note
>
> Its counterpart for a String datatype would be **SingleDataList** component.

<p>
<img src="https://imgur.com/ulEoXvy.png" style="float:left">

**[MultiRange](/range-components/multirange.html)** displays a curated list of items where multiple items can be selected at a time. Each item represents a range of values, specified in the **data** prop of the component.

</p>

> <i class="fa fa-info-circle"></i> Note
>
> Its counterpart for a String datatype would be **MultiDataList** component.

<p>
<img src="https://imgur.com/2xxBIUg.png" style="float:left">

**[SingleDropdownRange](/range-components/singledropdownrange.html)** displays a dropdown list UI where only one item can be selected at a time. Each item in this dropdown list represents a range, specified in the **data** prop of the component.

</p>

<p>
<img src="https://imgur.com/MrTth88.png" style="float:left">

**[MultiDropdownRange](/range-components/multidropdownrange.html)** displays a dropdown list UI where only multiple items can be selected at a time. Each item in this dropdown list represents a range, specified in the **data** prop of the component.

</p>

### RangeSlider

<p>
<img src="https://imgur.com/n4HJ8dD.png" style="float:left">

**[RangeSlider](/range-components/rangeslider.html)** component applies on a numeric datatype (ideally an integer) field and displays a slider UI.

</p>

> RangeSlider vs Range lists
>
> A RangeSlider is useful when the selection of values is homogeneous, e.g. price across a set of products.

### DynamicRangeSlider

<p>
<img src="https://imgur.com/n4HJ8dD.png" style="float:left">

**[DynamicRangeSlider](/range-components/dynamicrangeslider.html)** is a more specific version of the [RangeSlider](/range-components/rangeslider.html) component where the available range is dynamically set based on the sub-set of data filtered by other components in the view.

</p>

### RangeInput

<p>
<img src="https://imgur.com/n4HJ8dD.png" style="float:left">

**[RangeInput](/range-components/rangeinput.html)** component displays a [RangeSlider](/range-components/rangeslider.html) with input controls.

</p>

### NumberBox

<p>
<img src="https://imgur.com/svE3sly.png" style="float:left">

**[NumberBox](/range-components/numberbox.html)** component applies on a numeric datatype field where you want to display a selectable field value that can be incrementally increased or decreased, e.g. no of guests field in a hotel booking app.

</p>

### DatePicker and DateRange

<p>
<img src="https://imgur.com/rJsL0mK.png" style="float:left"><img src="https://imgur.com/7dKLsNO.png" style="float:left">

**[DatePicker](/range-components/datepicker.html)** and **[DateRange](/range-components/daterange.html)** components are useful for showing selectable date fields. They apply to Date datatype field, and internally apply a date range query on the database.

</p>

### RatingsFilter

<p>
<img src="https://imgur.com/BxizhXe.png" style="float:left">

**[RatingsFilter](/range-components/ratingsfilter.html)** is useful for showing a UI selection choice based on ratings score. To be applied on a numeric datatype field.

</p>

## 3. Search Components

The following are UI components that represent searchbar UIs. The datatype for the `dataField` in these components should be a `Text` (or `String`) or `Keyword`, along with custom analyzer (like ngrams) based mappings defined in sub-fields.

### DataSearch

<p>
<img src="https://imgur.com/kbnVVkZ.png" style="float:left">

**[DataSearch](/search-components/datasearch.html)** displays a search input box. It supports autosuggestions, highlighting of results and querying against more than one fields via props.

</p>

> <i class="fa fa-info-circle"></i> Note
>
> If you are looking to apply a query on a user input, **DataSearch** is preferable over **TextField**.

### CategorySearch

<p>
<img src="https://imgur.com/kbnVVkZ.png" style="float:left">

**[CategorySearch](/search-components/categorysearch.html)** is a more specific version of the [DataSearch](/basic-components/datasearch.html) component. The main difference is that it can show suggestions within specific categories besides the general auto-suggestions that appear in the search dropdown.

</p>

## 4. Result Components

Result components are used for displaying the results (aka hits).

> How do result components fetch results by combining queries from multiple components?
>
> They do this via [**react**](/advanced/react.html) prop, which allows each component to specify their dependent components using a DSL that mirrors Elasticsearch's compound query DSL for bool clause.

### ResultList

<p>
<img src="https://imgur.com/L8xTmWd.png" style="float:left">

**[ResultList](/result-components/resultlist.html)** displays the results in a list layout.

</p>

### ResultCard

<p>
<img src="https://imgur.com/VGra3hs.png" style="float:left">

**[ResultCard](/result-components/resultcard.html)** displays the results in a card layout.

</p>

### ReactiveList

<p>
<img src="https://imgur.com/PCBwK7t.png" style="float:left">

**[ReactiveList](/result-components/reactivelist.html)** displays the results in a configurable list layout. This is a more flexible display component (used internally by both ResultList and ResultCard) that allows more customization than ResultList and ResultCard.

</p>

### ReactiveComponent

<p>
<img src="https://imgur.com/QgjzJv5.png" style="float:left">

**[ReactiveComponent](/advanced/reactivecomponent.html)** is a wrapper component that allows you to connect custom component(s) (passed as children) with the Reactivesearch ecosystem, e.g. if we are building an e-commerce store where we have a react component called `ColorPicker` which renders the `colors` passed to it as tiles, allowing us to filter the products by their colors.

</p>

## 5. Map Components

Map components are useful for displaying geospatial data.

### GeoDistanceSlider

<p>
<img src="https://i.imgur.com/J80Amc5.png" style="float:left">

**[GeoDistanceSlider](/map-components/geodistanceslider.html)** displays a places search UI component to then filter by a distance range slider based on the selected location.

</p>

### GeoDistanceDropdown

<p>
<img src="https://i.imgur.com/qlnZpUo.png" style="float:left">

**[GeoDistanceDropdown](/map-components/geodistancedropdown.html)** displays a places search UI component to then filter by a distance range dropdown based on the selected location.

</p>

> <i class="fa fa-info-circle"></i> Note
>
> Both **GeoDistance** components location search UI is flexible: It uses Google Places search to filter location by default, but if a **dataField** prop is present - it searches on the data present in the field.

### ReactiveMap

<p>
<img src="https://i.imgur.com/ykjArle.png" style="float:left">

**[ReactiveMap](/map-components/reactivemap.html)** displays results on a map UI component. It can also be classified as a result component.

</p>

## 6. Base Components

`Base components` are useful primitive components that don’t belong to any of the above categories.

### TextField

<p>
<img src="https://imgur.com/PgOi2QY.png" style="float:left">

**[TextField](/base-components/textfield.html)** displays a text input field. It applies a **match** database query on the entered text.

</p>

### ToggleButton

<p>
<img src="https://imgur.com/Ocb9Sir.png" style="float:left">

**[ToggleButton](/base-components/togglebutton.html)** component applies on a String or Text datatype field where you want users to select a choice (or choices) amongst a small number of total choices.

</p>

### TagCloud

<p>
<img src="https://imgur.com/lC5KfOK.png" style="float:left">

**[TagCloud](/base-components/tagcloud.html)** is useful for showing a weighted tag cloud of items based on the frequency of occurrences.

</p>

### DataController

<p>
<img src="https://imgur.com/qdxEIAz.png" style="float:left">

**[DataController](/base-components/datacontroller.html)** is a UI optional component for adding additional queries, e.g. a query based on current URL page path, a default query, a query based on user's global profile preferences. At the same time, it can also have a UI - this is a catchall component to display something that doesn't fit within other components.

</p>

### SelectedFilters

**[SelectedFilters](/base-components/selectedfilters.html)** is a selection component to render the selected values from other components with a "Clear All" option.
