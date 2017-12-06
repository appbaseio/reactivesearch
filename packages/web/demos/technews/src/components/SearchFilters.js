import React from "react";
import {
	DataSearch,
	SingleDropdownList
} from "@appbaseio/reactivesearch";

const SearchFilters = () => (
	<section>
		<DataSearch
			componentId="title"
			dataField="title"
		/>
		<SingleDropdownList
			componentId="category"
			dataField="p_type"
		/>
	</section>
);

export default SearchFilters;
