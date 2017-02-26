import React, { Component } from "react";
import { ReactiveBase, RatingsFilter, ReactiveList, AppbaseSensorHelper as helper } from "../app";

require("./list.css");

export default class RatingsFilterDefault extends Component {
	constructor(props) {
		super(props);
		this.onData = this.onData.bind(this);
	}

	componentDidMount() {
		helper.ResponsiveStory();
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
							{`Rated ${marker.rating}`}
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
				username="cf7QByt5e"
				password="d2d60548-82a9-43cc-8b40-93cbbe75c34c"
			>
				<div className="row">
					<div className="col s6 col-xs-6">
						<RatingsFilter
							componentId="RatingsSensor"
							appbaseField={this.props.mapping.rating}
							title="RatingsFilter"
							data={
							[{ start: 4, end: 5, label: "4 stars and up" },
								{ start: 3, end: 5, label: "3 stars and up" },
								{ start: 2, end: 5, label: "2 stars and up" },
								{ start: 1, end: 5, label: "> 1 stars" }]
							}
							{...this.props}
						/>
					</div>

					<div className="col s6 col-xs-6">
						<ReactiveList
							componentId="SearchResult"
							appbaseField={this.props.mapping.name}
							title="Results"
							from={0}
							size={20}
							onData={this.onData}
							react={{
								and: "RatingsSensor"
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}
}

RatingsFilterDefault.defaultProps = {
	mapping: {
		rating: "rating",
		name: "name"
	}
};

RatingsFilterDefault.propTypes = {
	mapping: React.PropTypes.shape({
		rating: React.PropTypes.number,
		name: React.PropTypes.string
	})
};
