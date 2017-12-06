import React from "react";
import {
	DataSearch,
	SingleDropdownList
} from "@appbaseio/reactivesearch";

import Flex, { FlexChild } from "../styles/Flex";

const SearchFilters = () => (
	<Flex>
		<FlexChild flex={2}>
			<DataSearch
				componentId="title"
				dataField={["title", "text"]}
				highlight
			/>
		</FlexChild>
		<FlexChild flex={1}>
			<SingleDropdownList
				componentId="category"
				dataField="p_type"
			/>
		</FlexChild>
	</Flex>
);

export default SearchFilters;
