---
title: 'QuickStart'
meta_title: 'QuickStart to React SearchBox'
meta_description: 'react-searchbox is a lightweight library that provides scaffolding to create search experiences powered by Elasticsearch.'
keywords:
    - quickstart
    - react-searchbox
    - search library
    - elasticsearch
sidebar: 'docs'
nestedSidebar: 'react-searchbox-reactivesearch'
---

[react-searchbox](https://github.com/appbaseio/searchbox/tree/master/packages/react-searchbox) provides declarative props to query Elasticsearch, and bind UI components with different types of search queries. As the name suggests, it provides a default UI component for searchbox.

## Installation

To install `react-searchbox`, you can use `npm` or `yarn` to get set as follows:

### Using npm

```js
npm install @appbaseio/react-searchbox
```

### Using yarn

```js
yarn add @appbaseio/react-searchbox
```

## Basic usage

### A simple example

The following example renders an autosuggestion search bar(`search-component`) with one custom component(`result-component`) to render the results. The `result-component` watches the `search-component` for input changes and updates its UI when the user selects a suggestion.

```js
import React from 'react';

import { SearchBox, SearchBase, SearchComponent } from '@appbaseio/react-searchbox';

export default () => (
	<SearchBase
		index="good-books-ds"
		credentials="a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61"
		url="https://arc-cluster-appbase-demo-6pjy6z.searchbase.io"
	>
		<div>
			<SearchBox
				id="search-component"
				dataField={[
					{
						field: 'original_title',
						weight: 1,
					},
					{
						field: 'original_title.search',
						weight: 3,
					},
				]}
				title="Search"
				placeholder="Search for Books"
				defaultSuggestions={[
					{
						label: 'Songwriting',
						value: 'Songwriting',
					},
					{
						label: 'Musicians',
						value: 'Musicians',
					},
				]}
			/>
			<SearchComponent
				id="result-component"
				highlight
				dataField="original_title"
				react={{
					and: ['search-component'],
				}}
			>
				{({ results, loading }) => {
					return (
						<div>
							{loading ? (
								<div>Loading Results ...</div>
							) : (
								<div>
									{!results.data.length ? (
										<div>No results found</div>
									) : (
										<p>
											{results.numberOfResults} results found in{' '}
											{results.time}
											ms
										</p>
									)}
									{results.data.map(item => (
										<div key={item._id}>
											<img
												src={item.image}
												alt="Book Cover"
												className="book-image"
											/>
											<div>
												<div
													dangerouslySetInnerHTML={{
														__html: item.original_title,
													}}
												/>
												<span>
													Pub {item.original_publication_year}
												</span>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					);
				}}
			</SearchComponent>
		</div>
	</SearchBase>
);
```

You can play with this example over [here](https://codesandbox.io/s/happy-thunder-pppzi?file=/src/App.js).

### An example with a facet

```jsx
import React from "react";

import {
  SearchBox,
  SearchBase,
  SearchComponent
} from "@appbaseio/react-searchbox";

export default () => (
  <SearchBase
    index="good-books-ds"
    credentials="a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61"
    url="https://arc-cluster-appbase-demo-6pjy6z.searchbase.io"
  >
    <div>
      <SearchBox
        id="search-component"
        dataField={[
          {
            field: "original_title",
            weight: 1
          },
          {
            field: "original_title.search",
            weight: 3
          }
        ]}
        title="Search"
        placeholder="Search for Books"
        defaultSuggestions={[
          {
            label: "Songwriting",
            value: "Songwriting"
          },
          {
            label: "Musicians",
            value: "Musicians"
          }
        ]}
      />
      <SearchComponent
        id="author-filter"
        type="term"
        dataField="authors.keyword"
        subscribeTo={["aggregationData", "requestStatus", "value"]}
        URLParams
        // To initialize with default value
        value={[]}
        render={({ aggregationData, loading, value, setValue }) => {
          return (
            <div>
              {loading ? (
                <div>Loading Filters ...</div>
              ) : (
                aggregationData.data.map((item) => (
                  <div key={item._key}>
                    <input
                      type="checkbox"
                      checked={value ? value.includes(item._key) : false}
                      value={item._key}
                      onChange={(e) => {
                        const values = value || [];
                        if (values && values.includes(e.target.value)) {
                          values.splice(values.indexOf(e.target.value), 1);
                        } else {
                          values.push(e.target.value);
                        }
                        // Set filter value and trigger custom query
                        setValue(values, {
                          triggerDefaultQuery: false,
                          triggerCustomQuery: true,
                          stateChanges: true
                        });
                      }}
                    />
                    <label htmlFor={item._key}>
                      {item._key} ({item._doc_count})
                    </label>
                  </div>
                ))
              )}
            </div>
          );
        }}
      />
      <SearchComponent
        id="result-component"
        highlight
        dataField="original_title"
        react={{
          and: ["search-component", "author-filter"]
        }}
      >
        {({ results, loading }) => {
          return (
            <div>
              {loading ? (
                <div>Loading Results ...</div>
              ) : (
                <div>
                  {!results.data.length ? (
                    <div>No results found</div>
                  ) : (
                    <p>
                      {results.numberOfResults} results found in {results.time}
                      ms
                    </p>
                  )}
                  {results.data.map((item) => (
                    <div key={item._id}>
                      <img
                        src={item.image}
                        alt="Book Cover"
                        className="book-image"
                      />
                      <div>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item.original_title
                          }}
                        />
                        <span>Pub {item.original_publication_year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }}
      </SearchComponent>
    </div>
  </SearchBase>
);
```

## Demo

The following demo explains the `react-searchbox` integration to build a basic search experience with a facet.

<iframe src="https://codesandbox.io/embed/github/appbaseio/searchbox/tree/master/packages/react-searchbox/examples/demo" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

You can check out the docs for API Reference over [here](/docs/reactivesearch/react-searchbox/apireference/).
