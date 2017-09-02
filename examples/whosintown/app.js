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
				<div className="mobile-banner">
					<p>Sorry, this app isn't compatible with this resolution.</p>
					<p>Please view it on desktop.</p>
					<p><a href="https://opensource.appbase.io/reactivesearch">Click here to go back</a></p>
				</div>
				<header>
					<h2>Who's in town</h2>
					<div className="filter-container row">
						<div className="col s4">
							<DataSearch
								componentId="TopicSensor"
								placeholder="Search for Topics"
								dataField="group.group_topics.topic_name_raw"
								searchInputId="TopicSearch"
								react={{
									and: "GeoSensor"
								}}
							/>
						</div>
						<div className="col s8">
							<GeoDistanceDropdown
								componentId="GeoSensor"
								dataField="location"
								placeholder="In location"
								autoLocation={false}
								unit="mi"
								data={[
									{ start: 1, end: 10, label: "Within 10 miles" },
									{ start: 1, end: 100, label: "Within 100 miles" },
									{ start: 1, end: 250, label: "Within 250 miles" },
									{ start: 1, end: 500, label: "Within 500 miles" }
								]}
								defaultSelected={{
									"location": "London",
									"label": "Within 10 miles"
								}}
								react={{
									and: "TopicSensor"
								}}
							/>
						</div>
					</div>
				</header>
				<section className="result-wrapper clearfix">
					<div className="left-col">
						<ResultList
							componentId="SearchResult"
							dataField="event.event_name"
							from={0}
							size={10}
							onData={this.onData}
							pagination={true}
							react={{
								and: ["GeoSensor", "TopicSensor"]
							}}
						/>
					</div>
					<div className="right-col">
						<ReactiveMap
							dataField="location"
							defaultZoom={13}
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
