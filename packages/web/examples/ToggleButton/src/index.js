import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { ReactiveBase, ToggleButton, ResultList, SelectedFilters } from '@appbaseio/reactivesearch';

import './index.css';

class Main extends Component {
	render() {
		return (
			<ReactiveBase
				app="meetup_app"
				credentials="lW70IgSjr:87c5ae16-73fb-4559-a29e-0a02760d2181"
			>
				<div className="row">
					<div className="col">
						<ToggleButton
							componentId="CitySensor"
							dataField="group.group_topics.topic_name_raw.raw"
							data={[
								{ label: 'Social', value: 'Social' },
								{ label: 'Adventure', value: 'Adventure' },
								{ label: 'Music', value: 'Music' },
							]}
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
							renderItem={this.meetupList}
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
					{data.member ? data.member.member_name : ''} is going to $
					{data.event ? data.event.event_name : ''}
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
