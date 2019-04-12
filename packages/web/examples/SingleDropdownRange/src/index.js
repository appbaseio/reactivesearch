import React from 'react';
import ReactDOM from 'react-dom';

import {
	ReactiveBase,
	SingleDropdownRange,
	ResultCard,
	SelectedFilters,
	ReactiveList,
} from '@appbaseio/reactivesearch';

import './index.css';

const Main = () => (
	<ReactiveBase app="good-books-ds" credentials="nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d">
		<div className="row reverse-labels">
			<div className="col">
				<SingleDropdownRange
					componentId="BookSensor"
					dataField="average_rating"
					data={[
						{ start: 0, end: 3, label: 'Rating < 3' },
						{ start: 3, end: 4, label: 'Rating 3 to 4' },
						{ start: 4, end: 5, label: 'Rating > 4' },
					]}
				/>
			</div>
			<div className="col" style={{ backgroundColor: '#fafafa' }}>
				<SelectedFilters />
				<ReactiveList
					componentId="SearchResult"
					dataField="original_title.raw"
					from={0}
					size={10}
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
