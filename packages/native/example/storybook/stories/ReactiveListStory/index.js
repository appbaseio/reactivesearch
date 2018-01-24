import React from 'react';
import { ScrollView, View } from 'react-native';

import {
	ReactiveBase,
	TextField,
	ReactiveList,
} from '@appbaseio/reactivebase-native';

import { onAllDataGitXplore } from '../../helpers';

const ReactiveListStory = props => (
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
				<TextField
					componentId="TextFieldComponent"
					dataField="name"
					placeholder="Search Repos"
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
						and: ['TextFieldComponent'],
					}}
					{...props}
				/>
			</View>
		</ScrollView>
	</ReactiveBase>
);

export default ReactiveListStory;
