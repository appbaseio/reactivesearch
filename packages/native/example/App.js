import Expo from 'expo';
import React, { Component } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { Text, Header, Body, Title } from 'native-base';

import {
	ReactiveBase,
	DataSearch,
	TextField,
	SingleDropdownList,
	MultiDropdownList,
	SingleDropdownRange,
	MultiDropdownRange,
	RangeSlider,
	DatePicker,
	DateRange,
	ReactiveList,
	SelectedFilters,
} from '@appbaseio/reactivesearch-native';

class Main extends Component {
	state = {
		isReady: false,
	};

	async componentWillMount() {
		await Expo.Font.loadAsync({
			Roboto: require('native-base/Fonts/Roboto.ttf'), // eslint-disable-line global-require
			Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'), // eslint-disable-line global-require
			Ionicons: require('@expo/vector-icons/fonts/Ionicons.ttf'), // eslint-disable-line global-require
		});

		this.setState({ isReady: true });
	}

	onAllData = (items, streamData, loadMore) => (
		<FlatList
			style={{ width: '100%' }}
			data={items || []}
			keyExtractor={item => item._id}
			renderItem={({ item }) => (
				<View style={{ margin: 5 }}>
					<Text style={{ flex: 1, fontWeight: 'bold' }}>
						{this.parseToElement(item.name)}
					</Text>
					<Text>
						{item.brand} - {item.model}
					</Text>
				</View>
			)}
			onEndReachedThreshold={0.5}
			onEndReached={loadMore}
		/>
	);

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
	};

	render() {
		if (!this.state.isReady) {
			return <Text>Loading...</Text>;
		}

		return (
			<ReactiveBase
				app="carstore-dataset"
				credentials="4HWI27QmA:58c731f7-79ab-4f55-a590-7e15c7e36721"
				// theme={{
				// 	textColor: 'yellow',
				// }}
			>
				<Header>
					<Body>
						<Title>ReactiveSearch Native</Title>
					</Body>
				</Header>
				<ScrollView>
					<View style={{ padding: 10 }}>
						<SelectedFilters />
						<SingleDropdownList componentId="StComponent" dataField="brand.keyword" />

						<MultiDropdownList
							componentId="MultiDropdownListComponent"
							dataField="brand.keyword"
							selectAllLabel="All"
						/>

						<DatePicker dataField="year" componentId="DatePicker" />

						<DateRange
							dataField="year"
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

						<MultiDropdownRange
							componentId="MultiDropdownRange"
							dataField="price"
							data={[
								{ start: 0, end: 100, label: 'Cheap' },
								{ start: 101, end: 200, label: 'Moderate' },
								{ start: 201, end: 500, label: 'Pricey' },
								{ start: 501, end: 1000, label: 'First Date' },
							]}
							defaultSelected={['Pricey', 'First Date']}
							innerStyle={{
								checkbox: {
									color: 'yellow',
								},
							}}
						/>

						<RangeSlider
							componentId="RangeSlider"
							dataField="rating"
							range={{
								start: 0,
								end: 5,
							}}
						/>

						<DataSearch
							componentId="DataSearchComponent"
							dataField="model"
							defaultSelected="Nissan"
							react={{
								and: 'TextFieldComponent',
							}}
						/>

						<ReactiveList
							dataField="model"
							componentId="ReactiveList"
							size={20}
							onAllData={this.onAllData}
							pagination
							stream
							react={{
								and: ['DataSearchComponent', 'StComponent'],
							}}
						/>
					</View>
				</ScrollView>
			</ReactiveBase>
		);
	}
}

module.exports = Main;
Expo.registerRootComponent(Main);
