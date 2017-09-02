import React, { Component } from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import {
	ReactiveBase,
	DateRange,
	MultiDataList,
	NumberBox,
	ReactiveMap,
	DataSearch,
	RangeSlider,
	ResultCard
} from "../../app/app.js";

require("./airbnb.scss");

class Main extends Component {
	roomQuery(record) {
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
					app="housing"
					credentials="0aL1X5Vts:1ee67be1-9195-4f4b-bd4f-a91cd1b5e4b5"
					type="listing"
					theme="rbc-red"
				>
					<nav>
						<div className="col s3">
							<a href="/examples/airbeds" className="brand">Airbeds</a>
						</div>
						<div className="col s9">
							<DataSearch
								dataField={this.props.mapping.name}
								componentId="PlaceSensor"
								placeholder="Search for houses with airbeds"
							/>
						</div>
					</nav>
					<div className="row clearfix">
						<div className="left">
							<div className="col s12 sensor-wrapper">
								<div className="col s6">
									<DateRange
										componentId="DateRangeSensor"
										dataField={["date_from", "date_to"]}
										title="When"
										numberOfMonths={1}
										queryFormat="basic_date"
										extra={{
											initialVisibleMonth: () => moment("2017-04-01")
										}}
									/>
								</div>
								<div className="col s6">
									<NumberBox
										componentId="GuestSensor"
										dataField="accommodates"
										title="Guests"
										defaultSelected={2}
										data={{
											start: 1,
											end: 16
										}}
									/>
								</div>
								<MultiDataList
									dataField="room_type"
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
									dataField={this.props.mapping.price}
									title="Price Range"
									defaultSelected={{
										start: 10,
										end: 50
									}}
									stepValue={10}
									range={{
										start: 10,
										end: 250
									}}
									rangeLabels={{
										start: "$10",
										end: "$250"
									}}
									react={{
											and: ["PlaceSensor", "DateRangeSensor", "GuestSensor", "RoomTypeSensor"]
										}}
									/>
							</div>

							<div className="col s12">
								<div className="row">
									<ResultCard
										componentId="SearchResult"
										dataField={this.props.mapping.name}
										from={0}
										pages={10}
										size={10}
										onData={this.onData}
										pagination={true}
										react={{
											and: ["PlaceSensor", "DateRangeSensor", "GuestSensor", "RoomTypeSensor", "PriceSensor"]
										}}
									/>
								</div>
							</div>
						</div>
						<div className="right">
							<ReactiveMap
								dataField={this.props.mapping.location}
								setMarkerCluster={false}
								defaultMapStyle={this.props.mapStyle}
								showMapStyles={false}
								autoCenter={true}
								showSearchAsMove={false}
								title="Airbeds in Seattle"
								showPopoverOn="click"
								onPopoverTrigger={this.onPopoverTrigger}
								defaultZoom={15}
								size={50}
								defaultCenter={{ lat: 47.6062, lng: -122.3321 }}
								react={{
									and: ["PlaceSensor", "DateRangeSensor", "GuestSensor", "RoomTypeSensor", "PriceSensor"]
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
