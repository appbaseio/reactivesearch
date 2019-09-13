---
title: 'Integrations'
meta_title: 'Integration with React JS'
meta_description: 'SearchBase is a lightweight & platform agnostic search library with some common utilities.'
keywords:
    - integrations
    - searchbase
    - elasticsearch
    - search library
    - react
sidebar: 'docs'
nestedSidebar: 'searchbase-reactivesearch'
---

[searchbase](https://github.com/appbaseio/searchbase) - A lightweight & platform agnostic search library with some common utilities.

##Initialization
You can initialize `SearchBase` in the `constructor` or `componentDidMount`

```js
constructor(props) {
    super(props);
    const index = INDEX;
    const url = URL;
    const credentials = CRED;

    this.searchBase = new Searchbase({
      index,
      url,
      dataField: [
        'name',
        'description',
        'name.raw',
        'fullname',
        'owner',
        'topics'
      ],
      credentials
    });

    // Pre-load results
    this.searchBase.triggerQuery();

    this.searchBase.subscribeToStateChanges(() => {
      this.forceUpdate();
    });
}
```

##Change Events

```js
handleSelect = value => {
	this.searchBase.setValue(value, {
		triggerQuery: true,
	});
};

handleChange = e => {
	this.searchBase.setValue(e.target.value, {
		triggerSuggestionsQuery: true,
	});
};
```

##Renderers
###Input Render

```js
<input type="text" value={this.searchBase.value} onChange={this.handleChange} />
```

###Suggestions Render

```js
<section style={{ margin: 20 }}>
	<b>Suggestions</b>
	{this.searchBase.suggestionsRequestPending && <div>Loading suggestions...</div>}
	{this.searchBase.suggestions.data.map(i => {
		return (
			<div onClick={() => this.handleSelect(i.value)} key={i.label}>
				{i.label}
			</div>
		);
	})}
</section>
```

###Results Render

```js
<section style={{ margin: 20 }}>
	<b>Results</b>
	{this.searchBase.requestPending && <div>Loading results...</div>}
	{this.searchBase.results.data.map(i => {
		return <div key={i._id}>{i.name}</div>;
	})}
</section>
```

##Demo
<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/searchbase/tree/master/packages/searchbase/examples/with-react" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
