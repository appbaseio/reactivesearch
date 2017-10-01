import React, { Component } from "react";
import PropTypes from 'prop-types';
import { ReactiveBase, RatingsFilter, ResultCard, ResultList, ViewSwitcher } from "../app";
import ResponsiveStory from "./ResponsiveStory";

require("./list.css");

export default class ViewSwitcherDefault extends Component {
	constructor(props) {
		super(props);
		this.onData = this.onData.bind(this);
	}

	componentDidMount() {
		ResponsiveStory();
	}

	onData(res) {
		const result = {
			image: "https://www.enterprise.com/content/dam/global-vehicle-images/cars/FORD_FOCU_2012-1.png",
			title: res.name,
			rating: res.rating,
			desc: res.brand,
			url: "#"
		};
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
				credentials="cf7QByt5e:d2d60548-82a9-43cc-8b40-93cbbe75c34c"
			>
				<div className="row">
					<div className="col s6 col-xs-6">
						<RatingsFilter
							componentId="RatingsSensor"
							dataField={this.props.mapping.rating}
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
						<ViewSwitcher
							data={[
								{
									label: "Grid",
									value: "rbc-resultcard"
								},
								{
									label: "List",
									value: "rbc-resultlist"
								}
							]}
							defaultSelected="rbc-resultcard"
						/>
						<ResultCard
							componentId="SearchResult"
							dataField={this.props.mapping.name}
							title="Results"
							from={0}
							size={20}
							onData={this.onData}
							react={{
								and: "RatingsSensor"
							}}
						/>
						<ResultList
							componentId="SearchResult"
							dataField={this.props.mapping.name}
							title="Results"
							from={0}
							size={20}
							onData={this.onData}
							sortOptions={[
								{
									label: "Lowest Price First",
									dataField: "price",
									sortBy: "asc"
								},
								{
									label: "Highest Price First",
									dataField: "price",
									sortBy: "desc"
								},
								{
									label: "Most rated",
									dataField: "rating",
									sortBy: "desc"
								}
							]}
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

ViewSwitcherDefault.defaultProps = {
	mapping: {
		rating: "rating",
		name: "name"
	}
};

ViewSwitcherDefault.propTypes = {
	mapping: PropTypes.shape({
		rating: PropTypes.string,
		name: PropTypes.string
	})
};
