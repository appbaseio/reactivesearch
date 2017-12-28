import React from 'react';
import { ReactiveList, SelectedFilters } from '@appbaseio/reactivesearch';

import Flex from '../styles/Flex';
import ResultItem, { bookHeader, authorsList, avgRating } from '../styles/ResultItem';

const onData = data => (
	<ResultItem key={data._id}>
		<img src={data.image} alt="Book Cover" />
		<Flex direction="column" justifyContent="center" style={{ marginLeft: 20 }}>
			<div className={bookHeader}>{data.original_title}</div>
			<Flex direction="column" justifyContent="space-between">
				<div>
					<div>by <span className={authorsList}>{data.authors}</span></div>
					<Flex alignCenter style={{ padding: '10px 0' }}>
						<span style={{ color: 'gold' }}>
							{
								Array(data.average_rating_rounded).fill('x')
									.map((item, index) => <i className="fas fa-star" key={index} />) // eslint-disable-line
							}
						</span>
						<span className={avgRating}>({data.average_rating} avg)</span>
					</Flex>
				</div>
				<div>Pub {data.original_publication_year}</div>
			</Flex>
		</Flex>
	</ResultItem>
);

const onResultStats = (results, time) =>
	<Flex justifyContent="flex-end" style={{ margin: '10px 0', flex: 1 }}>{`Found ${results} books in ${time} ms`}</Flex>;

const Results = () => (
	<div>
		<SelectedFilters />
		<ReactiveList
			componentId="results"
			dataField="original_title"
			react={{
				and: ['series', 'search', 'rating', 'authors'],
			}}
			onData={onData}
			onResultStats={onResultStats}
			innerClass={{
				listItem: 'list-item',
			}}
		/>
	</div>
);

export default Results;
