import React from "react";
import {
	DataSearch,
	SingleDropdownList,
	MultiDropdownList,
	SingleDropdownRange,
	RangeSlider
} from "@appbaseio/reactivesearch";

import Flex, { FlexChild } from "../styles/Flex";

const SearchFilters = () => (
	<Flex direction="column">
		<MultiDropdownList componentId="language" dataField="language" />
		<MultiDropdownList componentId="topics" dataField="topics" />
		<SingleDropdownRange
			componentId="pushed"
			dataField="pushed"
			data={[
				{ start: "now-1M", end: "now", label: "Last 30 days" },
				{ start: "now-6M", end: "now", label: "Last 6 months" },
				{ start: "now-1y", end: "now", label: "Last year" }
			]}
		/>
		<SingleDropdownRange
			componentId="created"
			dataField="created"
			data={[
				{
					start: "2017-01-01T00:00:00Z",
					end: "2017-12-31T23:59:59Z",
					label: "2017"
				},
				{
					start: "2016-01-01T00:00:00Z",
					end: "2016-12-31T23:59:59Z",
					label: "2016"
				},
				{
					start: "2015-01-01T00:00:00Z",
					end: "2015-12-31T23:59:59Z",
					label: "2015"
				},
				{
					start: "2014-01-01T00:00:00Z",
					end: "2014-12-31T23:59:59Z",
					label: "2014"
				},
				{
					start: "2013-01-01T00:00:00Z",
					end: "2013-12-31T23:59:59Z",
					label: "2013"
				},
				{
					start: "2012-01-01T00:00:00Z",
					end: "2012-12-31T23:59:59Z",
					label: "2012"
				},
				{
					start: "2011-01-01T00:00:00Z",
					end: "2011-12-31T23:59:59Z",
					label: "2011"
				},
				{
					start: "2010-01-01T00:00:00Z",
					end: "2010-12-31T23:59:59Z",
					label: "2010"
				},
				{
					start: "2009-01-01T00:00:00Z",
					end: "2009-12-31T23:59:59Z",
					label: "2009"
				},
				{
					start: "2008-01-01T00:00:00Z",
					end: "2008-12-31T23:59:59Z",
					label: "2008"
				},
				{
					start: "2007-01-01T00:00:00Z",
					end: "2007-12-31T23:59:59Z",
					label: "2007"
				}
			]}
		/>
		<RangeSlider componentId="stars" dataField="stars" range={{ start: 0, end: 300000 }} showHistogram={false} />
		<RangeSlider componentId="forks" dataField="forks" range={{ start: 0, end: 180000 }} showHistogram={false} />
		{/* <Flex responsive style={{ padding: "1rem" }}>
			<FlexChild flex={1}>
			</FlexChild>
			<FlexChild flex={1}>
			</FlexChild>
		</Flex> */}
	</Flex>
);

export default SearchFilters;
