---
title: 'React Prop'
meta_title: 'React Prop'
meta_description: '`react` prop is available in components whose data view should reactively update when on or more dependent components change their states.'
keywords:
    - reactivesearch
    - reactprop
    - appbase
    - elasticsearch
sidebar: 'web-reactivesearch'
---

One of the key ideas behind Reactive Search and Reactive Maps is the reactive design pattern, which allows defining how a component reacts to changes in the states of the sensors. This allows almost all ReactiveSearch components to watch each other and update their data reactively. For example, a [SingleList](/list-components/singlelist.html) component can update its data based on the search term in a [DataSearch](/search-components/datasearch.html) component.

### Usage

```javascript
<ReactiveMap
    ...
    react={{
      "and": "citySensor",
      "or": "searchSensor"
    }}
>
```

### Props

-   **react** `Object`
    `react` prop is available in components whose data view should reactively update when on or more dependent components change their states, e.g. [`ReactiveMap`](/map-components/reactivemap.html), [`ReactiveList`](/basic-components/reactivelist.html).
    -   **key** `String`
        one of `and`, `or`, `not` defines the combining clause.
        -   **and** clause implies that the results will be filtered by matches from **all** of the associated component states.
        -   **or** clause implies that the results will be filtered by matches from **at least one** of the associated component states.
        -   **not** clause implies that the results will be filtered by an **inverse** match of the associated component states.
    -   **value** `String or Array or Object`
        -   `String` is used for specifying a single component by its `componentId`.
        -   `Array` is used for specifying multiple components by their `componentId`.
        -   `Object` is used for nesting other key clauses.

An example of a `react` clause where all three clauses are used and values are `Object`, `Array` and `String`.

```js
<ReactiveMap
  ...
  react={{
    "and": {
        "or": ["CityComp", "TopicComp"],
        "not": "BlacklistComp"
    }
  }}
/>
```

Here, we are specifying that the map's UI should update whenever one of the blacklist items is not present and simultaneously any one of city or topics matches.
