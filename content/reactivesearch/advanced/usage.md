---
title: 'Components Usage'
meta_title: 'Components Usage'
keywords:
    - reactivesearch
    - usage
    - appbase
    - elasticsearch
sidebar: 'web-reactivesearch'
---

With the release of version 3.x.x of reactivesearch, we have changed the way certain props behaved in the earlier versions. To enable effective control over the components, we now support `defaultValue` and `value` props. These new props enable better controlled and uncontrolled usage for all the reactivesearch components.

## Controlled components

[As reactjs docs put this brilliantly:](https://reactjs.org/docs/glossary.html#controlled-vs-uncontrolled-components)

> An input form element whose value is controlled by React is called a controlled component. When a user enters data into a controlled component a change event handler is triggered and **your code** decides whether the input is valid (by re-rendering with the updated value). If you do not re-render then the form element will remain unchanged.

This essentially puts you in control. You can decide whether to update the current value of the component or not - via `onChange` handler supported by every component.

A typical usage example for controlled component will look like:

```js
import React from 'react';
import { ReactiveBase, SingleList } from '@appbaseio/reactivesearch';

class App extends React.Component {
	state = {
		value: 'Harry Potter',
	};

	onChange = value => {
		this.setState({
			value,
		});
	};

	render() {
		return (
			<ReactiveBase>
				<SingleList dataField="books" value={this.state.value} onChange={this.onChange} />
			</ReactiveBase>
		);
	}
}
```

## Uncontrolled components

We now support `defaultValue` prop to enable uncontrolled behavior on reactivesearch components. [React docs define uncontrolled components as:](https://reactjs.org/docs/glossary.html#controlled-vs-uncontrolled-components)

> An uncontrolled component works like form elements do outside of React. When a user inputs data into a form field (an input box, dropdown, etc) the updated information is reflected without React needing to do anything. However, this also means that you can’t force the field to have a certain value.

This enables you to set the initial value for any component if you need to . The component handles the updates on the current value on its own. Ideally with reactivesearch, this is what you'd want in the most cases. We can re-write the above code snippet using `defaultValue` as:

```js
import React from 'react';
import { ReactiveBase, SingleList } from '@appbaseio/reactivesearch';

class App extends React.Component {
	render() {
		return (
			<ReactiveBase>
				<SingleList dataField="books" defaultValue="Harry Potter" />
			</ReactiveBase>
		);
	}
}
```

> Please note that we have removed support for `defaultSelected` prop from all the reactivesearch components.
