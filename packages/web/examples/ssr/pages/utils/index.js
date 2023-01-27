import React from 'react';
import { ReactiveList } from '@appbaseio/reactivesearch';

const components = {
	settings: {
		app: 'movies-demo-app',
		url: 'https://81719ecd9552:e06db001-a6d8-4cc2-bc43-9c15b1c0c987@appbase-demo-ansible-abxiydt-arc.searchbase.io',
		theme: {
			colors: {
				backgroundColor: '#212121',
				primaryTextColor: '#fff',
				primaryColor: '#2196F3',
				titleColor: '#fff',
				alertColor: '#d9534f',
				borderColor: '#666',
			},
		},
		enableAppbase: true,
	},
	searchbox: {
		componentId: 'SearchSensor',
		dataField: ['original_title', 'original_title.search'],
		autosuggest: true,
		placeholder: 'Search for movies...',
		iconPosition: 'left',
		className: 'search',
		highlight: true,
		URLParams: true,
	},
	multiList: {
		componentId: 'genres-list',
		dataField: 'genres.keyword',

		react: {
			and: ['SearchSensor', 'results', 'vote-average'],
		},
		innerClass: {
			label: 'list-item',
			input: 'list-input',
		},
		URLParams: true,
	},
	rangeSlider: {
		componentId: 'vote-average',
		dataField: 'vote_average',
		range: {
			start: 0,
			end: 10,
		},
		rangeLabels: {
			start: '0',
			end: '10',
		},
		react: {
			and: ['SearchSensor', 'results', 'genres-list'],
		},
		showHistogram: true,
		URLParams: true,
	},
	resultcard: {
		className: 'right-col',
		componentId: 'results',
		dataField: 'name',
		size: 12,
		render: ({ data }) => (
			<ReactiveList.ResultCardsWrapper style={{ margin: '8px 0 0' }}>
				{data.map((item) => (
					<div style={{ marginRight: '15px' }} className="main-description">
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
										dangerouslySetInnerHTML={{ __html: item.original_title }}
									/>

									<div className="overlay-description">{item.overview}</div>

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
														{item.original_language}
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
		),

		URLParams: true,
		react: {
			and: ['SearchSensor', 'vote-average', 'genres-list'],
		},
		innerClass: {
			resultStats: 'result-stats',
			list: 'list',
			listItem: 'list-item',
			image: 'image',
		},
	},
};

module.exports = { components };
