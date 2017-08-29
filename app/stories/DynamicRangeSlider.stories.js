import React, { Component } from "react";
import { ReactiveBase, DynamicRangeSlider, ReactiveList } from "../app";
import ResponsiveStory from "./ResponsiveStory";

require("./list.css");

export default class DynamicRangeSliderDefault extends Component {
	constructor(props) {
		super(props);
		this.onData = this.onData.bind(this);
	}

	componentDidMount() {
		ResponsiveStory();
	}

	onData(markerData) {
		const marker = markerData._source;
		return (
			<a
				className="full_row single-record single_record_for_clone"
				href={marker.event ? marker.event.event_url : ""}
				target="_blank"
				key={markerData._id}
			>
				<div className="text-container full_row" style={{paddingLeft: "15px"}}>
					<div className="text-head text-overflow full_row">
						<span className="text-head-info text-overflow">
							{marker.member ? marker.member.member_name : ""} is going to {marker.event ? marker.event.event_name : ""}
						</span>
						<span className="text-head-city">{marker.group ? marker.group.group_city : ""}</span>
					</div>
					<div className="text-description text-overflow full_row">
						<ul className="highlight_tags">
							{
								marker.group.group_topics.map((tag, i) => (<li key={i}>{tag.topic_name}</li>))
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
				app="reactivemap_demo"
				credentials="y4pVxY2Ok:c92481e2-c07f-4473-8326-082919282c18"
			>
				<div className="row">
					<div className="col s6 col-xs-6">
						<DynamicRangeSlider
							componentId="RangeSensor"
							appbaseField={this.props.mapping.guests}
							stepValue={2}
							title="DynamicRangeSlider"
							{...this.props}
						/>
					</div>

					<div className="col s6 col-xs-6">
						<ReactiveList
							componentId="SearchResult"
							appbaseField={this.props.mapping.topic}
							title="Results"
							sortBy="asc"
							from={0}
							size={20}
							onData={this.onData}
							react={{
								and: "RangeSensor"
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}
}

DynamicRangeSliderDefault.defaultProps = {
	mapping: {
		guests: "guests",
		topic: "group.group_topics.topic_name_raw"
	}
};

DynamicRangeSliderDefault.propTypes = {
	mapping: React.PropTypes.shape({
		guests: React.PropTypes.string,
		topic: React.PropTypes.string
	})
};
