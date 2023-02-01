/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { MultiList, ReactiveBase, ReactiveList, SearchBox } from '@appbaseio/reactivesearch';
import BookCard from './BookCard';

// settings for the ReactiveBase component
const settings = {
	app: 'good-books-ds',
	url: 'https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io',
	enableAppbase: true,
};

// props for ReactiveSearch components
// the same props we used server side to generate initial query
const searchBoxProps = {
	dataField: ['original_title', 'original_title.search'],
	componentId: 'BookSensor',
	URLParams: true,
};
const multiListProps = {
	componentId: 'MultiList',
	dataField: 'original_series.keyword',
	size: 100,
	URLParams: true,
	react: {
		and: ['BookSensor'],
	},
};
const reactiveListProps = {
	componentId: 'SearchResult',
	dataField: 'original_title',
	from: 0,
	size: 10,
	renderItem: data => <BookCard key={data._id} data={data} />,
	react: {
		and: ['BookSensor', 'MultiList'],
	},
	URLParams: true,
	pagination: true,
};
const App = ({ store, contextCollector }) => (
	<ReactiveBase
		{...settings}
		initialState={store}
		{...(contextCollector ? { contextCollector } : {})}
	>
		<div className="row">
			<div className="col">
				<SearchBox {...searchBoxProps} />
				<MultiList {...multiListProps} />
			</div>

			<div className="col">
				<ReactiveList {...reactiveListProps} />
			</div>
		</div>
	</ReactiveBase>
);

App.propTypes = {
	settings: PropTypes.object,
	store: PropTypes.object,
	contextCollector: PropTypes.func,
};

export default App;
