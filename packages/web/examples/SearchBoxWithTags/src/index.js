import ReactDOM from 'react-dom/client';

import { ReactiveBase, SearchBox, ReactiveList, ResultCard } from '@appbaseio/reactivesearch';

import './index.css';

const Main = () => (
	<ReactiveBase
		app="movies-demo-app"
		url="https://reactivesearch-api-9-4-0.onrender.com"
		credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
	>
		<div className="row">
			<div className="col">
				<SearchBox
					defaultValue={['shock and awe', 'Great Expectations']}
					title="SearchBox"
					dataField={['original_title', 'original_title.search']}
					componentId="MoviesSensor"
					mode={'tag'}
				/>
				<br />
				<ReactiveList
					componentId="SearchResult"
					dataField="original_title"
					size={10}
					className="result-list-container"
					pagination
					react={{
						and: 'MoviesSensor',
					}}
					render={({ data }) => (
						<ReactiveList.ResultCardsWrapper>
							{data.map((item) => (
								<ResultCard id={item._id} key={item._id}>
									<ResultCard.Image src={item.poster_path} />
									<ResultCard.Title>
										<div
											className="book-title"
											dangerouslySetInnerHTML={{
												__html: item.original_title,
											}}
										/>
									</ResultCard.Title>

									<ResultCard.Description>
										<div className="flex column justify-space-between">
											<div>
												<div title={item.overview}>
													<span className="authors-list">
														{item.overview}
													</span>
												</div>
												<div className="ratings-list flex align-center">
													<span>
														{item.genres.map((_) => (
															<span> ∙ {_}</span>
														))}
													</span>
												</div>
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
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
