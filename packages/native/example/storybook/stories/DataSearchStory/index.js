import React from 'react';
import { ScrollView, View } from 'react-native';

import {
	ReactiveBase,
	DataSearch,
	ReactiveList,
} from '@appbaseio/reactivebase-native';

import { onAllData } from '../../helpers';

const DataSearchStory = props => (
	<ReactiveBase
		app="car-store"
		credentials="cf7QByt5e:d2d60548-82a9-43cc-8b40-93cbbe75c34c"
		type="cars"
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
				<DataSearch
					componentId="DataSearchComponent"
					dataField={['name', 'brand', 'model']}
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
					onAllData={onAllData}
					pagination
					defaultQuery={() => ({
						query: {
							match_all: {},
						},
						sort: {
							price: { order: 'asc' },
						},
					})}
					react={{
						and: ['DataSearchComponent'],
					}}
				/>
			</View>
		</ScrollView>
	</ReactiveBase>
);

export default DataSearchStory;
