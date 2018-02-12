import Expo from 'expo';
import React from 'react';
import { DrawerNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import MultiDropdownList from './MultiDropdownListView';

const navigationOptionsBuilder = (drawerLabel, iconName) => ({
	drawerLabel,
	drawerIcon: iconName ? ({ tintColor, focused }) => ( // eslint-disable-line react/prop-types
		<Ionicons
			name={focused ? `${iconName}` : `${iconName}-outline`}
			size={26}
			style={{ color: tintColor }}
		/>
	) : null,
});

const RootDrawer = DrawerNavigator({
	basic: {
		navigationOptions: navigationOptionsBuilder('Basic', 'ios-home'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownList
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	withPlaceholder: {
		navigationOptions: navigationOptionsBuilder('Without placeholder'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownList
				placeholder=""
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	withSize: {
		navigationOptions: navigationOptionsBuilder('With max size as 5'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownList
				size={6}
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	withCustomStyles: {
		navigationOptions: navigationOptionsBuilder('With custom styles', 'ios-flask'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownList
				// title="Series List"
				size={10}
				defaultSelected={['Anita Blake', 'Discworld']}
				placeholder="Select multiple series"
				showFilter={false}
				filterLabel="Series filter"
				innerStyle={{
					icon: {
						color: 'white',
					},
					title: {
						color: 'white',
					},
					label: {
						color: 'purple',
					},
					header: {
						backgroundColor: 'purple',
					},
					checkbox: {
						color: 'purple',
					},
				}}
				navigation={navigation}
			/>
		),
	},
	withoutCount: {
		navigationOptions: navigationOptionsBuilder('Without count'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownList
				showCount={false}
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	withCustomSort: {
		navigationOptions: navigationOptionsBuilder('With sort Z->A'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownList
				sortBy="desc"
				showCount={false}
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	withSelectAll: {
		navigationOptions: navigationOptionsBuilder('With Select All'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownList
				selectAllLabel="All Series"
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	withDefaultSelected: {
		navigationOptions: navigationOptionsBuilder('With defaultSelected'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownList
				defaultSelected={['Anita Blake', 'Discworld']}
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	playground: {
		navigationOptions: navigationOptionsBuilder('Playground', 'ios-flask'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownList
				// title="Series List"
				size={10}
				sortBy="desc"
				defaultSelected={['Anita Blake', 'Discworld']}
				placeholder="Select multiple series"
				showFilter={false}
				filterLabel="Series filter"
				innerStyle={{
					icon: {
						color: 'white',
					},
					title: {
						color: 'white',
					},
					label: {
						color: 'purple',
					},
					header: {
						backgroundColor: 'purple',
					},
					checkbox: {
						color: 'purple',
					},
				}}
				navigation={navigation}
			/>
		),
	},
});

const Navigator = () => (
	<RootDrawer />
);

module.exports = Navigator;
Expo.registerRootComponent(Navigator);
