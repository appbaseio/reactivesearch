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
nestedSidebar: 'vue-reactivesearch'
---

**ReactiveSearch-Vue** provides Vue UI components for Elasticsearch. This document explains the different kinds of components offered by the library and walks throughs scenarios of when to use which component.

Components are divided into four broad categories:

1. `List components` represent all kinds of list related UI components which typically create a term query.
2. `Range components` represent all kinds of numbers and dates related UI components which typically create a range based query.
3. `Search components` represent searchbar UIs, which typically apply search on full-text data.
4. `Result components` are components for displaying results (aka hits) from queries created by other components.

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

## 2. Range Components

The following are all the possible UI components for a numeric datatype field in your appbase.io app. These apply a **range** database query on the selected item(s).

<p>
<img src="https://imgur.com/tPi76EU.png" style="float:left">

**[SingleRange](/range-components/singlerange.html)** displays a curated list of items where only one item can be selected at a time. Each item represents a range of values, specified in the **data** prop of the component.

</p>

## 3. Search Components

The following are UI components that represent searchbar UIs. The datatype for the `dataField` in these components should be a `Text` (or `String`) or `Keyword`, along with custom analyzer (like ngrams) based mappings defined in sub-fields.

### DataSearch

<p>
<img src="https://imgur.com/kbnVVkZ.png" style="float:left">

**[DataSearch](/search-components/datasearch.html)** displays a search input box.

</p>

## 4. Result Components

Result components are used for displaying the results (aka hits).

> How do result components fetch results by combining queries from multiple components?
>
> They do this via [**react**](advanced/react.html) prop, which allows each component to specify their dependent components using a DSL that mirrors Elasticsearch's compound query DSL for bool clause.

### ReactiveList

<p>
<img src="https://imgur.com/PCBwK7t.png" style="float:left">

**[ReactiveList](/result-components/reactivelist.html)** displays the results in a configurable list layout. This is a more flexible display component (used internally by both ResultList and ResultCard) that allows more customization than ResultList and ResultCard.

</p>

## 5. Base Components

`Base components` are useful primitive components that don’t belong to any of the above categories.

### SelectedFilters

**[SelectedFilters](/base-components/selectedfilters.html)** is a selection component to render the selected values from other components with a "Clear All" option.
