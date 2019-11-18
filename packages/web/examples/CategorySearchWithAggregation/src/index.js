import React from 'react';
import ReactDOM from 'react-dom';

import {
	ReactiveBase,
	CategorySearch,
	SelectedFilters,
	ReactiveList,
	ResultCard,
} from '@appbaseio/reactivesearch';

import './index.css';

const Main = () => (
	<ReactiveBase
		app="good-book-ds-latest"
		credentials="IPM14ICqp:8e573e86-8802-4a27-a7a1-4c7d0c62c186"
	>
		<div className="row">
			<div className="col">
				<CategorySearch
					title="CategorySearch"
					dataField={['original_title', 'original_title.search']}
					aggregationField="original_title.keyword"
					categoryField="title.keyword"
					componentId="BookSensor"
					highlight
				/>
			</div>

			<div className="col">
				<SelectedFilters />
				<ReactiveList
					componentId="SearchResult"
					dataField="original_title"
					from={0}
					size={3}
					className="result-list-container"
					pagination
					react={{
						and: 'BookSensor',
					}}
					render={({ data }) => (
						<ReactiveList.ResultCardsWrapper>
							{data.map(item => (
								<ResultCard key={item.id}>
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
														{Array(item.average_rating_rounded)
															.fill('x')
															// eslint-disable-next-line no-shadow
															.map((item, index) => (
																<i
																	className="fas fa-star"
																	key={index.toString()}
																/>
															)) // eslint-disable-line
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
