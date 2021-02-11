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
		app="carstore-dataset"
		url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@arc-cluster-appbase-demo-6pjy6z.searchbase.io"
		enableAppbase
	>
		<div className="row">
			<div className="col">
				<DataSearch
					title="DataSearch"
					dataField="brand"
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
					react={{
						and: 'CarSensor',
					}}
					scrollOnChange={false}
					showResultStats={false}
					renderNoResults={() => null}
					render={({ aggregationData }) => (
						<ReactiveList.ResultCardsWrapper>
							{aggregationData.map(item => (
								<ResultCard key={item._id}>
									<ResultCard.Image src={item.image} />
									<ResultCard.Title
										dangerouslySetInnerHTML={{
											__html: item.brand,
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
