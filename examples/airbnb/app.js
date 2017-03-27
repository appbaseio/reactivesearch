import React, { Component } from "react";
import ReactDOM from "react-dom";
import { ReactiveBase, ToggleList, ReactiveMap, DataSearch, RangeSlider, ResultCard } from "../../app/app.js";

require("./airbnb.scss");

class Main extends Component {
	constructor(props) {
		super(props);
		this.onData = this.onData.bind(this);
		this.onPopoverTrigger = this.onPopoverTrigger.bind(this);
		this.roomQuery = this.roomQuery.bind(this);
	}

	roomQuery(record) {
		if(record) {
			let query = null;

			function generateMatchQuery() {
				return record.map(singleRecord => ({
					match: {
						room_type: singleRecord.value
					}
				}));
			}

			if (record && record.length) {
				query = {
					bool: {
						should: generateMatchQuery(),
						minimum_should_match: 1,
						boost: 1.0
					}
				};
				return query;
			}
			return query;
		}
	}

	onData(res) {
		return {
			image: res.image,
			title: res.name,
			desc: (
				<div>
					<div className="price">${res.price}</div>
					<span className="host" style={{"backgroundImage": `url(${res.host_image})`}}></span>
					<p>{res.room_type} · {res.accommodates} guests</p>
				</div>
			),
			url: res.listing_url
		};
	}

	onPopoverTrigger(marker) {
		return (<div className="popover row">
			<div className="listing">
				<div className="listing__image" style={{"backgroundImage": `url(${marker._source.image})`}}></div>
				<div className="listing__info clearfix">
					<span className="col s12">
						{marker._source.name}
					</span>
					<p className="col s12">
						{marker._source.room_type} · {marker._source.accommodates} guests
					</p>
				</div>
			</div>
		</div>);
	}

	render() {
		return (
			<div className="row" style={{"margin": "0"}}>
				<ReactiveBase
					app="airbnb"
					credentials="CvRG9OoFe:ac31bf6d-b5a8-4410-a916-81b47c609dbc"
					type="listing"
				>
					<nav>
						<div className="col s3">
							<a href="#" className="brand">Airbnb</a>
						</div>
						<div className="col s9">
							<DataSearch
								appbaseField={this.props.mapping.name}
								componentId="PlaceSensor"
								placeholder="Search for houses..."
								react={{
									and: ["PriceSensor"]
								}}
							/>
						</div>
					</nav>
					<div className="row clearfix">
						<div className="left">
							<div className="col s12 sensor-wrapper">
								<ToggleList
									appbaseField="room_type"
									componentId="RoomTypeSensor"
									title="Room Type"
									data={[
										{
											label: "Entire Home/Apt",
											value: "Entire home/apt"
										}, {
											label: "Private Room",
											value: "Private room"
										}, {
											label: "Shared Room",
											value: "Shared room"
										}
									]}
									customQuery={this.roomQuery}
								/>
								<RangeSlider
									componentId="PriceSensor"
									appbaseField={this.props.mapping.price}
									title="Price Range"
									defaultSelected={{
										"start": 30,
										"end": 50
									}}
									stepValue={20}
									range={{
										start: 30,
										end: 150
									}}
									rangeLabels={{
										start: "$30",
										end: "$150"
									}} />
							</div>

							<div className="col s12">
								<div className="row">
									<ResultCard
										componentId="SearchResult"
										appbaseField={this.props.mapping.name}
										from={0}
										size={60}
										onData={this.onData}
										react={{
											and: ["PlaceSensor", "RoomTypeSensor", "PriceSensor"]
										}}
									/>
								</div>
							</div>
						</div>
						<div className="right">
							<ReactiveMap
								appbaseField={this.props.mapping.location}
								setMarkerCluster={false}
								defaultMapStyle={this.props.mapStyle}
								showMapStyles={false}
								autoCenter={true}
								showSearchAsMove={false}
								title="Properties in Seattle"
								showPopoverOn="click"
								onPopoverTrigger={this.onPopoverTrigger}
								defaultZoom={15}
								size={60}
								defaultCenter={{ lat: 47.6062, lng: -122.3321 }}
								react={{
									and: ["PlaceSensor", "PriceSensor"]
								}}
							/>
						</div>
					</div>
				</ReactiveBase>
			</div>
		);
	}
}

Main.defaultProps = {
	mapStyle: "Blue Water",
	mapping: {
		name: "name",
		location: "location",
		price: "price"
	}
};

ReactDOM.render(<Main />, document.getElementById("app"));
