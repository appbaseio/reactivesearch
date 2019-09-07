---
title: 'Library Integrations'
meta_title: 'Integrations with React and Vanilla JS'
meta_description: 'SearchBase is a lightweight & platform agnostic search library with some common utilities.'
keywords:
    - integrations
    - searchbase
    - elasticsearch
    - search library
sidebar: 'api-reference'
---

[searchbase](https://github.com/appbaseio/searchbase) - A lightweight & platform agnostic search library with some common utilities.

##React JS
###Initialization
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
```

###Change Events

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

###Renderers
####Input Render

```js
<input type="text" value={this.searchBase.value} onChange={this.handleChange} />
```

####Suggestions Render

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

####Results Render

```js
<section style={{ margin: 20 }}>
	<b>Results</b>
	{this.searchBase.requestPending && <div>Loading results...</div>}
	{this.searchBase.results.data.map(i => {
		return <div key={i._id}>{i.name}</div>;
	})}
</section>
```

##Vanilla JS
###Initialization

```js
const searchBase = new Searchbase({
	index,
	url,
	dataField: ['name', 'description', 'name.raw', 'fullname', 'owner', 'topics'],
	credentials,
});
```

###HTML

```html
document.body.innerHTML = `
<div id="autocomplete" class="autocomplete">
	<input class="autocomplete-input" id="input" />
	<ul class="autocomplete-result-list"></ul>
</div>
<div id="selected"></div>
`;
```

###Subscribe to state changes

```js
searchBase.subscribeToStateChanges(() => {
	// If we press enter key than autocomplete box is closed.
	// Handling a edge case.

	if (input.value) {
		input.blur();
		input.focus();
	}
});
```

###Event listener

```js
const input = document.getElementById('input');
input.addEventListener('change', searchBase.onChange);
```

###Using with `autocomplete-js` library

```js
new Autocomplete('#autocomplete', {
	search: () => {
		return searchBase.results.data;
	},
	getResultValue: result => result.name,
	renderResult: (result, props) => `
    <li ${props}>
      <div class="suggestion">
        <div>
          <img src=${result.avatar} alt=${result.name} />
        </div>
        <div>
        <h4>${result.name}</h4>
        <p>${result.description}</p>
        </div>
      </div>
    </li>
  `,
	onSubmit: result => {
		selectedSuggestion.innerHTML = `
    <h4>Suggestion Selected</h4>
    <div class="suggestion selected">
        <div>
          <img src=${result.avatar} alt=${result.name} />
        </div>
        <div>
          <h4>${result.name}</h4>
          <p>${result.stars} Stars</p>
        </div>
      </div>`;
	},
});
```
