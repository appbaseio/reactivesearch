import { registerRootComponent, Font } from 'expo';
import React, { Component } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { Text, Header, Body, Title } from 'native-base';

import {
	ReactiveBase,
	DataSearch,
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
		await Font.loadAsync({
			Roboto: require('native-base/Fonts/Roboto.ttf'), // eslint-disable-line global-require
			Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'), // eslint-disable-line global-require
			Ionicons: require('@expo/vector-icons/fonts/Ionicons.ttf'), // eslint-disable-line global-require
		});

		this.setState({ isReady: true });
	}

	onAllData = (items, loadMore) => (
		<FlatList
			style={{ width: '100%' }}
			data={items || []}
			keyExtractor={item => item._id}
			renderItem={({ item }) => (
				<View style={{ margin: 5 }}>
					<Text style={{ flex: 1, fontWeight: 'bold' }}>
						{this.parseToElement(item.original_title)}
					</Text>
					<Text>
						{item.authors} - {item.language_code} - {item.original_publication_year}
					</Text>
				</View>
			)}
			onEndReachedThreshold={0.5}
			onEndReached={loadMore}
		/>
	);

	parseToElement = (str) => {
		if (!str) return null;
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
				app="good-books-ds"
				url="https://reactivesearch-api-9-4-0.onrender.com"
				credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
			>
				<Header>
					<Body>
						<Title>ReactiveSearch Native</Title>
					</Body>
				</Header>
				<ScrollView>
					<View style={{ padding: 10 }}>
						<SelectedFilters />
						<SingleDropdownList componentId="StComponent" dataField="language_code.keyword" />

						<MultiDropdownList
							componentId="MultiDropdownListComponent"
							dataField="language_code.keyword"
							selectAllLabel="All"
						/>

						<DatePicker dataField="original_publication_year" componentId="DatePicker" />

						<DateRange
							dataField="original_publication_year"
							componentId="DateRange"
							defaultSelected={{
								start: '1990-01-01',
								end: '2010-12-31',
							}}
						/>

						<SingleDropdownRange
							componentId="SingleDropdownRange"
							dataField="ratings_count"
							data={[
								{ start: 0, end: 1000, label: 'Few ratings' },
								{ start: 1001, end: 10000, label: 'Moderate ratings' },
								{ start: 10001, end: 50000, label: 'Popular' },
								{ start: 50001, end: 1000000, label: 'Bestseller' },
							]}
							defaultSelected="Popular"
						/>

						<MultiDropdownRange
							componentId="MultiDropdownRange"
							dataField="ratings_count"
							data={[
								{ start: 0, end: 1000, label: 'Few ratings' },
								{ start: 1001, end: 10000, label: 'Moderate ratings' },
								{ start: 10001, end: 50000, label: 'Popular' },
								{ start: 50001, end: 1000000, label: 'Bestseller' },
							]}
							defaultSelected={['Popular', 'Bestseller']}
							innerStyle={{
								checkbox: {
									color: 'yellow',
								},
							}}
						/>

						<RangeSlider
							componentId="RangeSlider"
							dataField="average_rating"
							range={{
								start: 0,
								end: 5,
							}}
						/>

						<DataSearch
							componentId="DataSearchComponent"
							dataField={['original_title', 'original_title.search']}
							defaultSelected="Harry Potter"
							react={{
								and: 'TextFieldComponent',
							}}
						/>

						<ReactiveList
							dataField="original_title.keyword"
							componentId="ReactiveList"
							size={20}
							onAllData={this.onAllData}
							pagination
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
registerRootComponent(Main);
