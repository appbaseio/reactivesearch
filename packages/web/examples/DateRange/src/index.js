import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {
	ReactiveBase,
	DateRange,
	ResultCard,
	SelectedFilters,
} from '@appbaseio/reactivesearch';

import './index.css';

class Main extends Component {
	dateQuery(value) {
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
	}

	onData(res) {
		return {
			image: res.image,
			title: res.name,
			description: (
				<div>
					<div>${res.price}</div>
					<span style={{ backgroundImage: `url(${res.host_image})` }} />
					<p>{res.room_type} · {res.accommodates} guests</p>
				</div>
			),
			url: res.listing_url,
		};
	}

	render() {
		return (
			<ReactiveBase
				app="housing"
				credentials="0aL1X5Vts:1ee67be1-9195-4f4b-bd4f-a91cd1b5e4b5"
				type="listing"
			>
				<div className="row">
					<div className="col">
						<DateRange
							componentId="DateSensor"
							dataField="date_from"
							customQuery={this.dateQuery}
							initialMonth={new Date('2017-05-05')}
						/>
					</div>

					<div className="col">
						<SelectedFilters componentId="DateSensor" />
						<ResultCard
							componentId="SearchResult"
							dataField="name"
							from={0}
							size={40}
							onData={this.onData}
							showPagination
							react={{
								and: ['DateSensor'],
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}
}

ReactDOM.render(<Main />, document.getElementById('root'));
