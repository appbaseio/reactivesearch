import React from 'react';
import { MultiList, SingleDropdownRange } from '@appbaseio/reactivesearch';

import Flex, { FlexChild } from '../styles/Flex';

const SearchFilters = () => (
	<Flex direction="column">
		<FlexChild margin="10px 0">
			<SingleDropdownRange
				componentId="rating"
				dataField="average_rating"
				title="Average Rating"
				data={[
					{ start: 2, end: 3, label: 'Less than 3 stars' },
					{ start: 3, end: 4, label: 'Between 3 and 4 stars' },
					{ start: 4, end: 5, label: 'More than 4 stars' },
				]}
				placeholder="Select Rating"
				filterLabel="Rating"
			/>
		</FlexChild>
		<FlexChild margin="10px 0">
			<MultiList
				componentId="series"
				dataField="original_series.raw"
				title="Books Series"
				size={250}
				sortBy="count"
				queryFormat="and"
				filterLabel="Series"
			/>
		</FlexChild>
		<FlexChild margin="10px 0">
			<MultiList
				componentId="authors"
				dataField="authors.raw"
				title="Authors"
				size={500}
				sortBy="count"
				queryFormat="and"
				filterLabel="Authors"
			/>
		</FlexChild>
	</Flex>
);

export default SearchFilters;
