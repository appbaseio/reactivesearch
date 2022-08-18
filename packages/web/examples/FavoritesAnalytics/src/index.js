import { object, bool, string } from 'prop-types';
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

const BooksReactiveList = ({ data, queryID, showFavorite = true }) => {
	const handleFavorite = () => {
		if (queryID) {
			aaInstance.favorite({
				queryID,
				meta: {
					key1: 'value1',
				},
				favoriteOn: data._id,
				source: data,
				// userID: 'john@appbase.io',
				customEvents: { platform: 'mac' },
			});
		}
	};
	return (
		<div className="flex book-content">
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
			{showFavorite ? (
				<div className="favorite-btn">
					<button onClick={handleFavorite}>Favorite</button>
				</div>
			) : null}
		</div>
	);
};

BooksReactiveList.propTypes = {
	// eslint-disable-next-line
	data: object,
	showFavorite: bool,
	queryID: string,
};

const RecentFavorites = () => {
	const [recentFavorites, setFavorites] = useState([]);
	const loadFavorites = () => {
		aaInstance.getFavorites(
			{
				size: 5,
			},
			(_, res) => {
				res.json()
					.then(setFavorites)
					.catch((err) => {
						console.error(err);
					});
			},
		);
	};
	useEffect(() => {
		loadFavorites();
	}, []);

	return (
		<div>
			<button onClick={loadFavorites}>Reload favorites</button>
			{recentFavorites.length ? (
				<section>
					<h3>Favorites</h3>
					<ul>
						{recentFavorites.map(s => (
							<BooksReactiveList key={s.id} data={s.source} showFavorite={false} />
						))}
					</ul>
				</section>
			) : null}
		</div>
	);
};

const Main = () => {
	const queryID = useRef(null);
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
					<RecentFavorites />
				</div>

				<div className="col">
					<ReactiveList
						componentId="SearchResult"
						dataField="original_title"
						className="result-list-container"
						size={5}
						renderItem={data => (
							<BooksReactiveList
								key={data._id}
								data={data}
								queryID={queryID.current}
							/>
						)}
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
