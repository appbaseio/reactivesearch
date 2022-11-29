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
		app="carstore-dataset"
		url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
		enableAppbase
	>
		<div className="row">
			<div className="col">
				<DataSearch
					title="DataSearch"
					dataField="brand"
					aggregationField="brand.keyword"
					aggregationSize={1}
					componentId="BookSensor"
					URLParams
					size={5}
				/>
			</div>

			<div className="col">
				<SelectedFilters />
				<ReactiveList
					componentId="SearchResult"
					dataField="brand"
					aggregationField="brand.keyword"
					// Set hits size as zero because we're not using it
					size={0}
					// Set aggregationSize as 10
					aggregationSize={10}
					className="result-list-container"
					react={{
						and: 'BookSensor',
					}}
					scrollOnChange={false}
					showResultStats={false}
					renderNoResults={() => null}
					render={({ aggregationData }) => (
						<ReactiveList.ResultCardsWrapper>
							{aggregationData.map((item) => (
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
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
