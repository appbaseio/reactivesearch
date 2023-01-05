import React from 'react';
import { SearchBox, SingleDropdownList, SingleDropdownRange } from '@appbaseio/reactivesearch';

import Flex, { FlexChild } from '../styles/Flex';

const SearchFilters = () => (
	<Flex responsive style={{ padding: '1rem' }}>
		<FlexChild flex={2}>
			<SearchBox
				componentId="title"
				dataField={['title', 'text']}
				highlight
				customHighlight={() => ({
					pre_tags: ['<mark>'],
					post_tags: ['</mark>'],
					fields: {
						text: {},
						title: {},
					},
					number_of_fragments: 0,
				})}
			/>
		</FlexChild>
		<FlexChild flex={1}>
			<SingleDropdownList
				componentId="category"
				dataField="p_type.keyword"
				placeholder="Select Category"
				react={{
					and: 'title',
				}}
			/>
		</FlexChild>
		<FlexChild flex={1}>
			<SingleDropdownRange
				componentId="time"
				dataField="time.keyword"
				data={[
					{ start: 'now-6M', end: 'now', label: 'Last 6 months' },
					{ start: 'now-1y', end: 'now', label: 'Last year' },
					{ start: 'now-10y', end: 'now', label: 'All time' },
				]}
				placeholder="Select Time"
			/>
		</FlexChild>
	</Flex>
);

export default SearchFilters;
