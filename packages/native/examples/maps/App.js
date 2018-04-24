import Expo from 'expo';
import React, { Component } from 'react';
// import { Text, Header, Body, Title } from 'native-base';

import {
	// ReactiveBase,
	ReactiveMap,
} from '@appbaseio/reactivesearch-native';

class Main extends Component {
	state = {
		// isReady: false,
	}

	// async componentWillMount() {
	// 	await Expo.Font.loadAsync({
	// 		Roboto: require('native-base/Fonts/Roboto.ttf'), // eslint-disable-line global-require
	// 		Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'), // eslint-disable-line global-require
	// 		Ionicons: require('@expo/vector-icons/fonts/Ionicons.ttf'), // eslint-disable-line global-require
	// 	});

	// 	this.setState({ isReady: true });
	// }

	render() {
		// if (!this.state.isReady) {
		// 	return <Text>Loading...</Text>;
		// }

		return (
			<ReactiveMap />
		);
	}
}

module.exports = Main;
Expo.registerRootComponent(Main);
