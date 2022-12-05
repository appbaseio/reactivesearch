import ReactDOM from 'react-dom/client';

import {
	ReactiveBase,
	DataSearch,
	ReactiveList,
	ResultCard,
	SelectedFilters,
} from '@appbaseio/reactivesearch';

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
		<div>
			<div>
				<DataSearch
					title="DataSearch"
					dataField={[
						{
							field: 'name',
							weight: 3,
						},
						{
							field: 'description',
							weight: 1,
						},
					]}
					componentId="search-component"
					URLParams
					size={5}
				/>
			</div>

			<div>
				<SelectedFilters />
				<ReactiveList
					componentId="SearchResult"
					dataField="property_type"
					size={10}
					className="result-list-container"
					pagination
					react={{
						and: 'search-component',
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

export default Main;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
