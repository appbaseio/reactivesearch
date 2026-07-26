import React from 'react';
import { ReactiveBase, SearchBox } from '@appbaseio/reactivesearch';

function App() {
	return (
		<ReactiveBase
			url="https://reactivesearch-api-9-4-0.onrender.com"
			app="good-books-ds"
			credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
		>
			<SearchBox
				componentId="searchbox"
				dataField={[
					{
						field: 'authors',
						weight: 3,
					},
					{
						field: 'authors.autosuggest',
						weight: 1,
					},
					{
						field: 'original_title',
						weight: 5,
					},
					{
						field: 'original_title.autosuggest',
						weight: 1,
					},
				]}
				placeholder="Search for books or authors"
			/>
		</ReactiveBase>
	);
}

export default App;
