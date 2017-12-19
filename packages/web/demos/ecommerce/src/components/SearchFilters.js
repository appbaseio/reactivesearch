import React from "react";
import PropTypes from "prop-types";
import {
	SingleDropdownList,
	SingleDropdownRange,
	MultiList,
	DynamicRangeSlider
} from "@appbaseio/reactivesearch";

import Flex, { FlexChild } from "../styles/Flex";

const SearchFilters = () => (
	<Flex direction="column">
		<FlexChild margin="10px">
			<SingleDropdownList
				componentId="brand"
				dataField="brand.raw"
				title="Brand"
			/>
		</FlexChild>
		<FlexChild margin="10px">
			<SingleDropdownRange
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
		<FlexChild margin="10px">
			<MultiList
				componentId="vehicle"
				dataField="vehicleType.raw"
				title="Vehicle Type"
			/>
		</FlexChild>
		<FlexChild margin="10px">
			<DynamicRangeSlider
				componentId="price"
				dataField="price"
				title="Price Range"
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
