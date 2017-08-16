import Expo from "expo";
import React, { Component } from "react";
import {
	StyleSheet,
	View,
	Text
} from "react-native";

import { ReactiveBase, TextField, ReactiveList } from "reactivebase-native";

export default class Main extends Component {
	render() {
		return (
			<ReactiveBase
				app="car-store"
				credentials="cf7QByt5e:d2d60548-82a9-43cc-8b40-93cbbe75c34c"
				type="cars"
				style={styles.container}
			>
				<Text>ReactiveBase Native Demo</Text>
				<TextField
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
		alignItems: "center"
	}
});

Expo.registerRootComponent(Main);
