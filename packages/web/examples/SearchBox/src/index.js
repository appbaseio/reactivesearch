import React from 'react';
import ReactDOM from 'react-dom';

import {
	ReactiveBase,
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
			userId: 'jon',
		}}
	>
		<div className="row">
			<div className="col">
				<SearchBox
					title="SearchBox"
					defaultValue="Harry Potter"
					dataField={['original_title', 'original_title.search']}
					componentId="BookSensor"
					highlight
					URLParams
					enablePopularSuggestions
					popularSuggestionsConfig={{
						size: 3,
						minChars: 2,
						index: 'good-books-ds',
					}}
					enableRecentSuggestions
					recentSuggestionsConfig={{
						size: 3,
						index: 'good-books-ds',
						minChars: 4,
					}}
					size={5}
					enablePredictiveSuggestions
					index="good-books-ds"
					onData={(props) => {
						// eslint-disable-next-line
						console.log(props);
					}}
					showClear
					onValueSelected={(value, cause) => {
						// eslint-disable-next-line
						console.log(value, cause);
					}}
					renderNoSuggestion="No suggestions found."
				/>
			</div>

			<div className="col">
				<SelectedFilters />
				<ReactiveList
					componentId="SearchResult"
					dataField="original_title"
					size={10}
					className="result-list-container"
					pagination
					react={{
						and: 'BookSensor',
					}}
					render={({ data }) => (
						<ReactiveList.ResultCardsWrapper>
							{data.map(item => (
								<ResultCard id={item._id} key={item._id}>
									<ResultCard.Image src={item.image} />
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
												<div>
													by{' '}
													<span className="authors-list">
														{item.authors}
													</span>
												</div>
												<div className="ratings-list flex align-center">
													<span className="stars">
														{
															/* eslint-disable */
															Array(item.average_rating_rounded)
																.fill('x')
																.map((_, index) => (
																	<i
																		className="fas fa-star"
																		key={index}
																	/>
																))
															/* eslint-enable */
														}
													</span>
													<span className="avg-rating">
														({item.average_rating} avg)
													</span>
												</div>
											</div>
											<span className="pub-year">
												Pub {item.original_publication_year}
											</span>
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

export default Main;

ReactDOM.render(<Main />, document.getElementById('root'));
