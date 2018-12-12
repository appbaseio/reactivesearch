import React from 'react';
import { ResultList, SelectedFilters } from '@appbaseio/reactivesearch';

import Topic from '../styles/Topic';
import Flex from '../styles/Flex';

const onData = res => ({
	title: res.name,
	description: (
		<div>
			<p style={{ marginBottom: 5 }}>{res.tagline}</p>
			<Flex justifyContent="space-between" responsive>
				<Flex>
					{res.categories.map(topic => (
						<Topic key={topic}>{topic}</Topic>
					))}
				</Flex>
				<Flex>
					<Topic hollow>
						<i className="fa fa-caret-up" /> {res.votes_count}
					</Topic>
					<Topic hollow>
						<i className="fa fa-comment" /> {res.comments_count}
					</Topic>
				</Flex>
			</Flex>
		</div>
	),
});

const onResultStats = stats =>
	<div style={{ margin: '10px 0' }}>{`Found ${stats.totalResults} results in ${stats.time} milliseconds`}</div>;
);

const Results = () => (
	<div>
		<SelectedFilters />
		<ResultList
			componentId="results"
			dataField="name"
			react={{
				and: ['categories', 'search'],
			}}
			onData={onData}
			onResultStats={onResultStats}
			innerClass={{
				listItem: 'list-item',
			}}
		/>
	</div>
);

export default Results;
