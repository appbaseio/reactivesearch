import React from 'react';
import ReactDOM from 'react-dom';

import {
	ReactiveBase,
	DataSearch,
	SearchBox,
	ReactiveList,
	ResultCard,
	SelectedFilters,
} from '@appbaseio/reactivesearch';

import './index.css';

const Main = () => (
	<ReactiveBase
		app="good-books-ds"
		url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
		enableAppbase
		appbaseConfig={{
			recordAnalytics: true,
		}}
	>
		<div className="row">
			<div className="col">
				<DataSearch
					title="DataSearch"
					dataField={['original_title', 'original_title.search']}
					componentId="BookSensor"
					URLParams
					enablePopularSuggestions
					enableRecentSuggestions
					size={5}
					strictSelection
					autosuggest
				/>
				{/* <SearchBox
					title="Searchbox"
					size={5}
					enableRecentSuggestions
					dataField={[
						{
							field: 'name.autosuggest',
							weight: '1',
						},
						{
							field: 'name',
							weight: '3',
						},
					]}
					componentId="searchbox-test"
					URLParams
					enablePopularSuggestions
					categoryField="authors.keyword"
					// strictSelection
					autosuggest
					popularSuggestionsConfig={{ size: 2, showGlobal: true }}
					recentSuggestionsConfig={{ size: 2 }}

				/> */}
			</div>
		</div>
	</ReactiveBase>
);

export default Main;

ReactDOM.render(<Main />, document.getElementById('root'));
