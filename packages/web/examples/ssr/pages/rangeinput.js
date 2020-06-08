import React, { Component } from 'react';
import { ReactiveBase, RangeInput, SelectedFilters, ReactiveList } from '@appbaseio/reactivesearch';
import PropTypes from 'prop-types';

import initReactivesearch from '@appbaseio/reactivesearch/lib/server';

import Layout from '../components/Layout';
import BookCard from '../components/BookCard';

const settings = {
	app: 'good-books-ds',
	url: 'https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@arc-cluster-appbase-demo-6pjy6z.searchbase.io',
	enableAppbase: true,
};

const rangeInputProps = {
	componentId: 'BookSensor',
	dataField: 'ratings_count',
	range: {
		start: 3000,
		end: 50000,
	},
	rangeLabels: {
		start: '3K',
		end: '50K',
	},
	defaultValue: {
		start: 4000,
		end: 8000,
	},
};

const reactiveListProps = {
	componentId: 'SearchResult',
	dataField: 'original_title.keyword',
	from: 0,
	size: 10,
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
						...rangeInputProps,
						source: RangeInput,
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
			<Layout title="SSR | RangeInput">
				<ReactiveBase {...settings} initialState={this.props.store}>
					<div className="row">
						<div className="col">
							<RangeInput {...rangeInputProps} />
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

Main.propTypes = {
	// eslint-disable-next-line
	store: PropTypes.object,
};
