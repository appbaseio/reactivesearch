import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { ReactiveBase, TagCloud, ResultList, SelectedFilters } from '@appbaseio/reactivesearch';

import './index.css';

class Main extends Component {
	render() {
		return (
			<ReactiveBase
				app="meetup_demo"
				credentials="LPpISlEBe:2a8935f5-0f63-4084-bc3e-2b2b4d1a8e02"
				type="meetupdata1"
			>
				<div className="row">
					<div className="col">
						<TagCloud
							title="TagCloud"
							componentId="CitySensor"
							dataField="group.group_city.raw"
							multiSelect
							size={50}
						/>
					</div>
					<div className="col">
						<SelectedFilters />
						<ResultList
							componentId="SearchResult"
							dataField="group.group_topics.topic_name_raw"
							title="Results"
							sortBy="asc"
							className="result-list-container"
							from={0}
							size={5}
							onData={this.meetupList}
							innerClass={{
								image: 'meetup-list-image',
							}}
							pagination
							react={{
								and: ['CitySensor'],
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}

	meetupList(data) {
		return {
			title: (
				<div className="meetup-title">
					{data.member ? data.member.member_name : ''} is going to ${data.event
						? data.event.event_name
						: ''}
				</div>
			),
			image: data.member.photo,
			image_size: 'small',
			description: (
				<div className="flex column">
					<div className="meetup-location">
						<span className="location">
							<i className="fas fa-map-marker-alt" />
						</span>
						{data.group ? data.group.group_city : ''}
					</div>
					<div className="flex wrap meetup-topics">
						{data.group.group_topics.slice(0, 4).map(tag => (
							<div className="meetup-topic" key={tag.topic_name}>
								{tag.topic_name}
							</div>
						))}
					</div>
				</div>
			),
			url: data.event.event_url,
		};
	}
}

ReactDOM.render(<Main />, document.getElementById('root'));
