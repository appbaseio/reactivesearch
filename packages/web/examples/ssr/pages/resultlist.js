/* eslint-disable */
import React, { Component } from 'react';
import {
	ReactiveBase,
	ToggleButton,
	SelectedFilters,
	ResultList,
} from '@appbaseio/reactivesearch';

import initReactivesearch from '@appbaseio/reactivesearch/lib/server';

import Layout from '../components/Layout';
import ListItemView from '../components/ListItemView';

const settings = {
	app: 'meetup_demo',
	credentials: 'LPpISlEBe:2a8935f5-0f63-4084-bc3e-2b2b4d1a8e02',
	type: 'meetupdata1',
};

const toggleButtonProps = {
	componentId: 'CitySensor',
	dataField: 'group.group_topics.topic_name_raw.raw',
	data: [
		{ label: 'Social', value: 'Social' },
		{ label: 'Adventure', value: 'Adventure' },
		{ label: 'Music', value: 'Music' },
	],
	defaultSelected: 'Social',
};

const resultListProps = {
	componentId: 'SearchResult',
	dataField: 'group.group_topics.topic_name_raw',
	title: 'Results',
	sortBy: 'asc',
	className: 'result-list-container',
	from: 0,
	size: 5,
	onData: ListItemView,
	pagination: true,
	react: {
		and: ['CitySensor']
	},
};

export default class Main extends Component {
	static async getInitialProps() {
		return {
			store: await initReactivesearch(
				[
					{
						...toggleButtonProps,
						type: 'ToggleButton',
						source: ToggleButton,
					},
					{
						...resultListProps,
						type: 'ResultList',
						source: ResultList,
					},
				],
				null,
				settings,
			),
		};
	}

	render() {
		return (
			<Layout title="SSR | ToggleButton">
				<ReactiveBase {...settings} initialState={this.props.store}>
					<div className="row">
						<div className="col">
							<ToggleButton
								{...toggleButtonProps}
							/>
						</div>
						<div className="col">
							<SelectedFilters />
							<ResultList
								{...resultListProps}
							/>
						</div>
					</div>
				</ReactiveBase>
			</Layout>
		);
	}
}
