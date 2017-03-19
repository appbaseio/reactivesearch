import React, { Component } from "react";
import { ReactiveBase, ToggleList, ReactiveList, AppbaseSensorHelper as helper } from "../app";

require("./list.css");

export default class ToggleListDefault extends Component {
	constructor(props) {
		super(props);

		this.toggleData = [{
			label: "Social",
			value: "Social"
		}, {
			label: "Travel",
			value: "Travel"
		}, {
			label: "Outdoors",
			value: "Outdoors"
		}];

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
								marker.group.group_topics.map(tag => (
									<li key={tag.topic_name}>{tag.topic_name}</li>
								))
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
			>
				<div className="row">
					<div className="col s6 col-xs-6">
						<ToggleList
							appbaseField={this.props.mapping.topic}
							componentId="MeetupTops"
							title="ToggleList"
							data={this.toggleData}
							{...this.props}
						/>
					</div>

					<div className="col s6 col-xs-6">
						<ReactiveList
							componentId="SearchResult"
							appbaseField="group.group_topics.topic_name_raw"
							title="Results"
							sortBy="asc"
							from={0}
							size={20}
							onData={this.onData}
							react={{
								and: "MeetupTops"
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}
}

ToggleListDefault.defaultProps = {
	mapping: {
		topic: "group.group_topics.topic_name_raw.raw"
	}
};

ToggleListDefault.propTypes = {
	mapping: React.PropTypes.shape({
		topic: React.PropTypes.string
	})
};
