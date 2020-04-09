/* eslint-disable */
import React, { Component } from 'react';
import { ReactiveBase, SingleList, SelectedFilters, ReactiveList } from '@appbaseio/reactivesearch';

import initReactivesearch from '@appbaseio/reactivesearch/lib/server';

import Layout from '../components/Layout';
import BookCard from '../components/BookCard';

const settings = {
	app: 'good-books-ds',
	url: 'https://xe6N9nDRV:51ea7a8a-6354-4b5f-83e1-12dce3b7ec47@arc-cluster-appbase-demo-ps1pgt.searchbase.io',
	enableAppbase: true,
};

const singleListProps = {
	componentId: 'BookSensor',
	dataField: 'original_series.raw',
	defaultValue: 'In Death',
	size: 100,
};

const reactiveListProps = {
	componentId: 'SearchResult',
	dataField: 'original_title.raw',
	className: 'result-list-container',
	from: 0,
	size: 5,
	renderItem: data => <BookCard key={data._id} data={data} />,
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
						...singleListProps,
						source: SingleList,
					},
					{
						...reactiveListProps,
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
			<Layout title="SSR | SingleList">
				<ReactiveBase {...settings} initialState={this.props.store}>
					<div className="row">
						<div className="col">
							<SingleList {...singleListProps} />
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
