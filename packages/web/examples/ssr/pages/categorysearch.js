/* eslint-disable */
import React, { Component } from 'react';
import {
	ReactiveBase,
	CategorySearch,
	SelectedFilters,
	ReactiveList,
} from '@appbaseio/reactivesearch';

import initReactivesearch from '@appbaseio/reactivesearch/lib/server';

import Layout from '../components/Layout';
import BookCard from '../components/BookCard';

const settings = {
	app: 'good-books-ds',
	url: 'https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@arc-cluster-appbase-demo-6pjy6z.searchbase.io',
	enableAppbase: true,
};

const categorySearchProps = {
	dataField: ['original_title', 'original_title.search'],
	categoryField: 'authors.keyword',
	componentId: 'BookSensor',
	defaultValue: 'Harry',
};

const reactiveListProps = {
	componentId: 'SearchResult',
	dataField: 'original_title',
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
						...categorySearchProps,
						source: CategorySearch,
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
			<Layout title="SSR | CategorySearch">
				<ReactiveBase {...settings} initialState={this.props.store}>
					<div className="row">
						<div className="col">
							<CategorySearch {...categorySearchProps} />
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
