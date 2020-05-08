import React, { Component } from 'react';
import {
	ReactiveBase,
	RangeSlider,
	SelectedFilters,
	ReactiveList,
} from '@appbaseio/reactivesearch';
import PropTypes from 'prop-types';

import initReactivesearch from '@appbaseio/reactivesearch/lib/server';

import Layout from '../components/Layout';
import BookCard from '../components/BookCard';

const settings = {
	app: 'good-books-ds',
	url: 'https://IkwcRqior:cda6348c-37c9-40f6-a144-de3cb18b57a0@arc-cluster-appbase-tryout-k8dsnj.searchbase.io',
	enableAppbase: true,
};

const rangeSliderProps = {
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
	dataField: 'original_title',
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
						...rangeSliderProps,
						source: RangeSlider,
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
			<Layout title="SSR | RangeSlider">
				<ReactiveBase {...settings} initialState={this.props.store}>
					<div className="row">
						<div className="col">
							<RangeSlider {...rangeSliderProps} />
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
