import React, { Component } from "react";
import { render } from "react-dom";
import {
	ReactiveBase,
	DataSearch,
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

	onPopoverTrigger(marker) {
		return (<div className="row" style={{ margin: "0", maxWidth: "300px", paddingTop: 10 }}>
			<div className="col s12">
				<div>
					<strong>{marker._source.member.member_name}</strong>
				</div>
				<p style={{ margin: "5px 0", lineHeight: "18px" }}>is going to&nbsp;
					<a href={marker._source.event.event_url} target="_blank">
						{marker._source.event.event_name}
					</a>
				</p>
			</div>
		</div>);
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
					<div className="filter-container row">
						<div className="col s4">
							<DataSearch
								componentId="TopicSensor"
								placeholder="Search for topics..."
								appbaseField="group.group_topics.topic_name_raw.raw"
								searchInputId="TopicSearch"
							/>
						</div>
						<div className="col s8">
							<GeoDistanceDropdown
								componentId="GeoSensor"
								appbaseField="location"
								placeholder="Search for location..."
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
								and: "GeoSensor"
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
							onPopoverTrigger={this.onPopoverTrigger}
							autoCenter={true}
							size={100}
							react={{
								and: ["GeoSensor", "TopicSensor"]
							}}
						/>
					</div>
				</section>
			</ReactiveBase>
		);
	}
}

render(<Main />, document.getElementById("app"));
