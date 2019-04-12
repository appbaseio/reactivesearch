import React from 'react';
import ReactDOM from 'react-dom';

import {
	ReactiveBase,
	TagCloud,
	ResultList,
	SelectedFilters,
	ReactiveList,
} from '@appbaseio/reactivesearch';

import './index.css';

const Main = () => (
	<ReactiveBase app="meetup_app" credentials="lW70IgSjr:87c5ae16-73fb-4559-a29e-0a02760d2181">
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
				<ReactiveList
					componentId="SearchResult"
					dataField="group.group_topics.topic_name_raw"
					title="Results"
					sortBy="asc"
					className="result-list-container"
					from={0}
					size={5}
					innerClass={{
						image: 'meetup-list-image',
					}}
					pagination
					react={{
						and: ['CitySensor'],
					}}
					render={({ data }) => (
						<ReactiveList.ResultListWrapper>
							{data.map(item => (
								<ResultList href={data.event.event_url} key={item._id}>
									<ResultList.Image src={item.member.photo} small />
									<ResultList.Content>
										<ResultList.Title>
											<div className="meetup-title">
												{data.member ? data.member.member_name : ''} is
												going to ${data.event ? data.event.event_name : ''}
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
													{data.group.group_topics
														.slice(0, 4)
														.map(tag => (
															<div
																className="meetup-topic"
																key={tag.topic_name}
															>
																{tag.topic_name}
															</div>
														))}
												</div>
											</div>
										</ResultList.Description>
									</ResultList.Content>
								</ResultList>
							))}
						</ReactiveList.ResultListWrapper>
					)}
				/>
			</div>
		</div>
	</ReactiveBase>
);

ReactDOM.render(<Main />, document.getElementById('root'));
