import Expo from 'expo';
import React, { Component } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { Text, Header, Body, Title } from 'native-base';

import {
	ReactiveBase,
	DataSearch,
	TextField,
	SingleDropdownList,
	SingleDropdownRange,
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
			Roboto: require('native-base/Fonts/Roboto.ttf'), // eslint-disable-line global-require
			Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'), // eslint-disable-line global-require
			Ionicons: require('native-base/Fonts/Ionicons.ttf'), // eslint-disable-line global-require
		});

		this.setState({ isReady: true });
	}

	onAllData = (items, streamData, loadMore) => {
		console.log('streamData: ', streamData);
		return (
			<FlatList
				style={{ width: '100%' }}
				data={items || []}
				keyExtractor={item => item._id}
				renderItem={({ item }) => (
					<View style={{ margin: 5 }}>
						<Text
							style={{ flex: 1, fontWeight: 'bold' }}
						>
							{this.parseToElement(item.name)}
						</Text>
						<Text>{item.brand} - {item.model}</Text>
					</View>
				)}
				onEndReachedThreshold={0.5}
				onEndReached={loadMore}
			/>
		)
	};

	parseToElement = (str) => {
		const start = str.indexOf('<em>');
		const end = str.indexOf('</em>');

		if (start > -1) {
			const pre = str.substring(0, start);
			const highlight = str.substring(start + 4, end);
			const post = str.substring(end + 5, str.length);

			return (
				<Text style={{ flex: 1, fontWeight: 'bold' }}>
					{pre}
					<Text style={{ backgroundColor: 'yellow' }}>{highlight}</Text>
					{this.parseToElement(post)}
				</Text>
			);
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
				<Header>
					<Body>
						<Title>ReactiveSearch Native</Title>
					</Body>
				</Header>
				<ScrollView>
					<View style={{ padding: 10 }}>
						<SingleDropdownList
							componentId="StComponent"
							dataField="brand.raw"
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
								start: '2017-04-04',
								end: '2017-04-10',
							}}
						/>

						<SingleDropdownRange
							componentId="SingleDropdownRange"
							dataField="price"
							data={[
								{ start: 0, end: 100, label: 'Cheap' },
								{ start: 101, end: 200, label: 'Moderate' },
								{ start: 201, end: 500, label: 'Pricey' },
								{ start: 501, end: 1000, label: 'First Date' },
							]}
							defaultSelected="Pricey"
						/>

						<DataSearch
							componentId="DataSearchComponent"
							dataField="name"
							defaultSelected="Nissan"
							react={{
								and: 'TextFieldComponent',
							}}
						/>

						<ReactiveList
							dataField="name"
							componentId="ReactiveList"
							size={20}
							onAllData={this.onAllData}
							pagination
							stream
							defaultQuery={() => ({
								query: {
									match_all: {},
								},
								sort: {
									price: { order: 'asc' },
								},
							})}
							react={{
								and: [
									'DataSearchComponent',
									'TextFieldComponent',
									'SingleDropdownRange',
								],
							}}
						/>
					</View>
				</ScrollView>
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
