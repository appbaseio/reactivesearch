import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import { ReactiveBase, DatePicker, ResultCard, SelectedFilters } from '@appbaseio/reactivesearch';

import './index.css';

class Main extends Component {
	render() {
		return (
			<ReactiveBase
				app="airbeds-test-app"
				credentials="X8RsOu0Lp:9b4fe1a4-58c6-4089-a042-505d86d9da30"
				type="listing"
			>
				<div className="row">
					<div className="col">
						<DatePicker
							componentId="DateSensor"
							dataField="date_from"
							customQuery={this.dateQuery}
							initialMonth={new Date('2017-05-05')}
						/>
					</div>

					<div className="col">
						<SelectedFilters />
						<ResultCard
							componentId="SearchResult"
							dataField="name"
							from={0}
							size={40}
							renderData={this.renderData}
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

	dateQuery(value, props) {
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
	}

	renderData(res) {
		return {
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
		};
	}
}

ReactDOM.render(<Main />, document.getElementById('root'));
