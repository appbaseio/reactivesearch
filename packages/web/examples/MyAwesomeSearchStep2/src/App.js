import React from 'react';
import { ReactiveBase, DataSearch } from '@appbaseio/reactivesearch';

function App() {
	return (
		<ReactiveBase
			url="https://appbase-demo-ansible-abxiydt-arc.searchbase.io"
			app="good-books-ds"
			credentials="04717bb076f7:be54685e-db84-4243-975b-5b32ee241d31"
			enableAppbase
		>
			<DataSearch
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