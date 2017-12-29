import React from "react";
import { ScrollView, View, Text } from "react-native";

import {
	ReactiveBase,
	DataController,
	ReactiveList
} from "@appbaseio/reactivebase-native";

import { onAllData } from "../../helpers";

const DataControllerStory = (props) => (
	<ReactiveBase
		app="car-store"
		credentials="cf7QByt5e:d2d60548-82a9-43cc-8b40-93cbbe75c34c"
		type="cars"
	>
		<ScrollView>
			<DataController
				componentId="DataControllerComponent"
				dataField="brand"
				{...props}
			>
				<View
					style={{
						flex: 1,
						alignItems: "center",
						padding: 10,
						borderWidth: 1,
						borderColor: "palevioletred",
						borderStyle: "dashed",
						borderRadius: 5
					}}
				>
					<Text
						style={{
							fontSize: 20
						}}
					>
						A custom 💪 UI component
					</Text>
				</View>
			</DataController>
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
					and: ["DataControllerComponent"]
				}}
			/>
		</ScrollView>
	</ReactiveBase>
);

export default DataControllerStory;
