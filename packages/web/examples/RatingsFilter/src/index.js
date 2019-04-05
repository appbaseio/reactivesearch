import React from 'react';
import ReactDOM from 'react-dom';
import {
	ReactiveBase,
	RatingsFilter,
	ResultCard,
	SelectedFilters,
	ReactiveList,
} from '@appbaseio/reactivesearch';

import './index.css';

const Main = () => (
	<ReactiveBase app="good-books-ds" credentials="nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d">
		<div className="row">
			<div className="col">
				<SelectedFilters />
				<RatingsFilter
					componentId="RatingsSensor"
					dataField="average_rating_rounded"
					title="RatingsFilter"
					data={[
						{ start: 4, end: 5, label: '4 stars and up' },
						{ start: 3, end: 5, label: '3 stars and up' },
						{ start: 2, end: 5, label: '2 stars and up' },
						{ start: 1, end: 5, label: '> 1 stars' },
					]}
				/>
			</div>

			<div className="col">
				<ReactiveList
					componentId="SearchResult"
					dataField="name"
					title="Results"
					from={0}
					size={20}
					react={{
						and: 'RatingsSensor',
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
															.map((
																item, // eslint-disable-line
																index,
															) => (
																<i
																	className="fas fa-star"
																	key={index} // eslint-disable-line
																/>
															))}
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

ReactDOM.render(<Main />, document.getElementById('root'));
