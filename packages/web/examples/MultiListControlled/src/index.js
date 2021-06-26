import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import { MultiList, ReactiveBase, ReactiveList, SelectedFilters } from '@appbaseio/reactivesearch';

import './index.css';

function booksReactiveList(data) {
	return (
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
										// eslint-disable-next-line react/no-array-index-key
										<i className="fas fa-star" key={index} />
									))
								}
							</span>
							<span className="avg-rating">({data.average_rating} avg)</span>
						</div>
					</div>
					<span className="pub-year">Pub {data.original_publication_year}</span>
				</div>
			</div>
		</div>
	);
}

function Main() {
	const [values, setValues] = useState([]);
	return (
		<ReactiveBase
			app="good-books-ds"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
			enableAppbase
		>
			<div className="row">
				<div className="col">
					<MultiList
						componentId="BookSensor"
						dataField="original_series.keyword"
						aggregationSize={100}
						value={values}
						onChange={setValues}
					/>
				</div>

				<div className="col">
					<SelectedFilters />
					<ReactiveList
						componentId="SearchResult"
						dataField="original_title"
						className="result-list-container"
						from={0}
						size={5}
						renderItem={booksReactiveList}
						react={{
							and: ['BookSensor'],
						}}
					/>
				</div>
			</div>
		</ReactiveBase>
	);
}

ReactDOM.render(<Main />, document.getElementById('root'));
