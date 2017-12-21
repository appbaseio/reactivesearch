/* eslint react/prop-types: 0 */
import React, { Component } from "react";
import ReactDOM from "react-dom";

import { ReactiveBase, ReactiveComponent, ReactiveList, SelectedFilters } from "../../src";

class CustomComponent extends Component {
	constructor(props) {
		super(props);
	}

	setValue = value => {
		this.props.setQuery({
			query: {
				term: {
					brand: value
				}
			},
			value
		});
	};

	render() {
		if (this.props.aggregations) {
			return this.props.aggregations["brand.raw"].buckets.map(item => (
				<div key={item.key} onClick={() => this.setValue(item.key)}>
					{item.key}
				</div>
			));
		}

		return null;
	}
}

class Main extends Component {
	onData = data => {
		return (
			<div key={data._id}>
				<h2>{data.name}</h2>
				<p>
					{data.price} - {data.rating} stars rated
				</p>
			</div>
		);
	};

	render() {
		return (
			<ReactiveBase
				app="car-store"
				credentials="cf7QByt5e:d2d60548-82a9-43cc-8b40-93cbbe75c34c"
			>
				<div className="row">
					<div className="col">
						<SelectedFilters />
						<ReactiveComponent
							componentId="CarSensor"
							defaultQuery={{
								aggs: {
									["brand.raw"]: {
										terms: {
											field: "brand.raw",
											order: {
												_count: "desc"
											},
											size: 10
										}
									}
								}
							}}
						>
							<CustomComponent />
						</ReactiveComponent>
					</div>

					<div className="col">
						<ReactiveList
							componentId="SearchResult"
							dataField="name"
							title="ReactiveList"
							from={0}
							size={20}
							onData={this.onData}
							pagination
							react={{
								and: "CarSensor"
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}
}

ReactDOM.render(<Main />, document.getElementById("root"));
