import Expo from 'expo';
import React, { Component } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { Text, Header, Body, Title } from 'native-base';

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
	ReactiveList,
} from '@appbaseio/reactivebase-native';

import StorybookUI from '../storybook';

class Main extends Component {
	state = {
		isReady: false,
	}

	async componentWillMount() {
		await Expo.Font.loadAsync({
			Roboto: require('native-base/Fonts/Roboto.ttf'),
			Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
			Ionicons: require('native-base/Fonts/Ionicons.ttf'),
		});

		this.setState({ isReady: true });
	}

	onAllData = (items, loadMore) => (<FlatList
		style={{ width: '100%' }}
		data={items || []}
		keyExtractor={item => item._id}
		renderItem={({ item }) => (<View style={{ margin: 5 }}>
			<Text style={{ flex: 1, fontWeight: 'bold' }}>{this.parseToElement(item._source.name)}</Text>
			<Text>{item._source.brand} - {item._source.model}</Text>
		</View>)}
		onEndReachedThreshold={0.5}
		onEndReached={loadMore}
	/>)

	parseToElement = (str) => {
		const start = str.indexOf('<em>');
		const end = str.indexOf('</em>');

		if (start > -1) {
			const pre = str.substring(0, start);
			const highlight = str.substring(start + 4, end);
			const post = str.substring(end + 5, str.length);

			return (<Text style={{ flex: 1, fontWeight: 'bold' }}>
				{pre}
				<Text style={{ backgroundColor: 'yellow' }}>{highlight}</Text>
				{this.parseToElement(post)}
			</Text>);
		}

		return str;
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
				<Text>It works!</Text>
			</ReactiveBase>
		);
	}
}

if (process.env.RUN === 'storybook') {
	module.exports = StorybookUI;
	Expo.registerRootComponent(StorybookUI);
} else {
	module.exports = Main;
	Expo.registerRootComponent(Main);
}
