import Expo from "expo";
import React, { Component } from "react";
import {
	View
} from "react-native";
import { Text, H3 } from "native-base";

import { ReactiveBase, DataSearch, TextField, DropdownList, ReactiveList } from "reactivebase-native";

export default class Main extends Component {
	state = {
		isReady: false,
	}

	async componentWillMount() {
		await Expo.Font.loadAsync({
			"Roboto": require("native-base/Fonts/Roboto.ttf"),
			"Roboto_medium": require("native-base/Fonts/Roboto_medium.ttf"),
			"Ionicons": require("native-base/Fonts/Ionicons.ttf"),
		});

		this.setState({isReady: true});
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
				style={{
					backgroundColor: "#fafafa",
					marginTop: Expo.Constants.statusBarHeight,
					padding: 10
				}}
			>
				<H3 style={{textAlign: "center"}}>ReactiveBase Native Demo</H3>
				<DropdownList
					componentId="DropdownListComponent"
					appbaseField="brand.raw"
				/>
				<DataSearch
					componentId="DataSeachComponent"
					appbaseField="name"
					react={{
						and: "TextFieldComponent"
					}}
				/>
				<TextField
					componentId="TextFieldComponent"
					appbaseField="color"
				/>
				<ReactiveList
					componentId="ReactiveList"
					size={20}
					from={0}
					onData={this.onData}
					react={{
						and: ["DropdownListComponent", "DataSeachComponent", "TextFieldComponent"]
					}}
				/>
			</ReactiveBase>
		);
	}
}

Expo.registerRootComponent(Main);
