import React, { Component } from "react";
import { render } from "react-dom";
import {
	ReactiveBase,
	GeoDistanceDropdown,
	ResultList,
	ReactiveMap
} from "../../app/app.js";

require("./meetup.scss");

class Main extends Component {
	onData(res) {
		const result = {
			image: res.member.photo,
			title: `${res.member.member_name} is going to ${res.event.event_name}`,
			desc: `${res.venue_name_ngrams} ${res.group_city_ngram}`,
			url: res.event.event_url
		};
		return result;
	}

	render() {
		return (
			<ReactiveBase
				app="reactivemap_demo"
				credentials="y4pVxY2Ok:c92481e2-c07f-4473-8326-082919282c18"
				type="meetupdata1"
			>
				<header>
					<h2>Meetup Blast</h2>
					<div className="filter-container">
						<GeoDistanceDropdown
							componentId="GeoDistanceDropdown"
							appbaseField="location"
							unit="mi"
							data={[
								{ start: 1, end: 100, label: "Less than 100 miles" },
								{ start: 101, end: 200, label: "Between 100 and 200 miles" },
								{ start: 201, end: 500, label: "Between 200 and 500 miles" },
								{ start: 501, end: 1000, label: "Above 500 miles" }
							]}
							defaultSelected={{
								label: "Less than 100 miles",
								location: "London"
							}}
						/>
					</div>
				</header>
				<section className="result-wrapper clearfix">
					<div className="left-col">
						<ResultList
							componentId="SearchResult"
							appbaseField="event.event_name"
							from={0}
							size={50}
							onData={this.onData}
							showPagination={true}
							react={{
								and: "GeoDistanceDropdown"
							}}
						/>
					</div>
					<div className="right-col">
						<ReactiveMap
							appbaseField="location"
							defaultZoom={13}
							defaultCenter={{ lat: 37.74, lon: -122.45 }}
							historicalData={true}
							setMarkerCluster={false}
							showMapStyles={false}
							showSearchAsMove={false}
							defaultMapStyle="Light Monochrome"
							autoCenter={true}
							size={100}
							react={{
								and: "GeoDistanceDropdown"
							}}
						/>
					</div>
				</section>
			</ReactiveBase>
		);
	}
}

render(<Main />, document.getElementById("app"));
