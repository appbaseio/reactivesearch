import React from 'react';
import { View, FlatList } from 'react-native';
import { Text } from 'native-base';

const parseToElement = (str) => {
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
				{parseToElement(post)}
			</Text>
		);
	}

	return str;
};

export const onAllData = (items, loadMore) => (<FlatList
	style={{ width: '100%' }}
	data={items || []}
	keyExtractor={item => item._id}
	renderItem={({ item }) => (
		<View style={{ margin: 5 }}>
			<Text style={{ flex: 1, fontWeight: 'bold' }}>{parseToElement(item._source.name)}</Text>
			<Text>{parseToElement(item._source.brand)} - {parseToElement(item._source.model)}</Text>
		</View>
	)}
	onEndReachedThreshold={0.5}
	onEndReached={loadMore}
/>);

export const onAllDataGitXplore = (items, loadMore) => (<FlatList
	style={{ width: '100%' }}
	data={items || []}
	keyExtractor={item => item._id}
	renderItem={({ item }) => (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
				padding: 10,
				borderWidth: 1,
				borderColor: 'mediumseagreen',
				borderStyle: 'dashed',
				borderRadius: 5,
				marginBottom: 5,
			}}
		>
			<Text style={{ fontWeight: 'bold' }}>{parseToElement(item._source.name)}</Text>
			<Text>{item._source.stars} <span role="img" aria-label="img">🌟</span></Text>
		</View>
	)}
	onEndReachedThreshold={0.5}
	onEndReached={loadMore}
/>);
