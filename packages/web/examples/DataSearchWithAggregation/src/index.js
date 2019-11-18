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
					componentId="BookSensor"
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
						and: 'BookSensor',
					}}
					render={({ data }) => (
						<ReactiveList.ResultCardsWrapper>
							{data.map(item => (
								<ResultCard key={item._id}>
									<ResultCard.Image src={item.image} />
									<ResultCard.Title
										dangerouslySetInnerHTML={{
											__html: item.name,
										}}
									/>
									<ResultCard.Description>
										{`${item.brand} ${'★'.repeat(item.rating)}`}
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
