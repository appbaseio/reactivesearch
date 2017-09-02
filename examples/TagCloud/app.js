import React, { Component } from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import {
	ReactiveBase, TagCloud, ReactiveList, SelectedFilters
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
			}			else if (res.mode === "streaming") {
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
				href={marker.event ? marker.event.event_url : ""}
				target="_blank"
				rel="noopener noreferrer"
				key={markerData._id}
			>
				<div className="text-container full_row" style={{ paddingLeft: "10px" }}>
					<div className="text-head text-overflow full_row">
						<span className="text-head-info text-overflow">
							{marker.member ? marker.member.member_name : ""} is going to {marker.event ? marker.event.event_name : ""}
						</span>
						<span className="text-head-city">{marker.group ? marker.group.group_city : ""}</span>
					</div>
					<div className="text-description text-overflow full_row">
						<ul className="highlight_tags">
							{
								marker.group.group_topics.map(tag => (<li key={tag.topic_name}>{tag.topic_name}</li>))
							}
						</ul>
					</div>
				</div>
			</a>
		);
	}

	render() {
		return (
			<ReactiveBase
				app="meetup_demo"
				credentials="LPpISlEBe:2a8935f5-0f63-4084-bc3e-2b2b4d1a8e02"
				type="meetupdata1"
			>
				<div className="row">
					<SelectedFilters componentId="SelectedFilters" />
					<div className="col s6 col-xs-6">
						<TagCloud
							componentId="CitySensor"
							dataField={this.props.mapping.city}
							title="TagCloud"
							size={100}
							customQuery={this.customQuery}
							URLParams={true}
							multiSelect={true}
							beforeValueChange={() => new Promise((resolve, reject) => resolve())}
						/>
					</div>
					<div className="col s6 col-xs-6">
						<ReactiveList
							componentId="SearchResult"
							dataField={this.props.mapping.topic}
							title="Results"
							sortBy="asc"
							from={0}
							size={20}
							onData={this.onData}
							requestOnScroll
							react={{
								and: ["CitySensor"]
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}
}

Main.defaultProps = {
	mapping: {
		city: "group.group_city.raw",
		topic: "group.group_topics.topic_name_raw"
	}
};

ReactDOM.render(<Main />, document.getElementById("app"));
