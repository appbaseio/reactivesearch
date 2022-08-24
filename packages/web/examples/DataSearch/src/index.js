import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

import {
	ReactiveBase,
	DataSearch,
	ReactiveList,
	ResultCard,
	SelectedFilters,
} from '@appbaseio/reactivesearch';

import './index.css';

const Main = () => {
	const [value, setValue] = useState(
		// 'harry',
		['caught'],
	);
	const triggerQueryEmthod = useRef(null);

	useEffect(() => {
		// triggerQueryEmthod.current({ isOpen: false });
	}, [value]);
	const onChange = (valueParam, triggerQuery) => {
		console.log('Inside Example onchange callback', valueParam);
		setValue(valueParam);
		triggerQueryEmthod.current = triggerQuery;
	};
	return (
		<ReactiveBase
			app="good-books-ds"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
			enableAppbase
			appbaseConfig={{
				recordAnalytics: true,
			}}
		>
			<div className="row">
				<div className="col">
					<DataSearch
						title="DataSearch"
						dataField={['original_title', 'original_title.search']}
						componentId="BookSensor"
						URLParams
						enableRecentSearches
						enablePopularSuggestions
						size={5}
						// value={value}
						// onChange={onChange}
						mode="tag"
						innerClass={{ 'selected-tag': 'selected-tag' }}
						// renderSelectedTags={({ values = [], handleClear, handleClearAll }) => {
						// 	if (!Array.isArray(values) || values.length === 0) {
						// 		return null;
						// 	}

						// 	return (
						// 		<div>
						// 			{values.map(item => (
						// 				<button onClick={() => handleClear(item)}>
						// 					{item}
						// 					<span>x</span>
						// 				</button>
						// 			))}
						// 			<button onClick={handleClearAll}>Clear All</button>
						// 		</div>
						// 	);
						// }}
					/>
				</div>

				<div className="col">
					<SelectedFilters
						render={(params) => {
							const { selectedValues, setValue: setValueParam } = params;
							const clearFilter = (component) => {
								setValue(component, null);
							};

							const filters = Object.keys(selectedValues).map((component) => {
								if (!selectedValues[component].value) return null;
								const valueVar = selectedValues[component].value;
								if (!valueVar) return null;
								if (Array.isArray(valueVar)) {
									if (!valueVar.length) {
										return null;
									}
									return (
										<div>
											{valueVar.map(val => (
												<button
													key={component}
													onClick={() =>
														setValueParam(
															component,
															valueVar.filter(item => item !== val),
														)
													}
												>
													{val}
												</button>
											))}

											<button onClick={() => setValueParam(component, null)}>
												Clear ALL{' '}
											</button>
										</div>
									);
								}
								return (
									<button key={component} onClick={() => clearFilter(component)}>
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
						size={10}
						className="result-list-container"
						pagination
						URLParams
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
};

export default Main;

ReactDOM.render(<Main />, document.getElementById('root'));
