import { Component } from 'react';
import ReactDOM from 'react-dom/client';

import { ReactiveBase, MultiList, ReactiveList, SelectedFilters } from '@appbaseio/reactivesearch';

import './index.css';

class Main extends Component {
	render() {
		return (
			<ReactiveBase
				enableAppbase
				app="default"
				url="https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/public-demo-skxjb/service/http_endpoint/incoming_webhook/reactivesearch"
				mongodb={{
					db: 'sample_airbnb',
					collection: 'listingsAndReviews',
				}}
			>
				<div className="row">
					<div className="col">
						<MultiList
							placeholder="Search for property types"
							componentId="PropertyFilter"
							dataField="property_type"
						/>
					</div>

					<div className="col">
						<SelectedFilters />
						<ReactiveList
							componentId="SearchResult"
							dataField="name"
							className="result-list-container"
							from={0}
							size={5}
							renderItem={this.propertyReactiveList}
							react={{
								and: ['PropertyFilter'],
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}

	propertyReactiveList(data) {
		return (
			<div className="flex property-content" key={data._id}>
				<img
					src={data.images.picture_url}
					alt="Property iamge"
					className="property-image"
				/>
				<div className="flex column justify-center" style={{ marginLeft: 20 }}>
					<div className="property-header">{data.name}</div>
					<div className="flex column justify-space-between">
						<div>
							<div>
								Property Type:{' '}
								<span className="property-type">{data.property_type}</span>
							</div>
							<div className="ratings-list flex align-center">
								Review Score:
								{data.review_scores.review_scores_value ? (
									<React.Fragment>
										<span className="stars">
											{
												Array(data.review_scores.review_scores_value)
													.fill('x')
													.map(item => (
														<i
															className="fas fa-star"
															key={item + Math.random()}
														/>
													)) // eslint-disable-line
											}
										</span>
										<span className="avg-rating">
											({data.review_scores.review_scores_value} avg)
										</span>
									</React.Fragment>
								) : (
									' NA'
								)}
							</div>
						</div>
						<span>Accomodates: {data.accommodates}</span>
					</div>
				</div>
			</div>
		);
	}
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
