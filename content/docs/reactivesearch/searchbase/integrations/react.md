---
title: 'Integrations'
meta_title: 'Integration with React JS'
meta_description: 'searchbase is a lightweight and platform agnostic library that provides scaffolding to create search experiences powered by Elasticsearch.'
keywords:
    - integrations
    - searchbase
    - elasticsearch
    - search library
    - react
sidebar: 'docs'
nestedSidebar: 'searchbase-reactivesearch'
---

[searchbase](https://github.com/appbaseio/searchbox/tree/master/packages/searchbase) is a lightweight and platform agnostic library that provides scaffolding to create search experiences powered by Elasticsearch.

## Initialization

You can initialize `SearchBase` in the `constructor` or `componentDidMount`

```js
constructor(props) {
    super(props);
    const index = INDEX;
    const url = URL;
    const credentials = CRED;

    this.searchBase = new SearchBase({
      index,
      url,
      credentials
    });

    // Register search component
    const searchComponent = this.searchBase.register('search-component', {
      // pass this prop as true to enable predictive suggestions
      enablePredictiveSuggestions: true,
      dataField: [
        'name',
        'description',
        'name.raw',
        'fullname',
        'owner',
        'topics'
      ],
    });

    // Pre-load results
    this.searchComponent.triggerDefaultQuery();

    // Subscribe to results update
    this.searchComponent.subscribeToStateChanges((change) => {
      this.setState({
        results: change.results.next,
      })
    }, ['results']);
}
```

## Change Events

```js
handleSelect = value => {
	// Fetch results on selection
	this.searchComponent.setValue(value, {
		triggerDefaultQuery: true,
	});
};

handleChange = e => {
	// Just update value on change
	this.searchComponent.setValue(e.target.value, {
		triggerDefaultQuery: false,
	});
};
```

## Renderers

### Input Render

```js
<input type="text" value={this.searchComponent.value} onChange={this.handleChange} />
```

### Suggestions Render

```js
<section style={{ margin: 20 }}>
	<b>Suggestions</b>
	{this.searchComponent.requestPending && <div>Loading suggestions...</div>}
	{this.searchComponent.results.data.map(i => {
		return (
			<div onClick={() => this.handleSelect(i.value)} key={i.label}>
				{i.label}
			</div>
		);
	})}
</section>
```

### Results Render

```js
<section style={{ margin: 20 }}>
	<b>Results</b>
	{this.searchBase.results.data.map(i => {
		return <div key={i._id}>{i.name}</div>;
	})}
</section>
```

## Demo

<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/searchbase/tree/master/packages/searchbase/examples/with-react" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
