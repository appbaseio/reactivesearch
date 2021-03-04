/* eslint-disable */
import React, { Component } from 'react';
import {
	ReactiveBase,
	SingleDataList,
	SelectedFilters,
	ReactiveList,
} from '@appbaseio/reactivesearch';

import initReactivesearch from '@appbaseio/reactivesearch/lib/server';

import Layout from '../components/Layout';
import ListItemView from '../components/ListItemView';

const settings = {
	app: 'meetup_app',
	url:
		'https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io',
	enableAppbase: true
};

const singleDataListProps = {
	componentId: 'CitySensor',
	dataField: 'group.group_topics.topic_name_raw.keyword',
	data: [
		{ label: 'Open Source', value: 'Open Source' },
		{ label: 'Social', value: 'Social' },
		{ label: 'Adventure', value: 'Adventure' },
		{ label: 'Music', value: 'Music' },
	],
	defaultValue: 'Social',
};

const resultListProps = {
	componentId: 'SearchResult',
	dataField: 'group.group_topics.topic_name_raw.keyword',
	title: 'Results',
	sortBy: 'asc',
	className: 'result-list-container',
	from: 0,
	size: 5,
	render: ({ data }) => (
		<ReactiveList.ResultListWrapper>
			{data.map(item => (
				<ListItemView key={item._id} {...item} />
			))}
		</ReactiveList.ResultListWrapper>
	),
	pagination: true,
	react: {
		and: ['CitySensor'],
	},
};

export default class Main extends Component {
	static async getInitialProps() {
		return {
			store: await initReactivesearch(
				[
					{
						...singleDataListProps,
						source: SingleDataList,
					},
					{
						...resultListProps,
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
			<Layout title="SSR | SingleDataList">
				<ReactiveBase {...settings} initialState={this.props.store}>
					<div className="row">
						<div className="col">
							<SingleDataList {...singleDataListProps} />
						</div>

						<div className="col">
							<SelectedFilters />
							<ReactiveList {...resultListProps} />
						</div>
					</div>
				</ReactiveBase>
			</Layout>
		);
	}
}
