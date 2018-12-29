import React from 'react';

const ListItemView = data => ({
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
});

export default ListItemView;
