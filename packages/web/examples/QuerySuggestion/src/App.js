import React from 'react';
import { SearchBox, ReactiveList, ResultCard } from '@appbaseio/reactivesearch';

import { magnifyingGlassIcon, trendingIcon } from './icons';

function uniq(a) {
	return a ? a.filter((item, pos) => a.indexOf(item) === pos) : [];
}

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
			size={5}
			dataField={['original_title', 'overview']}
			enablePopularSuggestions
			popularSuggestionsConfig={{ index: 'movies-store-app' }}
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
					res => res._suggestion_type === 'index',
				);
				const categoryField = 'genres_data';
				const categories = indexResults && indexResults.map(doc => doc._source[categoryField].split(',')).flat();
				const uniqueCategories = uniq(categories);
				uniqueCategories.length = uniqueCategories.length > 5 ? 5 : uniqueCategories.length;

				return isOpen && Boolean(value.length) ? (
					<div className="result suggestions">
						<div className="resultSuggestion list">
							<div className="listHead">Suggestions</div>
							{indexResults.map((item, index) => (
								<div
									key={item.value}
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
						<div className="resultPopular list divideLeft">
							{/* eslint-disable-next-line react/no-unescaped-entities */}
							<div className="listHead clipText">Popular in "{value}"</div>
							<div>
								{popularResults.map((item, index) => (
									<div
										key={item.value}
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
										<span className="listIcon">{trendingIcon}</span>
										<span className="clipText">{item.value}</span>
									</div>
								))}
							</div>
						</div>
						<div className="resultCategory list">
							<div className="listHead">Genres</div>
							{uniqueCategories.map((item, index) => (
								<div
									key={item.value}
									{...getItemProps({
										item,
										style: {
											backgroundColor:
								  highlightedIndex === index + indexResults.length + popularResults.length
								  	? 'lightgray'
								  	: 'white',
											fontWeight:
								  selectedItem === item ? 'bold' : 'normal',
							  },
									})}
									className="listItem"
								>
									<span className="listIcon">{magnifyingGlassIcon}</span>
									<span className="clipText">{item}</span>
								</div>
							))}
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
