import ReactDOM from 'react-dom/client';

import { ReactiveBase, SearchBox, ReactiveList, ResultCard } from '@appbaseio/reactivesearch';

import './index.css';

const Main = () => (
	<ReactiveBase
		app="movies-demo-app"
		url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
		reactivesearchAPIConfig={{
			recordAnalytics: true,
			userId: 'jon',
		}}
	>
		<div className="row">
			<div className="col">
				{' '}
				<SearchBox
					title="SearchBox"
					dataField={['original_title', 'original_title.search']}
					componentId="MoviesSensor"
					enableIndexSuggestions
					indexSuggestionsConfig={{
						sectionLabel: '<b>Index suggestions 🙌🏻</b>',
						size: 5,
						index: 'movies-demo-app', // further restrict the index to search on
					}}
					enablePopularSuggestions
					popularSuggestionsConfig={{
						size: 5,
						minCount: 5,
						minChars: 3,
						showGlobal: false,
						index: 'movies-demo-app', // further restrict the index to search on
						sectionLabel: '<b>Popular suggestions 🙌🏻</b>',
					}}
					enableRecentSuggestions
					recentSuggestionsConfig={{
						size: 5,
						minHits: 2,
						minChars: 3,
						index: 'movies-demo-app', // further restrict the index to search on
						sectionLabel: '<b>Recent suggestions 🙌🏻</b>',
					}}
				/>
				<br />
				<ReactiveList
					componentId="SearchResult"
					dataField="original_title"
					size={10}
					className="result-list-container"
					pagination
					react={{
						and: 'MoviesSensor',
					}}
					render={({ data }) => (
						<ReactiveList.ResultCardsWrapper>
							{data.map((item) => (
								<ResultCard id={item._id} key={item._id}>
									<ResultCard.Image src={item.poster_path} />
									<ResultCard.Title>
										<div
											className="book-title"
											dangerouslySetInnerHTML={{
												__html: item.original_title,
											}}
										/>
									</ResultCard.Title>

									<ResultCard.Description>
										<div className="flex column justify-space-between">
											<div>
												<div title={item.overview}>
													<span className="authors-list">
														{item.overview}
													</span>
												</div>
												<div className="ratings-list flex align-center">
													<span>
														{item.genres.map((_) => (
															<span> ∙ {_}</span>
														))}
													</span>
												</div>
											</div>
										</div>
									</ResultCard.Description>
								</ResultCard>
							))}
						</ReactiveList.ResultCardsWrapper>
					)}
				/>
			</div>
		</div>
	</ReactiveBase>
);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
