import React from 'react';
import { SearchBox } from '@appbaseio/reactivesearch';

import './styles.css';

const App = () => (
	<div className="page">
		<h2>
			React Searchbox with query suggestions{' '}
			<span style={{ fontSize: '1rem' }}>
				<a
					href="https://docs.appbase.io/docs/reactivesearch/react-searchbox/apireference/"
					target="_blank"
					rel="noopener noreferrer"
				>
					API reference
				</a>
			</span>
		</h2>
		<SearchBox
			componentId="search"
			aggregationField="genres_data.keyword"
			size={5}
			aggregationSize={5}
			enablePopularSuggestions
			popularSuggestionsConfig={{ index: 'movies-store-app' }}
			render={({
				data, value, loading, rawData,
			}) => {
				const key = 'genres_data.keyword';
				if (!value || loading) return null;
				const popularResults = data.filter(
					res => res._suggestion_type === 'popular',
				);
				const indexResults = data.filter(
					res => res._suggestion_type === 'index',
				);
				if (!popularResults.length && !indexResults.length) return null;
				return (
					<div className="result">
						<div className="resultSuggestion list">
							<div className="listHead">Suggestions</div>
							<div className="listBody">
								{indexResults.map(res => (
									<div className="suggestion">
										<div>{res.original_title}</div>
									</div>
								))}
							</div>
						</div>
						<div className="resultCategory list">
							<div className="listHead">Genres</div>
							<div className="listBody">
								{rawData.aggregations
                    && rawData.aggregations[key].buckets.map(res => (
	                      <div>{res.key[key]}</div>
                    ))}
							</div>
						</div>
						<div className="resultPopular list">
							{/* eslint-disable-next-line react/no-unescaped-entities */}
							<div className="listHead">Popular in "{value}"</div>
							<div className="listBody">
								{popularResults.length
									? popularResults.map(res => (
										<div className="suggestion">
											<div>{res.value}</div>
										</div>
									))
									: 'No Results'}
							</div>
						</div>
					</div>
				);
			}}
		/>
	</div>
);

export default App;
