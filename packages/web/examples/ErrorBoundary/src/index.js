import ReactDOM from 'react-dom/client';
import {
	ReactiveBase,
	DynamicRangeSlider,
	SelectedFilters,
	ResultList,
	ReactiveList,
	ErrorBoundary,
} from '@appbaseio/reactivesearch';

import './index.css';

const Main = () => (
	<ReactiveBase
		app="good-books-ds"
		url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
	>
		<ErrorBoundary
			renderError={(error) => (
				<div>
					<h1>Oops! Error occured.</h1>
					<p>{error.message}</p>
				</div>
			)}
		>
			<div className="row">
				<div className="col">
					<DynamicRangeSlider
						dataField="_"
						componentId="BookSensor"
						rangeLabels={(min, max) => ({
							start: `${min} book`,
							end: `${max} books`,
						})}
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
							<ReactiveList.ResultListWrapper>
								{data.map((item) => (
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
																	.map((_, index) => (
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
		</ErrorBoundary>
	</ReactiveBase>
);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
