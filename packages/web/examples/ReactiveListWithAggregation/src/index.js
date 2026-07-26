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
		app="good-books-ds"
		url="https://reactivesearch-api-9-4-0.onrender.com"
		credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
	>
		<div className="row">
			<div className="col">
				<SearchBox
					title="SearchBox"
					dataField={['authors', 'authors.search']}
					componentId="BookSensor"
					URLParams
				/>
			</div>

			<div className="col">
				<SelectedFilters />
				<ReactiveList
					componentId="SearchResult"
					dataField="authors"
					distinctField="authors.keyword"
					size={10}
					className="result-list-container"
					react={{
						and: 'BookSensor',
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
											__html: item.authors,
										}}
									/>
									<ResultCard.Description>
										{`${item.original_title} · ${'★'.repeat(item.average_rating_rounded)}`}
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
