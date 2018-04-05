import React from 'react';
import { hydrate } from 'react-dom';

import App from '../common/App';
import BookCard from '../common/BookCard';

import './index.css';

// Grab the state from a global variable injected into the server-generated HTML
const store = window.__PRELOADED_STATE__;

// settings for the ReactiveBase component
const settings = {
	app: 'good-books-ds',
	credentials: 'nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d',
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
	defaultSelected: 'Rating 3 to 4',
};

const reactiveListProps = {
	componentId: 'SearchResult',
	dataField: 'original_title.raw',
	from: 0,
	size: 10,
	onData: data => (<BookCard key={data._id} data={data} />),
	react: {
		and: ['BookSensor'],
	},
};

hydrate(<App
	store={store}
	settings={settings}
	singleRangeProps={singleRangeProps}
	reactiveListProps={reactiveListProps}
/>, document.getElementById('root'));
