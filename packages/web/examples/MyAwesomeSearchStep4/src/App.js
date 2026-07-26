import React from 'react';
import {
	ReactiveBase,
	SearchBox,
	MultiList,
	SingleRange,
	ReactiveList,
	ResultCard,
} from '@appbaseio/reactivesearch';

function App() {
	return (
		<ReactiveBase
			url="https://reactivesearch-api-9-4-0.onrender.com"
			app="good-books-ds"
			credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
		>
			<SearchBox
				componentId="searchbox"
				dataField={[
					{
						field: 'authors',
						weight: 3,
					},
					{
						field: 'authors.autosuggest',
						weight: 1,
					},
					{
						field: 'original_title',
						weight: 5,
					},
					{
						field: 'original_title.autosuggest',
						weight: 1,
					},
				]}
				placeholder="Search for books or authors"
			/>
			<MultiList
				componentId="authorsfilter"
				dataField="authors.keyword"
				title="Filter by Authors"
				aggregationSize={5}
			/>
			<SingleRange
				componentId="ratingsfilter"
				dataField="average_rating"
				title="Filter by Ratings"
				data={[
					{ start: 4, end: 5, label: '4 stars and up' },
					{ start: 3, end: 5, label: '3 stars and up' },
				]}
				defaultValue="4 stars and up"
			/>
			<ReactiveList
				componentId="results"
				dataField="_score"
				size={6}
				pagination={true}
				react={{
					and: ['searchbox', 'authorsfilter', 'ratingsfilter'],
				}}
				render={({ data }) => (
					<ReactiveList.ResultCardsWrapper>
						{data.map((item) => (
							<ResultCard key={item._id}>
								<ResultCard.Image src={item.image} />
								<ResultCard.Title
									dangerouslySetInnerHTML={{
										__html: item.original_title,
									}}
								/>
								<ResultCard.Description>
									{item.authors + ' ' + '*'.repeat(item.average_rating)}
								</ResultCard.Description>
							</ResultCard>
						))}
					</ReactiveList.ResultCardsWrapper>
				)}
			/>
		</ReactiveBase>
	);
}

export default App;
