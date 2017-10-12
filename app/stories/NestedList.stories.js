import React, { Component } from "react";
import PropTypes from "prop-types";
import { ReactiveBase, NestedList, ReactiveList } from "../app";
import ResponsiveStory from "./ResponsiveStory";

require("./list.css");

export default class NestedListDefault extends Component {
	constructor(props) {
		super(props);
		this.itemMarkup = this.itemMarkup.bind(this);
	}

	componentDidMount() {
		ResponsiveStory();
	}

	itemMarkup(markerData) {
		const marker = markerData._source;
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
					<div className="col s6 col-xs-6">
						<NestedList
							componentId="CategorySensor"
							dataField={["brand.raw", "vehicleType.raw", "model.raw"]}
							title="NestedList"
							{...this.props}
						/>
					</div>

					<div className="col s6 col-xs-6">
						<ReactiveList
							componentId="SearchResult"
							dataField={this.props.mapping.brand}
							title="Results"
							from={0}
							size={20}
							onData={this.itemMarkup}
							react={{
								and: "CategorySensor"
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}
}

NestedListDefault.defaultProps = {
	mapping: {
		brand: "brand.raw",
		model: "model.raw"
	}
};

NestedListDefault.propTypes = {
	mapping: PropTypes.shape({
		brand: PropTypes.string,
		model: PropTypes.string
	})
};
