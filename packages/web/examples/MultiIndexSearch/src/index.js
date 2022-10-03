import ReactDOM from 'react-dom/client';
import {
	ReactiveBase,
	SearchBox,
	ReactiveList,
	ResultCard,
	SelectedFilters,
} from '@appbaseio/reactivesearch';

import './index.css';

const badge = {
	'good-books': 'badgeAqua',
	'good-books-ds': 'badgeCrimson',
};

const Main = () => (
	<ReactiveBase
		app="good-books,good-books-ds"
		url="https://b59ca4ceab0d:00a2085f-8794-4a7e-96af-041f45332f0e@appbase-demo-ansible-abxiydt-arc.searchbase.io"
		enableAppbase
		appbaseConfig={{
			recordAnalytics: true,
			userId: 'jon',
		}}
	>
		<div className="row">
			<div className="col">
				<SearchBox
					title="SearchBox"
					defaultValue="Ceremony"
					dataField="original_title"
					componentId="BookSensor"
					size={10}
					index="good-books,good-books-ds"
				/>
			</div>

			<div className="col">
				<SelectedFilters />
				<ReactiveList
					componentId="SearchResult"
					dataField="original_title"
					size={10}
					className="result-list-container"
					pagination
					react={{
						and: 'BookSensor',
					}}
					render={({ data }) => (
						<ReactiveList.ResultCardsWrapper>
							{data.map((item) => (
								<ResultCard id={item._id} key={item._id}>
									<ResultCard.Image src={item.image} />
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
												<div>
													by{' '}
													<span className="authors-list">
														{item.authors}
													</span>
												</div>
												<div className="ratings-list flex align-center">
													<span className="stars">
														{
															/* eslint-disable */
															Array(item.average_rating_rounded)
																.fill('x')
																.map((_, index) => (
																	<i
																		className="fas fa-star"
																		key={index}
																	/>
																))
															/* eslint-enable */
														}
													</span>
													<span className="avg-rating">
														({item.average_rating} avg)
													</span>
												</div>
											</div>
											<div>
												<span className="pub-year">
													Pub {item.original_publication_year}
												</span>
												<span className={badge[item._index]}>
													{item._index}
												</span>
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
