import React, { Component } from 'react';
import {
	ReactiveBase,
	DynamicRangeSlider,
	SelectedFilters,
	ReactiveList,
} from '@appbaseio/reactivesearch';
import PropTypes from 'prop-types';

import initReactivesearch from '@appbaseio/reactivesearch/lib/server';

import Layout from '../components/Layout';
import BookCard from '../components/BookCard';

const settings = {
	app: 'good-books-ds',
	url: 'https://xe6N9nDRV:51ea7a8a-6354-4b5f-83e1-12dce3b7ec47@arc-cluster-appbase-demo-ps1pgt.searchbase.io',
	enableAppbase: true,
};

const dynamicRangeSliderProps = {
	componentId: 'BookSensor',
	dataField: 'ratings_count',
	defaultValue: () => ({
		start: 4000,
		end: 8000,
	}),
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
						...dynamicRangeSliderProps,
						source: DynamicRangeSlider,
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
			<Layout title="SSR | DynamicRangeSlider">
				<ReactiveBase {...settings} initialState={this.props.store}>
					<div className="row">
						<div className="col">
							<DynamicRangeSlider {...dynamicRangeSliderProps} />
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
