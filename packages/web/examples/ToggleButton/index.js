import React, { Component } from "react";
import ReactDOM from "react-dom";

import {
	ReactiveBase,
	ToggleButton,
	ReactiveList,
	SelectedFilters
} from "../../src";

class Main extends Component {
	onData = (data) => {
		return (<div key={data._id}>
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
						<ToggleButton
							dataField="brand.raw"
							componentId="CarSensor"
							data={[
								{ label: "Audi", value: "audi" },
								{ label: "Nissan", value: "nissan" },
								{ label: "Porsche", value: "porsche" },
								{ label: "BMW", value: "bmw" }
							]}
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
