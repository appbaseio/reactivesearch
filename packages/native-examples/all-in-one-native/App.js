import React from 'react';
import {
	DatePicker,
	DateRange,
	ReactiveBase,
	ReactiveList,
} from '@appbaseio/reactivesearch-native';
import { ScrollView, Text, View } from 'react-native';
import { Header } from 'react-native/Libraries/NewAppScreen';

export default function App() {
	return (
		<ReactiveBase
			app="airbnb-dev"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
			enableAppbase
		>
			<Header>ReactiveSearch Native</Header>
			<ScrollView>
				<View style={{ padding: 10 }}>
					<DatePicker
						componentId="DateSensor"
						dataField="available_from"
						queryFormat="epoch_millis"
						initialMonth="2022-01-01"
						placeholder="Available From - YYYY-MM-DD"
					/>
					<DateRange
						componentId="DateRangeSensor"
						dataField="available_from"
						queryFormat="epoch_millis"
						initialMonth="2022-01-01"
					/>
					<ReactiveList
						componentId="ReactiveList"
						size={20}
						dataField="name"
						from={0}
						pagination
						react={{
							and: ['DateSensor', 'DateRangeSensor'],
						}}
						onAllData={data => (
							<ScrollView>
								<Text>
									{JSON.stringify(
										data.map(item =>
											new Date(item.available_from).toString(),
										),
										null,
										2,
									)}
								</Text>
							</ScrollView>
						)}
					/>
				</View>
			</ScrollView>
		</ReactiveBase>
	);
}
