import React, { Component } from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import {
	ReactiveBase, CategorySearch, ReactiveList, SelectedFilters
} from "../../app/app.js";

class Main extends Component {
	constructor(props) {
		super(props);
		this.onData = this.onData.bind(this);
	}

	onData(res) {
		let result = null;
		if (res) {
			let combineData = res.currentData;
			if (res.mode === "historic") {
				combineData = res.currentData.concat(res.newData);
			} else if (res.mode === "streaming") {
				combineData = helper.combineStreamData(res.currentData, res.newData);
			}
			if (combineData) {
				result = combineData.map((markerData) => {
					const marker = markerData._source;
					return this.itemMarkup(marker, markerData);
				});
			}
		}
		return result;
	}

	itemMarkup(marker, markerData) {
		return (
			<a
				className="full_row single-record single_record_for_clone"
				key={markerData._id}
			>
				<div className="text-container full_row" style={{ paddingLeft: "10px" }}>
					<div className="text-head text-overflow full_row">
						<span className="text-head-info text-overflow">
							{marker.name ? marker.name : ""} - {marker.brand ? marker.brand : ""}
						</span>
						<span className="text-head-city">{marker.brand ? marker.brand : ""}</span>
					</div>
					<div className="text-description text-overflow full_row">
						<ul className="highlight_tags">
							{marker.price ? `Priced at $${marker.price}` : "Free Test Drive"}
						</ul>
					</div>
				</div>
			</a>
		);
	}

	render() {
		return (
			<ReactiveBase
				app="car-store"
				credentials="cf7QByt5e:d2d60548-82a9-43cc-8b40-93cbbe75c34c"
			>
				<div className="row">
					<SelectedFilters componentId="SelectedFilters" />
					<div className="col s6 col-xs-6">
						<CategorySearch
							appbaseField={["name", "color"]}
							categoryField="brand.raw"
							componentId="CarSensor"
							title="CategorySearch"
							weights={[1,5]}
							URLParams={true}
						/>
					</div>

					<div className="col s6 col-xs-6">
						<ReactiveList
							componentId="SearchResult"
							appbaseField="name"
							title="Results"
							sortBy="asc"
							from={0}
							size={20}
							onData={this.onData}
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

ReactDOM.render(<Main />, document.getElementById("app"));
