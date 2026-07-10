import ReactDOM from 'react-dom/client';

import {
	ReactiveBase,
	SearchBox,
	ReactiveList,
	ResultCard,
	SelectedFilters,
} from '@appbaseio/reactivesearch';

import './index.css';

const Main = () => (
	<ReactiveBase
		app="carstore-dataset"
		url="https://reactivesearch-api-9-4-0.onrender.com"
		credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
	>
		<div className="row">
			<div className="col">
				<SearchBox
					title="SearchBox"
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
					distinctField="brand.keyword"
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
