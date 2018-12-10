import React from 'react';
import { MultiList } from '@appbaseio/reactivesearch';

const SearchFilters = () => (
	<MultiList
		componentId="categories"
		dataField="categories.keyword"
		title="Categories"
		size={15}
		sortBy="count"
		queryFormat="and"
		react={{
			and: 'search',
		}}
		URLParams
		showSearch={false}
		filterLabel="Categories"
		innerClass={{
			list: 'list',
		}}
	/>
);

export default SearchFilters;
