import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { ReactiveBase, SearchBox, ReactiveList } from '@appbaseio/reactivesearch';
import aa from '@appbaseio/analytics';
import './index.css';

const AppbaseConfig = {
	app: 'good-books-ds',
	url: 'https://@appbase-demo-ansible-abxiydt-arc.searchbase.io',
	credentials: 'a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61',
};
const aaInstance = aa.init({
	index: AppbaseConfig.app,
	credentials: AppbaseConfig.credentials,
	url: AppbaseConfig.url,
});

const RecentSavedSearches = () => {
	const [recentSearches, setRecentSearches] = useState([]);
	const loadSavedSearches = () => {
		aaInstance.getSavedSearches(
			{
				size: 5,
			},
			(_, res) => {
				res.json()
					.then(setRecentSearches)
					.catch((err) => {
						console.error(err);
					});
			},
		);
	};
	useEffect(() => {
		loadSavedSearches();
	}, []);

	return (
		<div>
			<button onClick={loadSavedSearches}>Load saved searches</button>
			{recentSearches.length ? (
				<section>
					<h3>Saved searches</h3>
					<ul>
						{recentSearches.map(s => (
							<li key={s.save_search_id}>{s.search_query}</li>
						))}
					</ul>
				</section>
			) : null}
		</div>
	);
};

const Main = () => {
	const queryID = useRef(null);
	const handleSaveSearch = () => {
		if (queryID.current) {
			aaInstance.saveSearch({
				queryID: queryID.current,
				saveSearchMeta: {
					key1: 'value1',
				},
				// userID: 'john@appbase.io',
				customEvents: { platform: 'mac' },
			});
		}
	};
	const booksReactiveList = data => (
		<div className="flex book-content" key={data._id}>
			<img src={data.image} alt="Book Cover" className="book-image" />
			<div className="flex column justify-center" style={{ marginLeft: 20 }}>
				<div className="book-header">{data.original_title}</div>
				<div className="flex column justify-space-between">
					<div>
						<div>
							by <span className="authors-list">{data.authors}</span>
						</div>
						<div className="ratings-list flex align-center">
							<span className="stars">
								{Array(data.average_rating_rounded)
									.fill('x')
									.map((item, index) => (
										// eslint-disable-next-line
										<i className="fas fa-star" key={index} />
									))}
							</span>
							<span className="avg-rating">({data.average_rating} avg)</span>
						</div>
					</div>
					<span className="pub-year">Pub {data.original_publication_year}</span>
				</div>
			</div>
		</div>
	);
	return (
		<ReactiveBase
			{...AppbaseConfig}
			appbaseConfig={{
				recordAnalytics: true,
			}}
			enableAppbase
		>
			<div className="row">
				<div className="col">
					<SearchBox
						title="Search for Books"
						dataField={['original_title', 'original_title.search']}
						componentId="BookSensor"
						index="good-books-ds"
						showClear
					/>
				</div>

				<div className="col">
					<RecentSavedSearches />
					<button onClick={handleSaveSearch}>Save Search</button>
					<ReactiveList
						componentId="SearchResult"
						dataField="original_title"
						className="result-list-container"
						size={5}
						renderItem={booksReactiveList}
						pagination
						URLParams
						onData={(data) => {
							queryID.current = data.settings ? data.settings.queryId : null;
						}}
						react={{
							and: ['BookSensor'],
						}}
					/>
				</div>
			</div>
		</ReactiveBase>
	);
};

ReactDOM.render(<Main />, document.getElementById('root'));
