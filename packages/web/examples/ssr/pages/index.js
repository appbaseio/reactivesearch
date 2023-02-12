import React, { useState } from 'react';
import {
	MultiList,
	ReactiveBase,
	ReactiveList,
	SearchBox,
	SelectedFilters,
	getServerState,
	RangeSlider,
} from '@appbaseio/reactivesearch';
import PropTypes from 'prop-types';

function Main(props) {
	const [isClicked, setIsClicked] = useState(false);
	const [message, setMessage] = useState('🔬 Show Filters');

	const handleClick = () => {
		setIsClicked(!isClicked);
		setMessage(isClicked ? '🔬 Show Filters' : '🎬 Show Movies');
	};

	return (
		<div className="main-container">
			<ReactiveBase
				app="movies-demo-app"
				url="https://81719ecd9552:e06db001-a6d8-4cc2-bc43-9c15b1c0c987@appbase-demo-ansible-abxiydt-arc.searchbase.io"
				enableAppbase
				theme={{
					colors: {
						backgroundColor: '#212121',
						primaryTextColor: '#fff',
						primaryColor: '#2196F3',
						titleColor: '#fff',
						alertColor: '#d9534f',
						borderColor: '#666',
					},
				}}
				{...(props.contextCollector ? { contextCollector: props.contextCollector } : {})}
				initialState={props.initialState}
			>
				<div className="navbar">
					<div className="header-container">
						<span role="img" aria-label="movies-emoji">
							🎥
						</span>{' '}
						MovieSearch
					</div>

					<div className="search-container">
						<SearchBox
							componentId="SearchSensor"
							dataField={['original_title', 'original_title.search']}
							autosuggest
							placeholder="Search for movies..."
							iconPosition="left"
							className="search"
							highlight
							URLParams
						/>
					</div>
					<div className="sub-container">
						<div className={isClicked ? 'left-bar-optional' : 'left-bar'}>
							<div className="filter-heading center">
								<b>
									{' '}
									<i className="fa fa-pied-piper-alt" /> Genres{' '}
								</b>
							</div>

							<MultiList
								componentId="GenresList"
								dataField="genres.keyword"
								react={{
									and: ['SearchSensor', 'results', 'VoteAverage'],
								}}
								innerClass={{
									label: 'list-item',
									input: 'list-input',
								}}
								URLParams
								className="genres-filter"
							/>
							<hr className="blue" />

							<div className="filter-heading center">
								<b>
									<i className="fa fa-star" /> Ratings
								</b>
							</div>
							<RangeSlider
								componentId="VoteAverage"
								dataField="vote_average"
								range={{
									start: 0,
									end: 10,
								}}
								rangeLabels={{
									start: '0',
									end: '10',
								}}
								react={{
									and: ['SearchSensor', 'results', 'GenresList'],
								}}
								showHistogram
								URLParams
								className="review-filter"
							/>
						</div>

						<div
							className={isClicked ? 'result-container-optional' : 'result-container'}
						>
							<SelectedFilters
								showClearAll
								clearAllLabel="Clear filters"
								className="selected-filters"
							/>
							<ReactiveList
								className="right-col"
								componentId="results"
								dataField="name"
								size={12}
								render={({ data }) => (
									<ReactiveList.ResultCardsWrapper style={{ margin: '8px 0 0' }}>
										{data.map(item => (
											<div
												style={{ marginRight: '15px' }}
												className="main-description"
											>
												<div className="ih-item square effect6 top_to_bottom">
													<a
														target="#"
														href={`https://www.google.com/search?q='${item.original_title}`}
													>
														<div className="img">
															<img
																src={item.poster_path}
																alt={item.original_title}
																className="result-image"
															/>
														</div>
														<div className="info colored">
															<h3
																className="overlay-title"
																dangerouslySetInnerHTML={{
																	__html: item.original_title,
																}}
															/>

															<div className="overlay-description">
																{item.overview}
															</div>

															<div className="overlay-info">
																<div className="rating-time-score-container">
																	<div className="sub-title Rating-data">
																		<b>
																			Ratings
																			<span className="details">
																				{' '}
																				{item.vote_average}
																			</span>
																		</b>
																	</div>
																	<div className="time-data">
																		<b>
																			<span className="time">
																				<i className="fa fa-clock-o" />{' '}
																			</span>{' '}
																			<span className="details">
																				{item.release_date}
																			</span>
																		</b>
																	</div>
																	<div className="sub-title Score-data">
																		<b>
																			Popularity:
																			<span className="details">
																				{' '}
																				{item.popularity}
																			</span>
																		</b>
																	</div>
																</div>
																<div className="vote-average-lang-container">
																	<div className="sub-title language-data">
																		<b>
																			Language:
																			<span className="details">
																				{' '}
																				{
																					item.original_language
																				}
																			</span>
																		</b>
																	</div>
																</div>
															</div>
														</div>
													</a>
												</div>
											</div>
										))}
									</ReactiveList.ResultCardsWrapper>
								)}
								URLParams
								react={{
									and: ['SearchSensor', 'VoteAverage', 'GenresList'],
								}}
								innerClass={{
									resultStats: 'result-stats',
									list: 'list',
									listItem: 'list-item',
									image: 'image',
								}}
							/>
						</div>
					</div>
				</div>
			</ReactiveBase>
			<button className="toggle-button" onClick={handleClick}>
				{message}
			</button>
		</div>
	);
}
export const getServerSideProps = async (context) => {
	let initialState = {};
	initialState = await getServerState(Main, context.resolvedUrl);
	return {
		props: { initialState },
		// will be passed to the page component as props
	};
};

Main.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	initialState: PropTypes.object,
	contextCollector: PropTypes.func,
};

export default Main;
