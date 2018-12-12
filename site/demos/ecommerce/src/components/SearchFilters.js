import React from 'react';
import PropTypes from 'prop-types';
import { SingleList, SingleRange, MultiList, RangeSlider } from '@appbaseio/reactivesearch';

import Flex, { FlexChild } from '../styles/Flex';

const SearchFilters = () => (
	<Flex direction="column">
		<FlexChild card margin="10px">
			<SingleList
				componentId="brand"
				dataField="brand.keyword"
				title="Cars"
				innerClass={{
					list: 'list',
				}}
				react={{ and: ['price', 'type', 'rating'] }}
				URLParams
			/>
		</FlexChild>
		<FlexChild card margin="10px">
			<SingleRange
				componentId="rating"
				dataField="rating"
				title="Rating"
				data={[
					{ start: 4, end: 5, label: '4 stars and up' },
					{ start: 3, end: 5, label: '3 stars and up' },
					{ start: 2, end: 5, label: '2 stars and up' },
				]}
				innerClass={{
					list: 'list',
				}}
				react={{ and: ['price', 'brand', 'type'] }}
				URLParams
			/>
		</FlexChild>
		<FlexChild card margin="10px">
			<MultiList
				componentId="vehicle"
				dataField="vehicleType.keyword"
				title="Vehicle Type"
				showSearch={false}
				innerClass={{
					list: 'list',
				}}
				URLParams
				react={{ and: ['brand', 'price', 'rating'] }}
			/>
		</FlexChild>
		<FlexChild card margin="10px">
			<RangeSlider
				componentId="price"
				dataField="price"
				title="Price Range"
				react={{ and: ['brand', 'type', 'rating'] }}
				range={{
					start: 10000,
					end: 60000,
				}}
				rangeLabels={{
					start: '$10,000',
					end: '$60,000',
				}}
				interval={1000}
			/>
		</FlexChild>
	</Flex>
);

SearchFilters.propTypes = {
	currentTopics: PropTypes.arrayOf(PropTypes.string),
	setTopics: PropTypes.func,
	visible: PropTypes.bool,
};

export default SearchFilters;
