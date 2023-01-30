import React from 'react';
import ReactDOM from 'react-dom';

import {
	ReactiveBase,
	ReactiveList,
	ResultCard,
	SelectedFilters,
	useAnalytics,
	DataSearch,
} from '@appbaseio/reactivesearch';

import './index.css';

const VisitStoreButton = () => {
	const aaInstance = useAnalytics();
	const handleVisitStore = () => {
		aaInstance.conversion({
			queryID: aaInstance.getQueryID(),
			objects: ['Harry Potter', 'Frankenstein'],
		});
	};
	return (
		<button
			style={{
				background: '#c5906c',
				border: 'none',
				padding: '5px',
				color: 'white',
				margin: '5px 0px',
				cursor: 'pointer',
			}}
			onClick={handleVisitStore}
		>
			Visit Store
		</button>
	);
};

const Main = () => (
	<ReactiveBase
		app="good-books-ds"
		url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
		enableAppbase
		reactivesearchAPIConfig={{
			recordAnalytics: true,
		}}
	>
		<div className="row">
			<div className="col">
				<VisitStoreButton />
				<DataSearch
					title="DataSearch"
					dataField="original_title"
					componentId="BookSensor"
					URLParams
					enableRecentSearches
					enablePopularSuggestions
					size={5}
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
					URLParams
					react={{
						and: 'BookSensor',
					}}
					render={({ data, triggerClickAnalytics }) => (
						<ReactiveList.ResultCardsWrapper>
							{data.map((item, idx) => (
								<ResultCard
									id={item._id}
									key={item._id}
									onClick={() =>
										triggerClickAnalytics(idx, item._id)}
								>
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
