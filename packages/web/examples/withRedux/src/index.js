import React from 'react';
import ReactDOM from 'react-dom';

import {
	ReactiveBase,
	DataSearch,
	ResultList,
	SelectedFilters,
	ReactiveList,
} from '@appbaseio/reactivesearch';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './components/App';
import reducer from './reducers';
import './index.css';

const store = createStore(reducer);

const Main = () => (
	<Provider store={store}>
		<ReactiveBase
			app="good-books-ds"
			credentials="nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d"
		>
			<div className="row">
				<div className="col">
					<div>
						<App />
						<DataSearch
							title="DataSearch"
							dataField={['original_title', 'original_title.search']}
							categoryField="authors.raw"
							componentId="BookSensor"
						/>
					</div>
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
							<ReactiveList.ResultListWrapper>
								{data.map(item => (
									<ResultList key={item._id}>
										<ResultList.Image src={item.image} />
										<ResultList.Content>
											<ResultList.Title>
												<div
													className="book-title"
													dangerouslySetInnerHTML={{
														__html: item.original_title,
													}}
												/>
											</ResultList.Title>
											<ResultList.Description>
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
											</ResultList.Description>
										</ResultList.Content>
									</ResultList>
								))}
							</ReactiveList.ResultListWrapper>
						)}
					/>
				</div>
			</div>
		</ReactiveBase>
	</Provider>
);

ReactDOM.render(<Main />, document.getElementById('root'));
