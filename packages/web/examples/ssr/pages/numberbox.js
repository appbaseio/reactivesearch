/* eslint-disable */
import React, { Component } from 'react';
import {
	ReactiveBase,
	NumberBox,
	SelectedFilters,
	ReactiveList,
} from '@appbaseio/reactivesearch';

import initReactivesearch from '@appbaseio/reactivesearch/lib/server';

import Layout from '../components/Layout';
import BookCard from '../components/BookCard';

const settings = {
	app: 'good-books-ds',
	credentials: 'nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d',
};

const numberBoxProps = {
	componentId: 'BookSensor',
	dataField: 'average_rating_rounded',
	data: {
		label: 'Book Rating',
		start: 2,
		end: 5,
	},
	showFilter: false,
	defaultSelected: 3,
};

const reactiveListProps = {
	componentId: 'SearchResult',
	dataField: 'original_title.raw',
	className: 'result-list-container',
	from: 0,
	size: 5,
	onData: data => (<BookCard key={data._id} data={data} />),
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
						...numberBoxProps,
						type: 'NumberBox',
						source: NumberBox,
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
			<Layout title="SSR | NumberBox">
				<ReactiveBase {...settings} initialState={this.props.store}>
					<div className="row">
						<div className="col">
							<NumberBox
								{...numberBoxProps}
							/>
						</div>

						<div className="col">
							<SelectedFilters />
							<ReactiveList
								{...reactiveListProps}
							/>
						</div>
					</div>
				</ReactiveBase>
			</Layout>
		);
	}
}
