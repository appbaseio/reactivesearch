import Expo from 'expo';
import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native'; // eslint-disable-line

import {
	ReactiveBase,
	SingleDropdownList,
} from '@appbaseio/reactivesearch-native';
import ReactiveMap from '@appbaseio/reactivemaps-native';

class Main extends Component {
	state = {
		isReady: false,
	}

	async componentWillMount() {
		await Expo.Font.loadAsync({
			Roboto: require('native-base/Fonts/Roboto.ttf'), // eslint-disable-line global-require
			Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'), // eslint-disable-line global-require
			Ionicons: require('@expo/vector-icons/fonts/Ionicons.ttf'), // eslint-disable-line global-require
		});

		this.setState({ isReady: true });
	}

	onData = data => (
		<Text>{data.title}</Text>
	)

	render() {
		if (!this.state.isReady) {
			return <Text>Loading...</Text>;
		}

		return (
			<View style={{ flex: 1, marginTop: 25 }}>
				<ReactiveBase
					app="earthquake"
					credentials="OrXIHcgHn:d539c6e7-ed14-4407-8214-c227b0600d8e"
					type="places"
				>
					<View style={{ backgroundColor: 'lightblue', marginBottom: 20 }}>
						<SingleDropdownList
							componentId="places"
							dataField="place.raw"
							size={10}
							defaultSelected="Japan"
						/>
					</View>
					<View style={{ flex: 1 }}>
						<ReactiveMap
							componentId="map"
							dataField="location"
							react={{
								and: 'places',
							}}
							onPopoverClick={item => (
								<Text>Run before it exceeds {item.mag}</Text>
							)}
							// onData={item => ({
							// 	label: item.mag,
							// })}
							// onAllData={(hits, streamHits, loadMore, renderMap, renderPagination) => (
							// 	<View style={{ flex: 1 }}>
							// 		{renderMap()}
							// 		<ScrollView style={{ flex: 1 }}>
							// 			{hits.map(data => (
							// 				<Text style={{ padding: 10 }} key={data._id}>
							// 					{data.place} - {data.mag}
							// 				</Text>
							// 			))}
							// 			{renderPagination()}
							// 		</ScrollView>
							// 	</View>
							// )}
						/>
					</View>
				</ReactiveBase>
			</View>
		);
	}
}

module.exports = Main;
Expo.registerRootComponent(Main);
