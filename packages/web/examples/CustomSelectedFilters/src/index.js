import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {
	ReactiveBase,
	DataSearch,
	ResultList,
	ReactiveList,
	SelectedFilters,
} from '@appbaseio/reactivesearch';

import './index.css';

class Main extends Component {
	render() {
		return (
			<ReactiveBase
				app="good-books-ds"
				url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@arc-cluster-appbase-demo-6pjy6z.searchbase.io"
				enableAppbase
			>
				<div className="row">
					<div className="col">
						<DataSearch
							dataField="original_title.keyword"
							componentId="BookSensor"
							defaultValue="Artemis Fowl"
						/>
					</div>

					<div className="col">
						<SelectedFilters
							render={(props) => {
								const { selectedValues, setValue } = props;
								const clearFilter = (component) => {
									setValue(component, null);
								};

								const filters = Object.keys(selectedValues).map((component) => {
									if (!selectedValues[component].value) return null;
									return (
										<button
											key={component}
											onClick={() => clearFilter(component)}
										>
											{selectedValues[component].value}
										</button>
									);
								});

								return filters;
							}}
						/>
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
																	{Array(
																		item.average_rating_rounded,
																	)
																		.fill('x')
																		.map((item, index) => (
																			<i
																				className="fas fa-star"
																				key={index}
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
		);
	}
}

export default Main;

ReactDOM.render(<Main />, document.getElementById('root'));
