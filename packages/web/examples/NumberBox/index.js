import React, { Component } from "react";
import ReactDOM from "react-dom";

import {
	ReactiveBase,
	NumberBox,
	ReactiveList,
	SelectedFilters
} from "../../src";

class Main extends Component {
	onData = (res) => {
		const data = res._source;
		return (<div key={res._id}>
			<h2>{data.name}</h2>
			<p>{data.price} - {data.rating} stars rated</p>
		</div>);
	}

	render() {
		return (
			<ReactiveBase
				app="car-store"
				credentials="cf7QByt5e:d2d60548-82a9-43cc-8b40-93cbbe75c34c"
			>
				<div className="row">
					<div className="col">
						<NumberBox
							dataField="rating"
							componentId="CarSensor"
							defaultSelected={3}
							data={{
								label: "Car Ratings",
								start: 2,
								end: 5
							}}
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
