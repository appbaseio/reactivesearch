import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {
	ReactiveBase,
	MultiList,
	ReactiveList,
	SelectedFilters,
} from '@appbaseio/reactivesearch';

import './index.css';

class Main extends Component {
	render() {
		return (
			<ReactiveBase
				app="good-books-ds"
				credentials="nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d"
			>
				<div className="row">
					<div className="col">
						<MultiList
							componentId="BookSensor"
							dataField="original_series.raw"
							size={100}
						/>
					</div>

					<div className="col">
						<SelectedFilters />
						<ReactiveList
							componentId="SearchResult"
							dataField="original_title.raw"
							className="result-list-container"
							from={0}
							size={5}
							onData={this.booksReactiveList}
							react={{
								and: ['BookSensor'],
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}

	booksReactiveList(data) {
		return (
			<div className="flex book-content" key={data._id}>
				<img src={data.image} alt="Book Cover" className="book-image" />
				<div className="flex column justify-center" style={{ marginLeft: 20 }}>
					<div className="book-header">{data.original_title}</div>
					<div className="flex column justify-space-between">
						<div>
							<div>by <span className="authors-list">{data.authors}</span></div>
							<div className="ratings-list flex align-center">
								<span className="stars">
									{
										Array(data.average_rating_rounded).fill('x')
											.map((item, index) => <i className="fas fa-star" key={index} />) // eslint-disable-line
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
}

ReactDOM.render(<Main />, document.getElementById('root'));
