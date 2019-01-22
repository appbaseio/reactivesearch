import React, { Component } from 'react';
import { ReactiveBase, DateRange, SelectedFilters, ResultCard } from '@appbaseio/reactivesearch';
import PropTypes from 'prop-types';

import initReactivesearch from '@appbaseio/reactivesearch/lib/server';
import moment from 'moment';

import Layout from '../components/Layout';

const dateQuery = (value) => {
	let query = null;
	if (value) {
		query = [
			{
				range: {
					date_from: {
						gte: moment(value.start).format('YYYYMMDD'),
					},
				},
			},
			{
				range: {
					date_to: {
						lte: moment(value.end).format('YYYYMMDD'),
					},
				},
			},
		];
	}
	return query;
};

const settings = {
	app: 'airbeds-test-app',
	credentials: 'X8RsOu0Lp:9b4fe1a4-58c6-4089-a042-505d86d9da30',
	type: 'listing',
};

const dateRangeProps = {
	componentId: 'DateSensor',
	dataField: 'date_from',
	initialMonth: new Date('2017-05-05'),
	customQuery: dateQuery,
	defaultValue: {
		start: '2017-05-05',
		end: '2017-05-10',
	},
};

const resultCardProps = {
	componentId: 'SearchResult',
	dataField: 'name',
	className: 'result-list-container',
	from: 0,
	size: 40,
	onData: res => ({
		image: res.image,
		title: res.name,
		description: (
			<div>
				<div>${res.price}</div>
				<span style={{ backgroundImage: `url(${res.host_image})` }} />
				<p>
					{res.room_type} · {res.accommodates} guests
				</p>
			</div>
		),
		url: res.listing_url,
	}),
	react: {
		and: ['DateSensor'],
	},
	showPagination: true,
};

export default class Main extends Component {
	static async getInitialProps() {
		return {
			store: await initReactivesearch(
				[
					{
						...dateRangeProps,
						source: DateRange,
					},
					{
						...resultCardProps,
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
			<Layout title="SSR | DateRange">
				<ReactiveBase {...settings} initialState={this.props.store}>
					<div className="row">
						<div className="col">
							<DateRange {...dateRangeProps} />
						</div>

						<div className="col">
							<SelectedFilters />
							<ResultCard {...resultCardProps} />
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
