import React, { Component } from 'react';
import { ReactiveBase, DatePicker, SelectedFilters, ResultCard } from '@appbaseio/reactivesearch';
import PropTypes from 'prop-types';

import initReactivesearch from '@appbaseio/reactivesearch/lib/server';
import moment from 'moment';

import Layout from '../components/Layout';

const dateQuery = (value, props) => {
	let query = null;
	if (value) {
		query = [
			{
				range: {
					[props.dataField]: {
						lte: moment(value).format('YYYYMMDD'),
					},
				},
			},
		];
	}
	return query;
};

const settings = {
	app: 'housing',
	credentials: '0aL1X5Vts:1ee67be1-9195-4f4b-bd4f-a91cd1b5e4b5',
	type: 'listing',
};

const datePickerProps = {
	componentId: 'DateSensor',
	dataField: 'date_from',
	initialMonth: new Date('2017-05-05'),
	customQuery: dateQuery,
	defaultSelected: '2017-05-05',
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
						...datePickerProps,
						type: 'DatePicker',
						source: DatePicker,
					},
					{
						...resultCardProps,
						type: 'ResultCard',
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
			<Layout title="SSR | DatePicker">
				<ReactiveBase {...settings} initialState={this.props.store}>
					<div className="row">
						<div className="col">
							<DatePicker {...datePickerProps} />
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
