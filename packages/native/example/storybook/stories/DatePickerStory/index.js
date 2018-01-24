import React from 'react';
import { ScrollView, View } from 'react-native';

import {
	ReactiveBase,
	DatePicker,
	ReactiveList,
} from '@appbaseio/reactivebase-native';

import { onAllDataGitXplore } from '../../helpers';

const DatePickerStory = props => (
	<ReactiveBase
		app="gitxplore-live"
		credentials="bYTSo47tj:d001826a-f4ef-42c5-b0aa-a94f29967ba0"
		type="gitxplore-live"
	>
		<ScrollView
			style={{
				flex: 1,
				paddingTop: 15,
			}}
		>
			<View
				style={{
					backgroundColor: '#F8F8F8',
				}}
			>
				<DatePicker
					componentId="DatePickerComponent"
					dataField="pushed"
					queryFormat="date_time_no_millis"
					{...props}
				/>
			</View>
			<View
				style={{
					flex: 1,
					paddingTop: 15,
				}}
			>
				<ReactiveList
					dataField="name"
					componentId="ReactiveList"
					size={20}
					from={0}
					onAllData={onAllDataGitXplore}
					pagination
					defaultQuery={() => ({
						query: {
							match_all: {},
						},
						sort: {
							stars: { order: 'desc' },
						},
					})}
					react={{
						and: ['DatePickerComponent'],
					}}
				/>
			</View>
		</ScrollView>
	</ReactiveBase>
);

export default DatePickerStory;
