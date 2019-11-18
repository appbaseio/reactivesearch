---
title: 'Grouping Results'
meta_title: 'Grouping Results'
meta_description: 'Recipe for rendering distinct results with `Search`, `Result` and `Reactive` components using the `slots`.'
keywords:
    - reactivesearch
    - groupingresults
    - appbase
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'vue-reactivesearch'
---

Read more about `aggregationField` prop for different components:

-   [**DataSearch**](/docs/reactivesearch/vue/search/DataSearch#props)
-   [**ReactiveList**](/docs/reactivesearch/vue/result/ReactiveList#props)
-   [**ReactiveComponent**](/docs/reactivesearch/vue/advanced/ReactiveComponent#props)

## Why?

Grouping records usually refers to the process of combining multiple records into a single result, or consolidating many similar records into two or three results. This kind of de-duplication or aggregation of results has three primary use cases:

-   **Item Variations**: where any item with variations is displayed only once. A t-shirt that comes in five colors should only appear once in the results, with all five color options displayed somewhere in the description.
-   **Large Records**: where you first break up large record into smaller sub-records, and then during the search, if several of these sub-records match, you display the most relevant one.
-   **Grouping by attribute**: where you group records depending on the value of one of their attributes.

## How?

Let's take example of [carstore-dataset](https://dejavu.appbase.io/?appname=carstore-dataset-latest&url=https://B86d2y2OE:4fecb2c5-5c5f-49e5-9e0b-0faba74597c6@scalr.api.appbase.io&mode=view). We have different brands of cars, but we only want to show distinct brands.
This can be achieved by defining `aggregationField` prop in `ReactiveList` as `brand.keyword`.

###Without aggregationField

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/next/packages/vue/examples/reactivelist-without-aggregation" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

###With aggregationField

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/reactivesearch/tree/next/packages/vue/examples/reactivelist-with-aggregation" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
