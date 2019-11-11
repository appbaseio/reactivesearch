import React from 'react';
import ReactDOM from 'react-dom';

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
		app="carstore-dataset-latest"
		credentials="B86d2y2OE:4fecb2c5-5c5f-49e5-9e0b-0faba74597c6"
	>
		<div className="row">
			<div className="col">
				<DataSearch
					title="DataSearch"
					dataField="brand"
					aggregationField="brand.keyword"
					componentId="CarSensor"
					URLParams
				/>
			</div>

			<div className="col">
				<SelectedFilters />
				<ReactiveList
					componentId="SearchResult"
					dataField="brand"
					aggregationField="brand.keyword"
					size={10}
					className="result-list-container"
					pagination
					react={{
						and: 'CarSensor',
					}}
					render={({ aggregationData }) => (
						<ReactiveList.ResultCardsWrapper>
							{aggregationData.map(item => (
								<ResultCard key={item._id}>
									<ResultCard.Image src={item._source.image} />
									<ResultCard.Title
										dangerouslySetInnerHTML={{
											__html: item._source.brand,
										}}
									/>
									<ResultCard.Description>
										{`${item._source.brand} ${'★'.repeat(item._source.rating)}`}
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

ReactDOM.render(<Main />, document.getElementById('root'));
