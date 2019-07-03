---
title: 'DatePicker'
meta_title: 'DatePicker'
meta_description: '`DatePicker` creates a calender view based UI component that is connected to a database date field.'
keywords:
    - reactivesearch-native
    - datepicker
    - appbase
    - elasticsearch
sidebar: 'native-reactivesearch'
---

![](https://i.imgur.com/RNXGKFc.png)
![](https://i.imgur.com/Kuwiq3a.png)

`DatePicker` creates a calender view based UI component that is connected to a database date field. It is used for filtering results by a date like property.

Example uses:

-   finding flights departing on a particular day.
-   picking your date of birth for an online application form.

## Usage

### Basic Usage

```js
<DatePicker componentId="DateSensor" dataField="mtime" />
```

### Usage With All Props

```js
<DatePicker
	componentId="DateSensor"
	dataField="mtime"
	defaultSelected="2017-04-01"
	initialMonth="2017-04-01"
	queryFormat="date"
	placeholder="Pick date"
	showFilter={true}
	filterLabel="Date"
/>
```

## Props

-   **componentId** `String`
    unique identifier of the component, can be referenced in other components' `react` prop.
-   **dataField** `String`
    data field to be connected to the component's UI view.
-   **defaultSelected** `String` [optional]
    pre-selects a date.
-   **initialMonth** `String` [optional]
    starts the calendar view from the specified month.
-   **placeholder** `String` [optional]
    placeholder to be displayed in the dropdown searchbox. Defaults to "Select a date".
-   **showFilter** `Boolean` [optional]
    show as filter when a value is selected in a global selected filters view. Defaults to `true`.
-   **filterLabel** `String` [optional]
    An optional label to display for the component in the global selected filters view. This is only applicable if `showFilter` is enabled. Default value used here is `componentId`.
-   **queryFormat** `String` [optional]
    sets the date format to be used in the query, can accept one of the following:

<br />

|              **queryFormat** | **Representation as [elasticsearch date](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-date-format.html#built-in-date-formats)** |
| ---------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------: |
| `epoch_millis` **(default)** |                                                                       `epoch_millis`                                                                       |
|               `epoch_second` |                                                                       `epoch_second`                                                                       |
|                 `basic_time` |                                                                       `HHmmss.SSSZ`                                                                        |
|       `basic_time_no_millis` |                                                                         `HHmmssZ`                                                                          |
|                       `date` |                                                                        `yyyy-MM-dd`                                                                        |
|                 `basic_date` |                                                                         `yyyyMMdd`                                                                         |
|            `basic_date_time` |                                                                  `yyyyMMdd'T'HHmmss.SSSZ`                                                                  |
|  `basic_date_time_no_millis` |                                                                    `yyyyMMdd'T'HHmmssZ`                                                                    |
|        `date_time_no_millis` |                                                                 `yyyy-MM-dd'T'HH:mm:ssZZ`                                                                  |

-   **innerProps** `Object` [optional]
    specifies additional props for the internal components. Accepts an object with the specified keys. Read more about the usage [here](/advanced/innerprops.html)

<br />

|    **Key** |                                             **Explanation**                                              |
| ---------: | :------------------------------------------------------------------------------------------------------: |
|     `item` |    The wrapping [Item](http://docs.nativebase.io/Components.html#Form) component from **native-base**    |
|     `icon` |    [Icon](http://docs.nativebase.io/Components.html#icon-def-headref) component from **native-base**     |
|   `button` |  [Button](http://docs.nativebase.io/Components.html#button-def-headref) component from **native-base**   |
|   `header` |  [Header](http://docs.nativebase.io/Components.html#header-def-headref) component from **native-base**   |
|    `title` |            [Title](http://docs.nativebase.io/Components.html) component from **native-base**             |
| `calendar` |   [Calendar](https://github.com/wix/react-native-calendars) component from **react-native-calendars**    |
|     `text` |      [Text](http://facebook.github.io/react-native/docs/text.html) component from **react-native**       |
|    `modal` | [Modal](https://facebook.github.io/react-native/docs/modal.html#docsNav) component from **react-native** |

## Demo

<br />

<div data-snack-id="@dhruvdutt/datepicker-example" data-snack-platform="ios" data-snack-preview="true" data-snack-theme="light" style="overflow:hidden;background:#fafafa;border:1px solid rgba(0,0,0,.16);border-radius:4px;height:505px;width:100%"></div>

<a href="https://snack.expo.io/@dhruvdutt/datepicker-example" target="_blank">View on Snack</a>

## Styles

`DatePicker` component supports `style` prop. Read more about it [here](/advanced/style.html).

It also supports an `innerStyle` prop with the following keys:

-   `label`
-   `left`
-   `button`
-   `icon`
-   `right`
-   `body`
-   `title`
-   `calendar`

Read more about it [here](/advanced/style.html#innerstyle)

## Extending

`DatePicker` component can be extended to

1. customize the look and feel with `style`,
2. update the underlying DB query with `customQuery`,
3. connect with external interfaces using `beforeValueChange`, `onValueChange` and `onQueryChange`

```js
<DatePicker
  ...
  style={{ paddingBottom: 10 }}
  customQuery={
    function(value, props) {
      return {
        match: {
          data_field: "this is a test"
        }
      }
    }
  }
  beforeValueChange={
    function(value) {
      // called before the value is set
      // returns a promise
      return new Promise((resolve, reject) => {
        // update state or component props
        resolve()
        // or reject()
      })
    }
  }
  onValueChange={
    function(value) {
      console.log("current value: ", value)
      // set the state
      // use the value with other js code
    }
  }
  onQueryChange={
    function(prevQuery, nextQuery) {
      // use the query with other js code
      console.log('prevQuery', prevQuery);
      console.log('nextQuery', nextQuery);
    }
  }
/>
```

-   **style** `Object`
    CSS styles to be applied to the **DatePicker** component.
-   **customQuery** `Function`
    takes **value** and **props** as parameters and **returns** the data query to be applied to the component, as defined in Elasticsearch Query DSL.
    `Note:` customQuery is called on value changes in the **DatePicker** component as long as the component is a part of `react` dependency of at least one other component.
-   **beforeValueChange** `Function`
    is a callback function which accepts component's future **value** as a parameter and **returns** a promise. It is called everytime before a component's value changes. The promise, if and when resolved, triggers the execution of the component's query and if rejected, kills the query execution. This method can act as a gatekeeper for query execution, since it only executes the query after the provided promise has been resolved.
-   **onValueChange** `Function`
    is a callback function which accepts component's current **value** as a parameter. It is called everytime the component's value changes. This prop is handy in cases where you want to generate a side-effect on value selection. For example: You want to show a pop-up modal with the valid discount coupon code when a user searches for something in the DatePicker.
-   **onQueryChange** `Function`
    is a callback function which accepts component's **prevQuery** and **nextQuery** as parameters. It is called everytime the component's query changes. This prop is handy in cases where you want to generate a side-effect whenever the component's query would change.
