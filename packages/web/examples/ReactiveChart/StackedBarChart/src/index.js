import React from 'react';
import ReactDOM from 'react-dom';

import {
	ReactiveBase,
	ReactiveList,
	ResultCard,
	SelectedFilters,
	ReactiveChart,
} from '@appbaseio/reactivesearch';

import './index.css';

const Main = () => (
	<ReactiveBase
		app="movies-store-app"
		url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
		enableAppbase
		appbaseConfig={{
			recordAnalytics: true,
		}}
	>
		<div className="row">
			<div className="col">
				<ReactiveChart
					componentId="stackedBarChart"
					dataField="release_year"
					chartType="bar"
					filterLabel="Language"
					URLParams
					title="Languages"
					defaultQuery={() => ({
						aggs: {
							years: {
								terms: {
									field: 'release_year',
								},
								aggs: {
									genres: {
										terms: {
											field: 'genres_data.keyword',
										},
									},
								},
							},
						},
					})}
					setOption={({ rawData }) => {
						const releaseYearGenresTable = {};
						const genresReleaseYearTable = {};
						const aggs = rawData ? rawData.aggregations : null;
						// eslint-disable-next-line no-unused-expressions
						if (aggs) {
							aggs.years.buckets.forEach((doc) => {
								const releaseYear = doc.key;
								releaseYearGenresTable[releaseYear] = {};
								doc.genres.buckets.forEach((genres) => {
									genres.key.split(',').forEach((genre) => {
										// genres might be a comma separated value
										if (releaseYearGenresTable[releaseYear][genre]) {
											releaseYearGenresTable[releaseYear][genre] += genres.doc_count;
										} else {
											releaseYearGenresTable[releaseYear][genre] = 0;
											releaseYearGenresTable[releaseYear][genre] = genres.doc_count;
										}
									});
								});
							});
							Object.keys(releaseYearGenresTable).forEach((year) => {
								Object.keys(releaseYearGenresTable[year]).forEach((genre) => {
									if (!genresReleaseYearTable[genre]) genresReleaseYearTable[genre] = {};
									genresReleaseYearTable[genre][year] = releaseYearGenresTable[year][genre];
								});
							});
						}
						return {
							legend: {},
							xAxis: {
								data: Object.keys(releaseYearGenresTable).map(k => k),
							},
							yAxis: {},
							series: Object.keys(genresReleaseYearTable).map(genre => ({
								data: Object.keys(genresReleaseYearTable[genre])
									.sort()
									.map(year => genresReleaseYearTable[genre][year]),
								stack: 'x',
								type: 'bar',
								name: genre,
							})),
						};
					}}
				/>
			</div>

			<div className="col">
				<SelectedFilters />
				<ReactiveList
					componentId="result"
					size={5}
					dataField="original_title"
					react={{ and: 'stackedBarChart' }}
					pagination
					render={({ data }) => (
						<ReactiveList.ResultCardsWrapper>
							{data.map(item => (
								<ResultCard id={item._id} key={item._id}>
									<ResultCard.Image
										src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
									/>
									<ResultCard.Title>
										<div className="book-title">{item.original_title}</div>
									</ResultCard.Title>
									<ResultCard.Description>
										<span className="language">{item.original_language}</span>
										<span>-</span> <span>{item.release_year}</span>
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
