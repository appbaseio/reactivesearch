import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {
	ReactiveBase,
	SingleDropdownRange,
	ResultCard,
} from '@appbaseio/reactivesearch';

import './index.css';

class Main extends Component {
	render() {
		return (
			<ReactiveBase
				app="good-books-live"
				credentials="sHZWU7AYJ:d1e2922c-035c-429f-bfe4-62aa38b1c395"
			>
				<div className="row reverse-labels">
					<div className="col">
						<SingleDropdownRange
							componentId="BookSensor"
							dataField="average_rating"
							title="SingleDropdownRange"
							data={
								[{ start: 0, end: 3, label: 'Rating < 3' },
									{ start: 3, end: 4, label: 'Rating 3 to 4' },
									{ start: 4, end: 5, label: 'Rating > 4' }]
							}
						/>
					</div>
					<div className="col" style={{ backgroundColor: '#fafafa' }}>
						<ResultCard
							componentId="SearchResult"
							dataField="original_title.raw"
							from={0}
							size={10}
							onData={this.booksCard}
							react={{
								and: 'BookSensor',
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}

	booksCard(data) {
		return {
			title: <div className="book-title-card text-center" dangerouslySetInnerHTML={{ __html: data.original_title }} />,
			description: (
				<div className="flex column justify-space-between text-center">
					<div>
						<div>by <span className="authors-list">{data.authors}</span></div>
						<div className="ratings-list flex align-center justify-center">
							<span className="stars">
								{
									Array(data.average_rating_rounded).fill('x')
										.map((item, index) => <i className="fas fa-star" key={index} />)
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
