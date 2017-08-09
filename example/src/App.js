import Expo from "expo";
import React, { Component } from "react";
import {
	StyleSheet,
	View,
	Text
} from "react-native";

import { ReactiveBase, TextField } from "reactivebase-native";

export default class Main extends Component {
	render() {
		return (
			<View style={styles.container}>
				<Text>Reactivebase Native Demo</Text>
				<ReactiveBase>
					<TextField />
				</ReactiveBase>
			</View>
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
