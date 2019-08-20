---
title: 'Components'
meta_title: 'Components'
meta_description: 'Reactivesearch Native Components. '
keywords:
    - reactivesearch-native
    - components
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'native-reactivesearch'
---

**ReactiveSearch** provides React UI components for Elasticsearch. This document explains the different kinds of components offered by the library and walks throughs scenarios of when to use which component.

Components are divided into four broad categories:

1. `List components` represent all kinds of list related UI components which typically create a term query.
2. `Range components` represent all kinds of numbers and dates related UI components which typically create a range based query.
3. `Search components` represent searchbar UIs, which typically apply search on full-text data.
4. `Result components` are components for displaying results (aka hits) from queries created by other components.

Besides these four specific categories, we also have `Base components` that are useful primitives and components that don't belong to any of the above categories.

## 1. List Components

List is one of the most used data-driven UI displays and hence naturally, we offer a variety of ways to use this UI style.

#### String or Text Datatype

The following are all the possible UI components for a `Text` or `String` datatype field in your appbase.io app. These apply a **term** or **terms** database query on the selected item(s).

The components can also be used with `Numeric` datatype fields.

<p>
<img src="https://imgur.com/a1be47e.png" style="float:left">

**[SingleDropdownList](/docs/reactivesearch/native/components/SingleDropdownList/)** displays a dropdown list UI where only one item can be selected at a time. It is similar to SingleList but is presented in a dropdown format to save space.

</p>
<br>

<p>
<img src="https://imgur.com/UVymwfo.png" style="float:left">

**[MultiDropdownList](/docs/reactivesearch/native/components/MultiDropdownList/)** displays a dropdown list UI where multiple items can be selected at a time. It is similar to MultiList.

</p>
<br>

> When to use dropdown lists
>
> Dropdown lists take up less space. If you have many filters to display or a smaller display area (like on phones), it is better to use dropdown lists.

## 2. Range Components

The following are all the possible UI components for a numeric datatype field in your appbase.io app. These apply a **range** database query on the selected item(s).

<p>
<img src="https://imgur.com/2xxBIUg.png" style="float:left">

**[SingleDropdownRange](/docs/reactivesearch/native/components/SingleDropdownRange/)** displays a dropdown list UI where only one item can be selected at a time. Each item in this dropdown list represents a range, specified in the **data** prop of the component.

</p>

<p>
<img src="https://imgur.com/MrTth88.png" style="float:left">

**[MultiDropdownRange](/docs/reactivesearch/native/components/MultiDropdownRange/)** displays a dropdown list UI where only multiple items can be selected at a time. Each item in this dropdown list represents a range, specified in the **data** prop of the component.

</p>

### DatePicker and DateRange

<p>
<img src="https://imgur.com/rJsL0mK.png" style="float:left"><img src="https://imgur.com/7dKLsNO.png" style="float:left">

**[DatePicker](/docs/reactivesearch/native/components/DatePicker/)** and **[DateRange](/docs/reactivesearch/native/components/DateRange/)** components are useful for showing selectable date fields. They apply to Date datatype field, and internally apply a date range query on the database.

</p>

## 3. Search Components

The following are UI components that represent searchbar UIs. The datatype for the `dataField` in these components should be a `Text` (or `String`) or `Keyword`, along with custom analyzer (like ngrams) based mappings defined in sub-fields.

### DataSearch

<p>
<img src="https://imgur.com/kbnVVkZ.png" style="float:left">

**[DataSearch](/docs/reactivesearch/native/components/DataSearch/)** displays a search input box. It supports autosuggestions, highlighting of results and querying against more than one fields via props.

</p>

> <i class="fa fa-info-circle"></i> Note
>
> If you are looking to apply a query on a user input, **DataSearch** is preferable over **TextField**.

## 4. Result Components

Result components are used for displaying the results (aka hits).

> How do result components fetch results by combining queries from multiple components?
>
> They do this via [**react**](/docs/reactivesearch/v3/advanced/react/) prop, which allows each component to specify their dependent components using a DSL that mirrors Elasticsearch's compound query DSL for bool clause.

### ReactiveList

<p>
<img src="https://imgur.com/PCBwK7t.png" style="float:left">

**[ReactiveList](/docs/reactivesearch/native/components/ReactiveList/)** displays the results in a configurable list layout.

</p>

## 5. Base Components

### TextField

<p>
<img src="https://imgur.com/PgOi2QY.png" style="float:left">

**[TextField](/docs/reactivesearch/native/components/TextField/)** displays a text input field. It applies a **match** database query on the entered text.

</p>

### ReactiveComponent

<p>
<img src="https://imgur.com/QgjzJv5.png" style="float:left">

**[ReactiveComponent](/docs/reactivesearch/native/advanced/ReactiveComponent/)** is a wrapper component that allows you to connect custom component(s) (passed as children) with the Reactivesearch ecosystem, e.g. if we are building an e-commerce store where we have a react component called `ColorPicker` which renders the `colors` passed to it as tiles, allowing us to filter the products by their colors.

</p>
