import React from 'react';
import ReactDOM from 'react-dom';

import App from '../common/App';
import BookCard from '../common/BookCard';

import './index.css';

// Grab the state from a global variable injected into the server-generated HTML
const store = window.__PRELOADED_STATE__;

// settings for the ReactiveBase component
const settings = {
	app: 'good-books-ds',
	url: 'https://xe6N9nDRV:51ea7a8a-6354-4b5f-83e1-12dce3b7ec47@arc-cluster-appbase-demo-ps1pgt.searchbase.io',
	enableAppbase: true,
};

// props for ReactiveSearch components
// the same props we used server side to generate initial query
const singleRangeProps = {
	componentId: 'BookSensor',
	dataField: 'average_rating',
	data: [
		{ start: 0, end: 3, label: 'Rating < 3' },
		{ start: 3, end: 4, label: 'Rating 3 to 4' },
		{ start: 4, end: 5, label: 'Rating > 4' },
	],
	URLParams: true,
};

const reactiveListProps = {
	componentId: 'SearchResult',
	dataField: 'original_title',
	from: 0,
	size: 10,
	renderItem: data => <BookCard key={data._id} data={data} />,
	react: {
		and: ['BookSensor'],
	},
};

ReactDOM.hydrate(
	<App
		store={store}
		settings={settings}
		singleRangeProps={singleRangeProps}
		reactiveListProps={reactiveListProps}
	/>,
	document.getElementById('root'),
);
