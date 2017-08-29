import React, { Component } from "react";
import { ReactiveBase, ToggleList, ResultList } from "../app";
import ResponsiveStory from "./ResponsiveStory";

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
	}

	componentDidMount() {
		ResponsiveStory();
	}

	onData(res) {
		return {
			image: res.member.photo,
			image_size: "small",
			title: res.member.member_name,
			desc: (
				<div>
					<p>is going to {res.event.event_name} at {res.venue_name_ngrams}</p>
					<p>{res.group_city_ngram}</p>
				</div>
			),
			url: res.event.event_url
		};
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
						<ResultList
							componentId="SearchResult"
							appbaseField="name"
							from={0}
							size={40}
							onData={this.onData}
							pagination={true}
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
