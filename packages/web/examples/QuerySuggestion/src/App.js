import { SearchBox, ReactiveList, ResultCard } from '@appbaseio/reactivesearch';

import { magnifyingGlassIcon, trendingIcon } from './icons';

function getCategoryResults(data) {
	const results = {};
	// eslint-disable-next-line no-plusplus
	for (let i = 0; i < data.length; i++) {
		const result = data[i];
		const category = result._category.split(',');
		if (Array.isArray(category)) {
			// eslint-disable-next-line no-plusplus
			for (let j = 0; j < category.length; j++) {
				if (!results[category[j]]) {
					results[category[j]] = Object.assign({}, result, {
						_category: category[j],
						value: category[j],
					});
				}
			}
		}
	}
	return Object.keys(results).map((k) => results[k]);
}

const App = () => (
	<div className="page">
		<h2>
			React Searchbox with query suggestions{' '}
			<span style={{ fontSize: '1rem' }}>
				<a
					href="https://docs.appbase.io/docs/reactivesearch/v3/search/searchbox/"
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
				error,
				data,
				value,
				downshiftProps: { isOpen, getItemProps, highlightedIndex, selectedItem },
			}) => {
				if (error) {
					return <div>Something went wrong! Error details {JSON.stringify(error)}</div>;
				}
				const popularResults = data.filter((res) => res._suggestion_type === 'popular');
				const indexResults = data.filter(
					(res) => res._suggestion_type === 'index' && !res._category,
				);
				const categoryResults = getCategoryResults(data.filter((res) => res._category));

				return isOpen &&
					(indexResults.length || categoryResults.length || popularResults.length) ? (
					<div className="result suggestions">
						<div className="flex column">
							{indexResults.length ? (
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
							) : null}
							{categoryResults.length ? (
								<div className="resultCategory list">
									<div className="listHead">Genres</div>
									{categoryResults.map((item, index) => (
										<div
											key={item._category}
											{...getItemProps({
												item,
												style: {
													backgroundColor:
														highlightedIndex ===
														index + indexResults.length
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
							) : null}
						</div>
						{(indexResults.length || categoryResults.length) &&
						popularResults.length ? (
							<div className="divider" />
						) : null}
						{popularResults.length ? (
							<div className="resultPopular list">
								<div className="listHead flex align-center">
									{/* eslint-disable-next-line react/no-unescaped-entities */}
									<span>Popular</span>
									{value ? (
										<span className="clipText pad-l-1">in "{value}"</span>
									) : null}
								</div>
								<div>
									{popularResults.map((item, index) => (
										<div
											key={item._id}
											{...getItemProps({
												item,
												style: {
													backgroundColor:
														highlightedIndex ===
														index +
															indexResults.length +
															categoryResults.length
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
						) : null}
					</div>
				) : null;
			}}
		/>
		<ReactiveList
			componentId="result"
			size={5}
			dataField="original_title"
			react={{ and: 'search' }}
			pagination
			render={({ data }) => (
				<ReactiveList.ResultCardsWrapper>
					{data.map((item) => (
						<ResultCard id={item._id} key={item._id}>
							<ResultCard.Image
								src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
							/>
							<ResultCard.Title>
								<div className="book-title">{item.original_title}</div>
							</ResultCard.Title>

							<ResultCard.Description>
								<span className="language">{item.original_language}</span>
								<span>-</span> <span>{item.release_year}</span>
							</ResultCard.Description>
						</ResultCard>
					))}
				</ReactiveList.ResultCardsWrapper>
			)}
		/>
	</div>
);

export default App;
