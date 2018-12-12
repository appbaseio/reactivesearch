import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
	ReactiveBase,
	RatingsFilter,
	ResultCard,
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
						<SelectedFilters />
						<RatingsFilter
							componentId="RatingsSensor"
							dataField="average_rating_rounded"
							title="RatingsFilter"
							data={[
								{ start: 4, end: 5, label: '4 stars and up' },
								{ start: 3, end: 5, label: '3 stars and up' },
								{ start: 2, end: 5, label: '2 stars and up' },
								{ start: 1, end: 5, label: '> 1 stars' },
							]}
						/>
					</div>

					<div className="col">
						<ResultCard
							componentId="SearchResult"
							dataField="name"
							title="Results"
							from={0}
							size={20}
							renderData={this.onData}
							react={{
								and: 'RatingsSensor',
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}

	onData(data) {
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
										<i className="fas fa-star" key={`star-${index + 1}`} />
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
