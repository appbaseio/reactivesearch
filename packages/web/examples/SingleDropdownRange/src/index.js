import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {
	ReactiveBase,
	SingleDropdownRange,
	ReactiveList,
	SelectedFilters,
} from '@appbaseio/reactivesearch';

import './index.css';

class Main extends Component {
	render() {
		return (
			<ReactiveBase
				app="car-store"
				credentials="cf7QByt5e:d2d60548-82a9-43cc-8b40-93cbbe75c34c"
			>
				<div className="row">
					<div className="col">
						<SingleDropdownRange
							componentId="PriceSensor"
							dataField="price"
							title="SingleDropdownRange"
							data={
								[{ start: 0, end: 100, label: 'Cheap' },
									{ start: 101, end: 200, label: 'Moderate' },
									{ start: 201, end: 500, label: 'Pricey' },
									{ start: 501, end: 1000, label: 'First Date' }]
							}
							URLParams
						/>
					</div>

					<div className="col">
						<SelectedFilters />
						<ReactiveList
							componentId="SearchResult"
							dataField="name"
							title="ReactiveList"
							from={0}
							size={20}
							onData={this.onData}
							pagination
							react={{
								and: 'PriceSensor',
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
				<h2>{data.name}</h2>
				<p>{data.price} - {data.rating} stars rated</p>
			</div>
		);
	}
}

ReactDOM.render(<Main />, document.getElementById('root'));
