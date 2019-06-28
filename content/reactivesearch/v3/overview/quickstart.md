---
title: 'Quickstart'
meta_title: 'ReactiveSearch Quickstart'
meta_description: 'React UI Components for Elasticsearch.'
keywords:
    - reactivesearch
    - quickstart
    - appbase
    - elasticsearch
sidebar: 'web-reactivesearch'
---

### Step 0: Create Boilerplate with CRA

In this section, we will create a search UI based on a _cars dataset_ with ReactiveSearch components.

![Image](https://i.imgur.com/Zgp5lGk.png)

**Caption:** Final image of how the app will look.

We can either add ReactiveSearch to an existing app or create a boilerplate app with [Create React App (CRA)](https://github.com/facebookincubator/create-react-app). For this quickstart guide, we will use the CRA.

```bash
create-react-app my-awesome-search && cd my-awesome-search
```

### Step 1: Install ReactiveSearch

We will fetch and install [`reactivesearch`](https://www.npmjs.com/package/@appbaseio/reactivesearch) module using yarn or npm.

```bash
yarn add @appbaseio/reactivesearch
```

or

```bash
npm install @appbaseio/reactivesearch
```

---

### Step 2: Adding the first component

Lets add our first ReactiveSearch component: [ReactiveBase](/getting-started/reactivebase.html), it is a backend connector where we can configure the Elasticsearch index / authorization setup.

We will demonstrate creating an index using [appbase.io](https://appbase.io) service, although you can use any Elasticsearch backend within ReactiveBase.

![create an appbase.io app](https://i.imgur.com/r6hWKAG.gif)

**Caption:** For the example that we will build, the app is called **carstore-dataset** and the associated read-only credentials are **4HWI27QmA:58c731f7-79ab-4f55-a590-7e15c7e36721**. You can browse and clone the dataset into your own app from [here](https://opensource.appbase.io/dejavu/#?input_state=XQAAAAJYAQAAAAAAAAA9iIqnY-B2BnTZGEQz6wkFsYr2xMsEqrMu2JBa2BBr9yr6m2tZg0AKj_0NOibrVB6M7O_LS2QjcpmSfZifNLRfB4QBjEtLY8uyxmsd2HpN5OMv6iUHPOAhzAkMBPOo2377ucAJK8b--Zi9fjM3CEZCCA6ah8l4f_q_roWoqv10g9DEzr8TzbUUD8T4MAZ-Fxi9QWnQ1IPnL5bhGmdG9-HoVDte_P9L2ZY7VlIkl6lHRJ2b1dD1QTbMxXX2YX0ISnhdjdxLCbco_B3n9ajCWV8_konrjndbtwL-IoGabFkOHcVzJ6P9TVRPrvUrbnrV5TIV20jowLRniov_-JSjuQ).

We will update our `src/App.js` file to add ReactiveBase component.

```jsx
import React, { Component } from 'react';
import { ReactiveBase } from '@appbaseio/reactivesearch';

class App extends Component {
	render() {
		return (
			<ReactiveBase
				app="carstore-dataset"
				credentials="4HWI27QmA:58c731f7-79ab-4f55-a590-7e15c7e36721"
			>
				// other components will go here.
				<div>Hello ReactiveSearch!</div>
			</ReactiveBase>
		);
	}
}
```

This is how the app should look after running the `yarn start` command.

![](https://i.imgur.com/M7AAhTh.png)

---

### Step 3: Adding Filters and Result Components

For this app, we will be using [CategorySearch](/search-components/categorysearch.html) and [SingleRange](/basic-components/singlerange.html) components for filtering the dataset. And [ResultCard](/search-components/resultcard.html) component for showing the search results.

Lets add them within the ReactiveBase component. But before we do that, we will look at the important props for each.

```jsx
<CategorySearch
	componentId="searchbox"
	dataField="model"
	categoryField="brand.keyword"
	placeholder="Search for cars"
/>
```

The [**CategorySearch**](/search-components/categorysearch.html) component we describe above creates a searchbox UI component that queries on the `name` field in the dataset and shows categorizations using the `brand.raw` field in the dataset. Here is how it will look visually.

`Note:` If you cloned your own dataset, the field will be called `brand.keyword` instead of `brand.raw`.

![](https://i.imgur.com/lPLu1qj.png)

Next, we will look at the [**SingleRange**](/basic-components/singlerange.html) component for creating a ratings based filter.

```jsx
<SingleRange
	componentId="ratingsfilter"
	dataField="rating"
	title="Filter by ratings"
	data={[
		{ start: 4, end: 5, label: '4 stars and up' },
		{ start: 3, end: 5, label: '3 stars and up' },
	]}
	defaultValue="4 stars and up"
/>
```

![](https://i.imgur.com/vkqAHac.png)

**SingleRange** filters the DB by `rating` field based on the UI choice the user makes. We also set the _4 stars and up_ option to be default selected when the UI loads up first.

Finally, we need a component to show the matching results. [**ResultCard**](/search-components/resultcard.html) does exactly this.

```jsx
<ReactiveList
	componentId="results"
	dataField="name"
	size={6}
	pagination={true}
	react={{
		and: ['searchbox', 'ratingsfilter'],
	}}
	render={({ data }) => (
		<ReactiveList.ResultCardWrapper>
			{data.map(item => (
				<ResultCard key={item._id}>
					<ResultCard.Image
						src="http://www.asfera.info/files/images/
											1_aprela/4/deloreyn.jpg"
					/>
					<ResultCard.Title
						dangerouslySetInnerHTML={{
							__html: item.name,
						}}
					/>
					<ResultCard.Description>
						{item.brand + ' ' + '*'.repeat(item.rating)}
					</ResultCard.Description>
				</ResultCard>
			))}
		</ReactiveList.ResultCardWrapper>
	)}
/>
```

The `react` prop here specifies that it should construct a query based on the current selected values of searchbox and ratingsfilter components. Every time the user changes the input value, a new query is fired -- you don't need to write a manual query for any of the UI components here, although you can override it via `customQuery` prop.

![](https://i.imgur.com/J1MXsWK.png)

This is how the ResultCard component's UI would look like.

Now, we will put all three components together to create the UI view.

```jsx
import React, { Component } from 'react';
import {
	ReactiveBase,
	CategorySearch,
	SingleRange,
	ResultCard,
	ReactiveList,
} from '@appbaseio/reactivesearch';

class App extends Component {
	render() {
		return (
			<ReactiveBase
				app="carstore-dataset"
				credentials="4HWI27QmA:58c731f7-79ab-4f55-a590-7e15c7e36721"
			>
				<CategorySearch
					componentId="searchbox"
					dataField="model"
					categoryField="brand.keyword"
					placeholder="Search for cars"
				/>
				<SingleRange
					componentId="ratingsfilter"
					title="Filter by ratings"
					dataField="rating"
					data={[
						{ start: '4', end: '5', label: '4 stars and up' },
						{ start: '3', end: '5', label: '3 stars and up' },
						{ start: '2', end: '5', label: '2 stars and up' },
						{ start: '1', end: '5', label: 'see all ratings' },
					]}
					defaultValue="4 stars and up"
				/>
				<ReactiveList
					componentId="result"
					title="Results"
					dataField="model"
					from={0}
					size={5}
					pagination={true}
					react={{
						and: ['searchbox', 'ratingsfilter'],
					}}
					render={({ data }) => (
						<ReactiveList.ResultCardWrapper>
							{data.map(item => (
								<ResultCard key={item._id}>
									<ResultCard.Image src="https://bit.do/demoimg" />
									<ResultCard.Title
										dangerouslySetInnerHTML={{
											__html: item.model,
										}}
									/>
									<ResultCard.Description>
										{item.brand + ' ' + '*'.repeat(item.rating)}
									</ResultCard.Description>
								</ResultCard>
							))}
						</ReactiveList.ResultCardWrapper>
					)}
				/>
			</ReactiveBase>
		);
	}
}

export default App;
```

If you have followed along so far, you should a screen similar to:

![Image](https://i.imgur.com/C1W8OGQ.png)

We have built our entire search UI in just 50 lines!

The only thing missing at this point is the layout, ReactiveSearch doesn't use a layout system internally. For example, if you are using a grid from Bootstrap or Materialize, you can use that to style the layout. Or if you prefer to use Flex, you can use that.

---

### Step 4: Adding a Layout Grid with Flex

For this quickstart, we will use a Flex based layout. If you are new to Flex, I recommend a quick read of [this article](https://css-tricks.com/snippets/css/a-guide-to-flexbox/).

With ~16 more lines of inline styles, here is our final app layout.

```jsx
import React, { Component } from 'react';
import { ReactiveBase, CategorySearch, SingleRange, ReactiveList } from '@appbaseio/reactivesearch';

class App extends Component {
	render() {
		return (
			<ReactiveBase
				app="carstore-dataset"
				credentials="4HWI27QmA:58c731f7-79ab-4f55-a590-7e15c7e36721"
			>
				<div style={{ display: 'flex', flexDirection: 'row' }}>
					<div style={{ display: 'flex', flexDirection: 'column', width: '40%' }}>
						<CategorySearch
							componentId="searchbox"
							dataField="model"
							categoryField="brand.keyword"
							placeholder="Search for cars"
							style={{
								padding: '5px',
								marginTop: '10px',
							}}
						/>
						<SingleRange
							componentId="ratingsfilter"
							title="Filter by ratings"
							dataField="rating"
							data={[
								{ start: '4', end: '5', label: '4 stars and up' },
								{ start: '3', end: '5', label: '3 stars and up' },
								{ start: '2', end: '5', label: '2 stars and up' },
								{ start: '1', end: '5', label: 'see all ratings' },
							]}
							defaultValue="4 stars and up"
							style={{
								padding: '5px',
								marginTop: '10px',
							}}
						/>
					</div>
					<ReactiveList
						componentId="result"
						title="Results"
						dataField="model"
						from={0}
						size={6}
						pagination={true}
						react={{
							and: ['searchbox', 'ratingsfilter'],
						}}
						style={{
							width: '60%',
							textAlign: 'center',
						}}
						render={({ data }) => (
							<ReactiveList.ResultCardWrapper>
								{data.map(item => (
									<ResultCard key={item._id}>
										<ResultCard.Image src="https://www.enterprise.com/content/dam/global-vehicle-images/cars/FORD_FOCU_2012-1.png" />
										<ResultCard.Title
											dangerouslySetInnerHTML={{
												__html: item.model,
											}}
										/>
										<ResultCard.Description>
											{item.brand + ' ' + '*'.repeat(item.rating)}
										</ResultCard.Description>
									</ResultCard>
								))}
							</ReactiveList.ResultCardWrapper>
						)}
					/>
				</div>
			</ReactiveBase>
		);
	}
}

export default App;
```

If you have followed along, this is how our app should look now.

![](https://i.imgur.com/oZglt8L.png)

For convenience, you can checkout the final code from the ReactiveSearch starter github repo - https://github.com/appbaseio-apps/reactivesearch-starter-app.

You can run it with the following commands:

```bash
git clone https://github.com/appbaseio-apps/reactivesearch-starter-app
cd reactivesearch-starter-app
yarn && yarn start
# open http://localhost:3000 and you should see the app.
# The magic sauce is inside **src/App.js** file.
```

---

### Step 5: ReactiveSearch as UMD

It is also possible to run ReactiveSearch without relying on a Node.JS environment tooling for the build setup. Here, I am using `v2.0.0`, this can be replaced with the version you are using.

```html
<script src="https://cdn.rawgit.com/appbaseio/reactivesearch/v2.0.0/packages/web/umd/reactivesearch.js"></script>
```

A GZip version (131KB in size) is also available at https://cdn.rawgit.com/appbaseio/reactivesearch/v2.0.0/packages/web/umd/reactivesearch.js.gzip.

The ReactiveSearch starter project has also been built with the UMD version of the lib, and is available at https://github.com/appbaseio-apps/reactivesearch-starter-app/tree/umd.

You can run it with the following commands:

```bash
git clone https://github.com/appbaseio-apps/reactivesearch-starter-app
cd reactivesearch-starter-app
git checkout umd    # where we have the umd version of the starter app
python -m SimpleHTTPServer 1234   # now open http://localhost:1234
```
