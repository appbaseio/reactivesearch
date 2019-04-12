import React from 'react';
import { ResultList, SelectedFilters, ReactiveList } from '@appbaseio/reactivesearch';

import Topic from '../styles/Topic';
import Flex from '../styles/Flex';

const renderResultStats = ({ numberOfResults, time }) => (
	<div style={{ margin: '10px 0' }}>{`Found ${numberOfResults} results in ${time} milliseconds`}</div>
);

const Results = () => (
	<div>
		<SelectedFilters />
		<ReactiveList
			componentId="results"
			dataField="name"
			react={{
				and: ['categories', 'search'],
			}}
			renderResultStats={renderResultStats}
			innerClass={{
				listItem: 'list-item',
			}}
			render={({ data }) => (
				<ReactiveList.ResultListWrapper>
					{data.map(res => (
						<ResultList key={res._id}>
							<ResultList.Content>
								<ResultList.Title>{res.name}</ResultList.Title>
								<ResultList.Description>
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
													<i className="fa fa-caret-up" />{' '}
													{res.votes_count}
												</Topic>
												<Topic hollow>
													<i className="fa fa-comment" />{' '}
													{res.comments_count}
												</Topic>
											</Flex>
										</Flex>
									</div>
								</ResultList.Description>
							</ResultList.Content>
						</ResultList>
					))}
				</ReactiveList.ResultListWrapper>
			)}
		/>
	</div>
);

export default Results;
