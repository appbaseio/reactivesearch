import React, { Component } from 'react';
import {
	ReactiveBase,
	SingleRange,
	SelectedFilters,
	ResultCard,
} from '@appbaseio/reactivesearch';
import PropTypes from 'prop-types';

import initReactivesearch from '@appbaseio/reactivesearch/lib/server';

import Layout from '../components/Layout';

const settings = {
	app: 'good-books-ds',
	credentials: 'nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d',
};

const singleRangeProps = {
	componentId: 'BookSensor',
	dataField: 'average_rating',
	data: [
		{ start: 0, end: 3, label: 'Rating < 3' },
		{ start: 3, end: 4, label: 'Rating 3 to 4' },
		{ start: 4, end: 5, label: 'Rating > 4' },
	],
	defaultSelected: 'Rating 3 to 4',
};

const resultCardProps = {
	componentId: 'SearchResult',
	dataField: 'original_title.raw',
	from: 0,
	size: 10,
	onData: data => ({
		title: <div className="book-title-card text-center" dangerouslySetInnerHTML={{ __html: data.original_title }} />,
		description: (
			<div className="flex column justify-space-between text-center">
				<div>
					<div>by <span className="authors-list">{data.authors}</span></div>
					<div className="ratings-list flex align-center justify-center">
						<span className="stars">
							{
								Array(data.average_rating_rounded).fill('x')
									.map((item, index) => <span key={index}>👽</span>) // eslint-disable-line
							}
						</span>
						<span className="avg-rating">({data.average_rating} avg)</span>
					</div>
				</div>
				<span className="pub-year">Pub {data.original_publication_year}</span>
			</div>
		),
		image: data.image,
	}),
	react: {
		and: ['BookSensor'],
	},
};

export default class Main extends Component {
	static async getInitialProps() {
		return {
			store: await initReactivesearch(
				[
					{
						...singleRangeProps,
						type: 'SingleRange',
						source: SingleRange,
					},
					{
						...resultCardProps,
						type: 'ResultCard',
						source: ResultCard,
					},
				],
				null,
				settings,
			),
		};
	}

	render() {
		return (
			<Layout title="SSR | SingleRange">
				<ReactiveBase {...settings} initialState={this.props.store}>
					<div className="row">
						<div className="col">
							<SingleRange
								{...singleRangeProps}
							/>
						</div>

						<div className="col">
							<SelectedFilters />
							<ResultCard
								{...resultCardProps}
							/>
						</div>
					</div>
				</ReactiveBase>
			</Layout>
		);
	}
}

Main.propTypes = {
	// eslint-disable-next-line
	store: PropTypes.object,
};
