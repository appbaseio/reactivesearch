import React from 'react';
import { ResultList } from '@appbaseio/reactivesearch';

const ListItemView = data => (
	<ResultList href={data.event.event_url}>
		<ResultList.Image src={data.member.photo} small />
		<ResultList.Content>
			<ResultList.Title>
				<div className="meetup-title">
					{data.member ? data.member.member_name : ''} is going to $
					{data.event ? data.event.event_name : ''}
				</div>
			</ResultList.Title>
			<ResultList.Description>
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
			</ResultList.Description>
		</ResultList.Content>
	</ResultList>
);

export default ListItemView;
