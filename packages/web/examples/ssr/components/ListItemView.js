import React from 'react';
import { ResultList } from '@appbaseio/reactivesearch';

const ListItemView = data => (
	<ResultList>
		<ResultList.Image src={data.image} small />
		<ResultList.Content>
			<ResultList.Title>
				<div className="meetup-title">{data.original_title}</div>
			</ResultList.Title>
			<ResultList.Description>
				<div className="flex column">
					<div className="meetup-location">by {data.authors}</div>
					<div className="flex wrap meetup-topics">
						<div className="meetup-topic">{data.language_code}</div>
						<div className="meetup-topic">{data.average_rating} stars</div>
					</div>
				</div>
			</ResultList.Description>
		</ResultList.Content>
	</ResultList>
);

export default ListItemView;
