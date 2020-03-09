import React from 'react';
import ReactDOM from 'react-dom';

import {
	ReactiveBase,
	DatePicker,
	DataSearch,
	RangeSlider,
	ReactiveList,
	ResultCard,
	SelectedFilters,
	MultiList,
	StateProvider,
	CategorySearch,
	ReactiveComponent,
	DynamicRangeSlider,
	SingleRange,
	MultiRange,
	MultiDropdownRange,
	RangeInput,
	RatingsFilter,
	DateRange,
	TagCloud,
	NumberBox,
	ToggleButton,
} from '@appbaseio/reactivesearch';
import moment from 'moment';

import './index.css';

const dateQuery = (value, props) => {
	let query = null;
	if (value) {
		query = [
			{
				range: {
					[props.dataField]: {
						lte: moment(value).format('YYYYMMDD'),
					},
				},
			},
		];
	}
	return query ? { query: { bool: { must: query } } } : null;
};

const dateRangeQuery = (value) => {
	let query = null;
	if (value) {
		query = [
			{
				range: {
					date_from: {
						gte: moment(value.start).format('YYYYMMDD'),
					},
				},
			},
			{
				range: {
					date_to: {
						lte: moment(value.end).format('YYYYMMDD'),
					},
				},
			},
		];
	}
	return query ? { query: { bool: { must: query } } } : null;
};

const CustomComponent = (props) => {
	console.log('THIS IS PROPS', props);
	return <div>Hi From CustomComponent</div>;
};
const Main = () => (
	<ReactiveBase
		// appbaseConfig={{
		// 	recordAnalytics: true,
		// }}
		enableAppbase
		url="http://localhost:8000"
		app="good-books-ds"
		// To test date picker
		// app="airbeds-test-app"
		credentials="foo:bar"
	>
		<div className="row">
			<div className="col">
				<StateProvider
					includeKeys={['settings']}
					render={({ searchState }) => <div>Search State: ${JSON.stringify(searchState)}</div>}
				/>
				<ReactiveComponent
					componentId="BookSensor"
					// either use customQuery or defaultQuery
					customQuery={() => ({
						query: {
							term: {
								'brand.keyword': 'Nissan',
							},
						},
					})}
					defaultQuery={() => ({
						aggs: {
							'brand.keyword': {
								terms: {
									field: 'brand.keyword',
									order: {
										_count: 'desc',
									},
									size: 10,
								},
							},
						},
					})}
				>
					{props => <CustomComponent {...props} />}
				</ReactiveComponent>
				{/* <NumberBox
					componentId="BookSensor"
					dataField="average_rating_rounded"
					data={{
						label: 'Book Rating',
						start: 2,
						end: 5,
					}}
					labelPosition="left"
				/> */}
				{/* <ToggleButton
					componentId="BookSensor"
					dataField="original_series.keyword"
					data={[
						{ label: '1Q84', value: '1Q84' },
						{ label: 'A Ghost Story', value: 'A Ghost Story' },
						{ label: 'Music', value: 'Music' },
					]}
				/> */}
				{/* <DynamicRangeSlider
					dataField="books_count"
					componentId="BookSensor"
					interval={10}
					rangeLabels={(min, max) => ({
						start: `${min} book`,
						end: `${max} books`,
					})}
				/> */}
				{/* <SingleRange
					componentId="BookSensor"
					dataField="average_rating"
					data={[
						{ start: 0, end: 3, label: 'Rating < 3' },
						{ start: 3, end: 4, label: 'Rating 3 to 4' },
						{ start: 4, end: 5, label: 'Rating > 4' },
					]}
				/> */}
				{/* <MultiRange
					componentId="BookSensor"
					dataField="average_rating"
					data={[
						{ start: 0, end: 3, label: 'Rating < 3' },
						{ start: 3, end: 4, label: 'Rating 3 to 4' },
						{ start: 4, end: 5, label: 'Rating > 4' },
					]}
				/> */}
				{/* <MultiDropdownRange
					componentId="BookSensor"
					dataField="average_rating"
					data={[
						{ start: 0, end: 3, label: 'Rating < 3' },
						{ start: 3, end: 4, label: 'Rating 3 to 4' },
						{ start: 4, end: 5, label: 'Rating > 4' },
					]}
				/> */}
				{/* <RangeInput
					dataField="ratings_count"
					componentId="BookSensor"
					range={{
						start: 3000,
						end: 50000,
					}}
					rangeLabels={{
						start: '3K',
						end: '50K',
					}}
				/> */}
				{/* <RatingsFilter
					componentId="BookSensor"
					dataField="average_rating_rounded"
					title="RatingsFilter"
					data={[
						{ start: 4, end: 5, label: '4 stars and up' },
						{ start: 3, end: 5, label: '3 stars and up' },
						{ start: 2, end: 5, label: '2 stars and up' },
						{ start: 1, end: 5, label: '> 1 stars' },
					]}
				/> */}
				{/* <DatePicker
					componentId="DateSensor"
					dataField="date_from"
					initialMonth={new Date('2017-05-05')}
					customQuery={dateQuery}
				/> */}
				{/* <DateRange
					componentId="DateSensor"
					dataField="date_from"
					initialMonth={new Date('2017-05-05')}
					customQuery={dateRangeQuery}
				/>
				<ReactiveList
					componentId="SearchResult"
					dataField="name"
					from={0}
					size={40}
					showPagination
					react={{
						and: ['DateSensor'],
					}}
				>
					{
						({ data }) => (
							<ReactiveList.ResultCardsWrapper>
								{
									data.map(item => (
										<ResultCard href={item.listing_url} key={item._id}>
											<ResultCard.Image src={item.image} />
											<ResultCard.Title dangerouslySetInnerHTML={{ __html: item.original_title }} />
											<ResultCard.Description>
												<div>
													<div>${item.price}</div>
													<span style={{ backgroundImage: `url(${item.host_image})` }} />
													<p>
														{item.room_type} · {item.accommodates} guests
													</p>
												</div>
											</ResultCard.Description>
										</ResultCard>
									))
								}
							</ReactiveList.ResultCardsWrapper>
						)
					}
				</ReactiveList> */}
				{/* <RangeSlider
					dataField="ratings_count"
					componentId="BookSensor"
					interval={5000}
					range={{
						start: 3000,
						end: 50000,
					}}
					rangeLabels={{
						start: '3K',
						end: '50K',
					}}
					includeNullValues
					// showHistogram
				/> */}
				{/* <CategorySearch
					queryFormat="and"
					fieldWeights={[1]}
					fuzziness={1}
					highlight
					title="DataSearch"
					categoryField="authors.keyword"
					dataField={['original_title', 'original_title.search']}
					componentId="BookSensor"
					URLParams
					react={{
						and: 'MultiList',
					}}
					// aggregationField="code"
					// customHighlight={props => ({
					// 	pre_tags: ['<mark>'],
					// 	post_tags: ['</mark>'],
					// 	fields: {
					// 		price: {},
					// 	},
					// 	number_of_fragments: 0,
					// })}
					// defaultQuery={(value, props) => {
					// 	console.log('DEFAULT QUERY', value, props);
					// 	return ({
					// 		query: {
					// 			match_all: {},
					// 		},
					// 		timeout: '1s',
					// 	});
					// }}
					// render={(data) => {
					// 	console.log('DATA SEARCH', data);
					// }}
					// searchOperators
				/> */}
				{/* <MultiList
					componentId="MultiList"
					dataField="original_series.keyword"
					size={100}
					showLoadMore
					showMissing
					missingLabel="temp"
					selectAllLabel="SELECT ALL"
					// sortBy="desc"
					// defaultQuery={(value, props) => {
					// 	console.log('DEFAULT QUERY', value, props);
					// 	return ({
					// 		query: {
					// 			term: {
					// 				'original_series.keyword': '1Q84',
					// 			},
					// 		},
					// 		timeout: '1s',
					// 	});
					// }}
				/> */}
				{/* <TagCloud
					title="TagCloud"
					componentId="BookSensor"
					dataField="original_series.keyword"
					multiSelect
					size={50}
				/> */}
			</div>

			<div className="col">
				<SelectedFilters />
				<ReactiveList
					componentId="SearchResult"
					dataField="original_title"
					size={2}
					className="result-list-container"
					pagination
					react={{
						and: ['BookSensor'],
					}}
					// defaultQuery={(value, props) => {
					// 	console.log('DEFAULT QUERY', value, props);
					// 	return ({
					// 		query: {
					// 			match_all: {},
					// 		},
					// 		timeout: '1s',
					// 	});
					// }}
					// onData={(data) => {
					// 	console.log('onData', data);
					// }}
					// sortOptions={[
					// 	{
					// 		label: 'Sort By Price (asc)',
					// 		dataField: 'price',
					// 		sortBy: 'asc',
					// 	},
					// 	{
					// 		label: 'Sort By Price (desc)',
					// 		dataField: 'price',
					// 		sortBy: 'desc',
					// 	},
					// ]}
					render={({ data }) => (
						<ReactiveList.ResultCardsWrapper>
							{data.map(item => (
								<ResultCard key={item.id}>
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
														{Array(item.average_rating_rounded)
															.fill('x')
															.map((item, index) => (
																<i
																	className="fas fa-star"
																	key={index}
																/>
															)) // eslint-disable-line
														}
													</span>
													<span className="avg-rating">
														({item.average_rating} avg)
													</span>
												</div>
											</div>
											<span className="pub-year">
												Pub {item.original_publication_year}
											</span>
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

ReactDOM.render(<Main />, document.getElementById('root'));
