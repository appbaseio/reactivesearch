import React from 'react';
import ReactDOM from 'react-dom';

import { ReactiveBase, RangeInput, ReactiveList, ResultCard } from '@appbaseio/reactivesearch';

import './index.css';

const Main = () => (
	<ReactiveBase
		enableAppbase
		app="default"
		url="https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/public-demo-skxjb/service/http_endpoint/incoming_webhook/reactivesearch"
		mongodb={{
			db: 'sample_airbnb',
			collection: 'listingsAndReviews',
		}}
	>
		<h2 className="center">Property search based on accomodation range</h2>
		<div className="row">
			<div className="col">
				<RangeInput
					dataField="accommodates"
					componentId="accommodates_range"
					range={{
						start: 1,
						end: 16,
					}}
					rangeLabels={{
						start: '1 Person',
						end: '16 Persons',
					}}
					URLParams
				/>
			</div>

			<div className="col">
				<ReactiveList
					componentId="SearchResult"
					dataField="accommodates"
					from={0}
					size={3}
					className="result-list-container"
					pagination
					react={{
						and: 'accommodates_range',
					}}
					render={({ data }) => (
						<ReactiveList.ResultCardsWrapper>
							{data.map(item => (
								<ResultCard id={item._id} key={item._id}>
									<ResultCard.Image src={item.images.picture_url} />
									<ResultCard.Title>
										<div
											className="title"
											dangerouslySetInnerHTML={{
												__html: item.name,
											}}
										/>
									</ResultCard.Title>

									<ResultCard.Description>
										<div className="flex column justify-space-between">
											<div title={item.description} className="description">
												({item.description} )
											</div>
											<div className="tag">
												Accomodates <span>{item.accommodates}</span>
											</div>
										</div>
									</ResultCard.Description>
								</ResultCard>
							))}
						</ReactiveList.ResultCardsWrapper>
					)}
				/>
			</div>
		</div>
	</ReactiveBase>
);

ReactDOM.render(<Main />, document.getElementById('root'));
