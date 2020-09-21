---
title: 'Integrations'
meta_title: 'Integration with Vanilla JS'
meta_description: 'searchbase is a lightweight and platform agnostic library that provides scaffolding to create search experiences powered by Elasticsearch.'
keywords:
    - integrations
    - searchbase
    - elasticsearch
    - search library
    - vanilla
sidebar: 'docs'
nestedSidebar: 'searchbase-reactivesearch'
---

[searchbase](https://github.com/appbaseio/searchbox/tree/master/packages/searchbase) is a lightweight and platform agnostic library that provides scaffolding to create search experiences powered by Elasticsearch.

## Initialization

```js
const searchBase = new SearchBase({
	index,
	url,
	credentials,
});

const searchComponent = searchBase.register('search-component', {
  dataField: ['name', 'description', 'name.raw', 'fullname', 'owner', 'topics'],
})
```

## HTML

```html
document.body.innerHTML = `
<div id="autocomplete" class="autocomplete">
	<input class="autocomplete-input" id="input" />
	<ul class="autocomplete-result-list"></ul>
</div>
<div id="selected"></div>
`;
```

## Subscribe to state changes

```js
searchComponent.subscribeToStateChanges(() => {
	// If we press enter key than autocomplete box is closed.
	// Handling a edge case.

	if (input.value) {
		input.blur();
		input.focus();
	}
});
```

## Event listener

```js
const input = document.getElementById('input');
input.addEventListener('change', searchComponent.onChange);
```

## Using with `autocomplete-js` library

```js
new Autocomplete('#autocomplete', {
	search: () => {
		return searchComponent.results.data;
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

## Demo
<br />

<iframe src="https://codesandbox.io/embed/github/appbaseio/searchbase/tree/master/packages/searchbase/examples/with-vanilla" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
