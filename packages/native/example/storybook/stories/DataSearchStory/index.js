import React from 'react';
import { ScrollView } from 'react-native';

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
		<ScrollView>
			<DataSearch
				componentId="DataSearchComponent"
				dataField={['name', 'brand', 'model']}
				{...props}
			/>
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
		</ScrollView>
	</ReactiveBase>
);

export default DataSearchStory;
