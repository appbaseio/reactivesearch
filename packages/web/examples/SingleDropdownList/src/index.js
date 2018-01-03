import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {
	ReactiveBase,
	SingleDropdownList,
	ReactiveList,
	SelectedFilters,
} from '@appbaseio/reactivesearch';

import './index.css';

class Main extends Component {
	render() {
		return (
			<ReactiveBase
				app="reactivemap-demo"
				credentials="qMzzgez0t:a9138c3f-f246-4cd8-ba3d-0b99f9550c05"
				type="meetupdata1"
			>
				<div className="row">
					<div className="col">
						<SingleDropdownList
							componentId="CitySensor"
							dataField="group.group_city.raw"
							title="SingleDropdownList"
							size={100}
							URLParams
						/>
					</div>

					<div className="col">
						<SelectedFilters />
						<ReactiveList
							componentId="SearchResult"
							dataField="name"
							from={0}
							size={20}
							onData={this.onData}
							pagination
							react={{
								and: ['CitySensor'],
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}

	onData(data) {
		return (
			<div key={data._id}>
				<h2>{data.member.member_name}</h2>
				<p>is going to {data.event.event_name} at {data.venue_name_ngrams}</p>
				<p>{data.group_city_ngram}</p>
			</div>
		);
	}
}

ReactDOM.render(<Main />, document.getElementById('root'));
