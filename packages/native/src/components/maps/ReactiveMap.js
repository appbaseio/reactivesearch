import React from 'react';
import { View, Text } from 'react-native';
import Expo, { MapView } from 'expo';

export default class ReactiveMap extends React.Component {
	state = {}
	render() {
		console.log('expo: ', Expo);
		console.log('MapView: ', MapView);
		return (
			<View>
				<Text>Map Component</Text>
				<MapView
					style={{ flex: 1 }}
					initialRegion={{
						latitude: 23.033863,
						longitude: 72.585022,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}
				/>
			</View>
		);
	}
}
