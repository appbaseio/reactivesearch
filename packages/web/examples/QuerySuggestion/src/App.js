import React from 'react';
import { SearchBox, ReactiveList, ResultCard } from '@appbaseio/reactivesearch';

import { magnifyingGlassIcon, trendingIcon } from './icons';

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
			size={10}
			aggregationSize={5}
			categoryField="genres_data.keyword"
			dataField={['original_title', 'overview']}
			enablePopularSuggestions
			popularSuggestionsConfig={{ index: 'movies-store-app', size: 5 }}
			render={({
				loading,
				error,
				data,
				value,
				downshiftProps: {
					isOpen,
					getItemProps,
					highlightedIndex,
					selectedItem,
				},
			}) => {
				if (loading) {
					return <div>Fetching Suggestions.</div>;
				}
				if (error) {
					return <div>Something went wrong! Error details {JSON.stringify(error)}</div>;
				}
				const popularResults = data.filter(
					res => res._suggestion_type === 'popular',
				);
				const indexResults = data.filter(
					res => res._suggestion_type === 'index' && !res._category,
				);
				const categoryResults = data
					.filter(res => res._category)
					.map(res => (Object.assign({}, res, { value: res._category })));

				return isOpen && Boolean(value.length) ? (
					<div className="result suggestions">
						<div className="resultSuggestion list">
							<div className="listHead">Suggestions</div>
							{indexResults.map((item, index) => (
								<div
									/* eslint-disable-next-line react/no-array-index-key */
									key={item._id + index}
									{...getItemProps({
										item,
										style: {
											backgroundColor:
								  highlightedIndex === index
								  	? 'lightgray'
								  	: 'white',
											fontWeight:
								  selectedItem === item ? 'bold' : 'normal',
							  },
									})}
									className="listItem"
								>
									<span className="listIcon">{magnifyingGlassIcon}</span>
									<span className="clipText">{item.value}</span>
								</div>
							))}
						</div>
						<div className="resultCategory list">
							<div className="listHead">Genres</div>
							{categoryResults.length ? categoryResults.map((item, index) => (
								<div
									key={item._category}
									{...getItemProps({
										item,
										style: {
											backgroundColor:
								  highlightedIndex === index + indexResults.length
								  	? 'lightgray'
								  	: 'white',
											fontWeight:
								  selectedItem === item ? 'bold' : 'normal',
							  },
									})}
									className="listItem"
								>
									<span className="listIcon">{magnifyingGlassIcon}</span>
									<span className="clipText">{item.value}</span>
								</div>
							)) : 'No Results'}
						</div>
						<div className="resultPopular list divideLeft">
							{/* eslint-disable-next-line react/no-unescaped-entities */}
							<div className="listHead">Popular in <span className="clipText popularValue">"{value}"</span></div>
							<div>
								{popularResults.map((item, index) => (
									<div
										key={item._id}
										{...getItemProps({
											item,
											style: {
												backgroundColor:
								  highlightedIndex === index + indexResults.length + categoryResults.length
								  	? 'lightgray'
								  	: 'white',
												fontWeight:
								  selectedItem === item ? 'bold' : 'normal',
							  },
										})}
										className="listItem"
									>
										<span className="listIcon">{trendingIcon}</span>
										<span className="clipText">{item.value}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				) : null;
			}}
		/>
		<ReactiveList
			componentId="result"
			size={5}
			dataField={['original_title', 'overview']}
			react={{ and: 'search' }}
			pagination
			render={({ data }) => (
				<ReactiveList.ResultCardsWrapper>
					{data.map(item => (
						<ResultCard id={item._id} key={item._id}>
							<ResultCard.Image src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} />
							<ResultCard.Title>
								<div
									className="book-title"
								>{item.original_title}
								</div>
							</ResultCard.Title>

							<ResultCard.Description>
								<span className="language">{item.original_language}</span> <span>-</span> <span>{item.release_year}</span><span>-</span> <span className="genres clipText">{item.genres_data}</span>
							</ResultCard.Description>
						</ResultCard>
					))}
				</ReactiveList.ResultCardsWrapper>
			)}
		/>
	</div>
);

export default App;
