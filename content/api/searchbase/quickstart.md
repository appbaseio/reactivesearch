---
title: 'Quickstart'
meta_title: 'Quickstart to SearchBase'
meta_description: 'SearchBase is a lightweight & platform agnostic search library with some common utilities.'
keywords:
    - quickstart
    - javascript
    - appbase
    - elasticsearch
    - searchbase
    - search library
sidebar: 'api-reference'
---

[searchbase](https://github.com/appbaseio/searchbase) - A lightweight & platform agnostic search library with some common utilities.

##Installation
Run the below command to install Searchbase in your project.
```js
yarn add @appbaseio/searchbase
```
To use the umd build, add the following script in your `index.html` file.
```js
<script defer src="https://cdn.jsdelivr.net/npm/@appbaseio/searchbase@1.0.0-alpha/dist/@appbaseio/searchbase.umd.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/@appbaseio/searchbase@1.0.0-alpha/dist/@appbaseio/searchbase.umd.min.js.map"></script>
```

##Basic Usage
###Without suggestions
```js
import SearchBase from '@appbaseio/searchbase';

// Instantiate the search base object
const searchbase = new SearchBase({
  index: 'gitxplore-latest-app',
  credentials: 'LsxvulCKp:a500b460-73ff-4882-8d34-9df8064b3b38',
  url: 'https://scalr.api.appbase.io',
  dataField: ['name', 'description', 'name.raw', 'fullname', 'owner', 'topics']
});

const searchElement = document.getElementById('search');

// Bind the searchbase value to input value
searchElement.value = searchbase.value;
// Update the search input value in
searchElement.addEventListener('input', e => {
  searchbase.setValue(e.target.value);
});
// Build DOM when search results update
searchbase.onResults = results => {
  const resultsElement = document.getElementById('results');
  resultsElement.innerHTML = '';
  results.data.forEach(element => {
    var node = document.createElement('LI'); // Create a <li> node
    var resultNode = document.createTextNode(element.name); // Create a text node
    node.appendChild(resultNode); // Append the text to <li>
    resultsElement.appendChild(node);
  });
};
```

Add this in your HTML
```js
<input placeholder="type to search" id="search" />

<div id="results"></div>
```

###With suggestions
```js
import SearchBase from '@appbaseio/searchbase';

// Instantiate the search base object
const searchbase = new SearchBase({
  index: 'gitxplore-latest-app',
  credentials: 'LsxvulCKp:a500b460-73ff-4882-8d34-9df8064b3b38',
  url: 'https://scalr.api.appbase.io',
  dataField: ['name', 'description', 'name.raw', 'fullname', 'owner', 'topics']
});

const searchElement = document.getElementById('search');

// Bind the searchbase value to input value
searchElement.value = searchbase.value;
// Update the search input value in
searchElement.addEventListener('input', e => {
  searchbase.setValue(e.target.value, {
    triggerSuggestionsQuery: true
  });
});

// Build DOM when search suggestions update
searchbase.onSuggestions = suggestions => {
  const suggestionsElement = document.getElementById('suggestions');
  suggestionsElement.innerHTML = '';
  suggestions.data.forEach(element => {
    var node = document.createElement('LI'); // Create a <li> node
    var suggestionNode = document.createElement('button');
    var t = document.createTextNode(element.label); // Create a text node

    suggestionNode.appendChild(t);
    suggestionNode.onclick = function() {
      searchbase.setValue(element.value);
    };

    node.appendChild(suggestionNode); // Append the text to <li>
    suggestionsElement.appendChild(node);
  });
};

// Build DOM when search results update
searchbase.onResults = results => {
  const resultsElement = document.getElementById('results');
  resultsElement.innerHTML = '';
  results.data.forEach((element, index) => {
    var node = document.createElement('LI'); // Create a <li> node
    var resultNode = document.createTextNode(element.name); // Create a text node
    node.appendChild(resultNode); // Append the text to <li>
    resultsElement.appendChild(node);
  });
};
// Update input value when a suggestion is selected
searchbase.onValueChange = value => {
  const searchElement = document.getElementById('search');
  if (searchElement) {
    searchElement.value = value;
  }
};
```

Add this in your HTML
```js
<input placeholder="type to search" id="search" />
<div id="suggestions"></div>
<div id="results"></div>
```


