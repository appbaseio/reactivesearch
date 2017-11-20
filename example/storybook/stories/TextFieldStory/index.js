import React from "react";
import { ScrollView } from "react-native";

import {
	ReactiveBase,
	TextField,
	ReactiveList
} from "@appbaseio/reactivebase-native";

import { onAllData } from "../../helpers";

const TextFieldStory = (props) => (
	<ReactiveBase
		app="car-store"
		credentials="cf7QByt5e:d2d60548-82a9-43cc-8b40-93cbbe75c34c"
		type="cars"
	>
		<ScrollView>
			<TextField
				componentId="TextFieldComponent"
				dataField="brand"
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
					and: ["TextFieldComponent"]
				}}
			/>
		</ScrollView>
	</ReactiveBase>
);

export default TextFieldStory;
