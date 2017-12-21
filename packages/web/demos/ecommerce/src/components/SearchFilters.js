import React from "react";
import PropTypes from "prop-types";
import { SingleList, SingleRange, MultiList, RangeSlider } from "@appbaseio/reactivesearch";

import Flex, { FlexChild } from "../styles/Flex";

const SearchFilters = () => (
	<Flex direction="column">
		<FlexChild card margin="10px">
			<SingleList componentId="brand" dataField="brand.raw" title="Cars" />
		</FlexChild>
		<FlexChild card margin="10px">
			<SingleRange
				componentId="rating"
				dataField="rating"
				title="Rating"
				data={[
					{ start: 4, end: 5, label: "4 stars and up" },
					{ start: 3, end: 5, label: "3 stars and up" },
					{ start: 2, end: 5, label: "2 stars and up" }
				]}
			/>
		</FlexChild>
		<FlexChild card margin="10px">
			<MultiList
				componentId="vehicle"
				dataField="vehicleType.raw"
				title="Vehicle Type"
				showSearch={false}
			/>
		</FlexChild>
		<FlexChild card margin="10px">
			<RangeSlider
				componentId="price"
				dataField="price"
				title="Price Range"
				range={{
					start: 0,
					end: 10000
				}}
				rangeLabels={{
					start: "$0",
					end: "$10,000"
				}}
				interval={1000}
			/>
		</FlexChild>
	</Flex>
);

SearchFilters.propTypes = {
	currentTopics: PropTypes.arrayOf(PropTypes.string),
	setTopics: PropTypes.func,
	visible: PropTypes.bool
};

export default SearchFilters;
