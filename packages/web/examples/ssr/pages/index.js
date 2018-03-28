/* eslint-disable */
import React, { Component } from 'react';
import {
	ReactiveBase,
	SingleList,
	ReactiveList,
	SelectedFilters,
} from '@appbaseio/reactivesearch';

import initReactivesearch from '@appbaseio/reactivesearch/lib/server';

import './index.css';

function renderBooks(data) {
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

const settings = {
	app: 'good-books-ds',
	credentials: 'nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d',
};

const singleListProps = {
	componentId: 'BookSensor',
	dataField: 'original_series.raw',
	defaultSelected: 'In Death',
	size: 100,
};

const reactiveListProps = {
	componentId: 'SearchResult',
	dataField: 'original_title.raw',
	className: 'result-list-container',
	from: 0,
	size: 5,
	onData: renderBooks,
	react: {
		and: ['BookSensor'],
	},
};


export default class Main extends Component {
	static async getInitialProps() {
		return {
			settings,
			reactiveListProps,
			singleListProps,
			store: await initReactivesearch(
				[
					{
						...singleListProps,
						type: 'SingleList',
						source: SingleList,
					},
					{
						...reactiveListProps,
						type: 'ReactiveList',
						source: ReactiveList,
					},
				],
				null,
				settings,
			),
		};
	}

	render() {
		return (
			<ReactiveBase {...settings} initialState={this.props.store}>
				<div className="row">
					<div className="col">
						<SingleList
							{...singleListProps}
						/>
					</div>

					<div className="col">
						<SelectedFilters />
						<ReactiveList
							{...reactiveListProps}
							onData={renderBooks}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}
}
