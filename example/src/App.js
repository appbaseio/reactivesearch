import Expo from "expo";
import React, { Component } from "react";
import {
	StyleSheet,
	View,
	Text
} from "react-native";

import { ReactiveBase, DataSearch, TextField, ReactiveList } from "reactivebase-native";

export default class Main extends Component {
	onData(item) {
		const { _source: data } = item;
		return (
			<View style={{margin: 5}}>
				<Text style={{flex: 1, fontWeight: "bold"}}>{data.name}</Text>
				<Text>{data.brand} - {data.model}</Text>
			</View>
		);
	}

	render() {
		return (
			<ReactiveBase
				app="car-store"
				credentials="cf7QByt5e:d2d60548-82a9-43cc-8b40-93cbbe75c34c"
				type="cars"
				style={styles.container}
			>
				<Text>ReactiveBase Native Demo</Text>
				<DataSearch
					componentId="TextComponent"
					appbaseField="name"
				/>
				<TextField
					componentId="TextComponent2"
					appbaseField="color"
					react={{
						and: "TextComponent"
					}}
				/>
				<ReactiveList
					componentId="ReactiveList"
					size={20}
					from={0}
					onData={this.onData}
					react={{
						and: ["TextComponent", "TextComponent2"]
					}}
				/>
			</ReactiveBase>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
		justifyContent: "center",
		alignItems: "center",
		paddingTop: Expo.Constants.statusBarHeight
	}
});

Expo.registerRootComponent(Main);
