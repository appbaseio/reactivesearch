/* eslint-disable */
import React, { Component } from 'react';
import { ReactiveBase, TextField, SelectedFilters, ReactiveList } from '@appbaseio/reactivesearch';

import initReactivesearch from '@appbaseio/reactivesearch/lib/server';

import Layout from '../components/Layout';
import BookCard from '../components/BookCard';

const settings = {
	app: 'good-books-ds',
	credentials: 'nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d',
};

const textFieldProps = {
	dataField: 'original_title.search',
	componentId: 'SearchSensor',
	defaultSelected: 'Harry Potter',
};

const reactiveListProps = {
	componentId: 'SearchResult',
	dataField: 'original_title.raw',
	className: 'result-list-container',
	from: 0,
	size: 5,
	onData: data => <BookCard key={data._id} data={data} />,
	react: {
		and: ['SearchSensor'],
	},
};

export default class Main extends Component {
	static async getInitialProps() {
		return {
			store: await initReactivesearch(
				[
					{
						...textFieldProps,
						type: 'TextField',
						source: TextField,
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
			<Layout title="SSR | TextField">
				<ReactiveBase {...settings} initialState={this.props.store}>
					<div className="row">
						<div className="col">
							<TextField {...textFieldProps} />
						</div>

						<div className="col">
							<SelectedFilters />
							<ReactiveList {...reactiveListProps} />
						</div>
					</div>
				</ReactiveBase>
			</Layout>
		);
	}
}
