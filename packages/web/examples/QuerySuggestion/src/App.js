import { SearchBox, ReactiveList, ResultCard } from '@appbaseio/reactivesearch';

import { magnifyingGlassIcon } from './icons';

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
			dataField={['original_title', 'original_title.search']}
			render={({
				error,
				data,
				downshiftProps: { isOpen, getItemProps, highlightedIndex, selectedItem },
			}) => {
				if (error) {
					return <div>Something went wrong! Error details {JSON.stringify(error)}</div>;
				}
				const indexResults = data.filter(
					res => res._suggestion_type === 'index' && !res._category,
				);

				return isOpen && indexResults.length ? (
					<div className="result suggestions">
						<div className="flex column">
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
						</div>
					</div>
				) : null;
			}}
		/>
		<ReactiveList
			componentId="result"
			size={5}
			dataField="_score"
			react={{ and: 'search' }}
			pagination
			render={({ data }) => (
				<ReactiveList.ResultCardsWrapper>
					{data.map(item => (
						<ResultCard id={item._id} key={item._id}>
							<ResultCard.Image src={item.image} />
							<ResultCard.Title>
								<div className="book-title">{item.original_title}</div>
							</ResultCard.Title>
							<ResultCard.Description>
								<div>
									by <span className="authors-list">{item.authors}</span>
								</div>
								<div>
									Pub {item.original_publication_year} · {item.language_code}
								</div>
							</ResultCard.Description>
						</ResultCard>
					))}
				</ReactiveList.ResultCardsWrapper>
			)}
		/>
	</div>
);

export default App;
