import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { ReactiveBase, RangeSlider, SelectedFilters, ResultList } from '@appbaseio/reactivesearch';

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
						<RangeSlider
							dataField="ratings_count"
							componentId="BookSensor"
							range={{
								start: 3000,
								end: 50000,
							}}
							rangeLabels={{
								start: '3K',
								end: '50K',
							}}
						/>
					</div>

					<div className="col">
						<SelectedFilters />
						<ResultList
							componentId="SearchResult"
							dataField="original_title"
							from={0}
							size={3}
							className="result-list-container"
							renderItem={this.booksList}
							pagination
							react={{
								and: 'BookSensor',
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}

	booksList(data) {
		return {
			title: (
				<div
					className="book-title"
					dangerouslySetInnerHTML={{ __html: data.original_title }}
				/>
			),
			description: (
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
										<i className="fas fa-star" key={index} />
									)) // eslint-disable-line
								}
							</span>
							<span className="avg-rating">({data.average_rating} avg)</span>
						</div>
					</div>
					<span className="pub-year">Pub {data.original_publication_year}</span>
				</div>
			),
			image: data.image,
		};
	}
}

ReactDOM.render(<Main />, document.getElementById('root'));
