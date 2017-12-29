import React from "react";
import { ScrollView } from "react-native";

import {
	ReactiveBase,
	SingleDropdownRange,
	ReactiveList
} from "@appbaseio/reactivebase-native";

import { onAllData } from "../../helpers";

const SingleDropdownRangeStory = (props) => (
	<ReactiveBase
		app="car-store"
		credentials="cf7QByt5e:d2d60548-82a9-43cc-8b40-93cbbe75c34c"
		type="cars"
	>
		<ScrollView>
			<SingleDropdownRange
				componentId="SingleDropdownRangeComponent"
				dataField="price"
				data={
					[{ "start": 0, "end": 100, "label": "Cheap" },
						{ "start": 101, "end": 200, "label": "Moderate" },
						{ "start": 201, "end": 500, "label": "Pricey" },
						{ "start": 501, "end": 1000, "label": "First Date" }]
				}
				{...props}
			/>
			<ReactiveList
				dataField="name"
				componentId="ReactiveList"
				size={20}
				from={0}
				onAllData={onAllData}
				pagination
				defaultQuery={() => ({
					query: {
						match_all: {}
					},
					sort: {
						price: { order: "asc" }
					}
				})}
				react={{
					and: ["SingleDropdownRangeComponent"]
				}}
			/>
		</ScrollView>
	</ReactiveBase>
);

export default SingleDropdownRangeStory;
