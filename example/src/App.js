import Expo from "expo";
import React, { Component } from "react";
import { View, ScrollView } from "react-native";
import { Text, Header, Body, Title } from "native-base";

import {
	ReactiveBase,
	DataSearch,
	DataController,
	TextField,
	SingleDropdownList,
	MultiDropdownList,
	SingleDropdownRange,
	MultiDropdownRange,
	RangeSlider,
	DatePicker,
	DateRange,
	ReactiveList
} from "@appbaseio/reactivebase-native";

export default class Main extends Component {
	state = {
		isReady: false
	}

	async componentWillMount() {
		await Expo.Font.loadAsync({
			"Roboto": require("native-base/Fonts/Roboto.ttf"),
			"Roboto_medium": require("native-base/Fonts/Roboto_medium.ttf"),
			"Ionicons": require("native-base/Fonts/Ionicons.ttf")
		});

		this.setState({ isReady: true });
	}

	onData(item) {
		const { _source: data } = item;
		return (
			<View style={{ margin: 5 }}>
				<Text style={{ flex: 1, fontWeight: "bold" }}>{data.name}</Text>
				<Text>{data.brand} - {data.model}</Text>
			</View>
		);
	}

	render() {
		if (!this.state.isReady) {
			return <Text>Loading...</Text>;
		}

		return (
			<ReactiveBase
				app="car-store"
				credentials="cf7QByt5e:d2d60548-82a9-43cc-8b40-93cbbe75c34c"
				type="cars"
			>
				<Header>
					<Body>
						<Title>ReactiveBase Native Demo</Title>
					</Body>
				</Header>
				<ScrollView>
					<View style={{ padding: 10 }}>
						<SingleDropdownList
							componentId="SingleDropdownListComponent"
							dataField="brand.raw"
						/>
						<MultiDropdownList
							componentId="MultiDropdownListComponent"
							dataField="brand.raw"
						/>
						<DataSearch
							componentId="DataSeachComponent"
							dataField="name"
							defaultSelected="Nissan"
							onValueChange={(val) => console.log("DataSearch onValueChange", val)}
							react={{
								and: "TextFieldComponent"
							}}
						/>
						<SingleDropdownRange
							componentId="SingleDropdownRange"
							dataField="price"
							data={
								[{ "start": 0, "end": 100, "label": "Cheap" },
									{ "start": 101, "end": 200, "label": "Moderate" },
									{ "start": 201, "end": 500, "label": "Pricey" },
									{ "start": 501, "end": 1000, "label": "First Date" }]
							}
							defaultSelected={"Pricey"}
						/>

						<MultiDropdownRange
							componentId="MultiDropdownRange"
							dataField="price"
							data={
								[{ "start": 0, "end": 100, "label": "Cheap" },
									{ "start": 101, "end": 200, "label": "Moderate" },
									{ "start": 201, "end": 500, "label": "Pricey" },
									{ "start": 501, "end": 1000, "label": "First Date" }]
							}
							defaultSelected={["Pricey", "First Date"]}
						/>

						<RangeSlider
							componentId="RangeSlider"
							dataField="rating"
							range={{
								start: 0,
								end: 5
							}}
						/>
						<TextField
							componentId="TextFieldComponent"
							dataField="color"
							placeholder="Search color"
						/>
						<DatePicker
							dataField="someField"
							componentId="DatePicker"
						/>
						<DateRange
							dataField="someField"
							componentId="DateRange"
							defaultSelected={{
								start: "2017-04-04",
								end: "2017-04-10"
							}}
						/>
						<DataController
							componentId="DataController"
							onQueryChange={(prev, next) => {
								console.log(prev, next);
							}}
						/>
						<ReactiveList
							componentId="ReactiveList"
							size={20}
							from={0}
							onData={this.onData}
							pagination
							react={{
								and: ["DataController", "SingleDropdownListComponent", "MultiDropdownListComponent", "DataSeachComponent", "TextFieldComponent", "RangeSlider", "SingleDropdownRange", "MultiDropdownRange"]
							}}
						/>
					</View>
				</ScrollView>
			</ReactiveBase>
		);
	}
}

Expo.registerRootComponent(Main);
