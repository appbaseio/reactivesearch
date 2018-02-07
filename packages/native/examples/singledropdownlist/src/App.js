import Expo from 'expo';
import React from 'react';
import { DrawerNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import SingleDropdownList from './SingleDropdownListView';

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
			<SingleDropdownList
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	withoutPlaceholder: {
		navigationOptions: navigationOptionsBuilder('Without placeholder'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<SingleDropdownList
				placeholder=""
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	withSize: {
		navigationOptions: navigationOptionsBuilder('With max size as 5'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<SingleDropdownList
				size={6}
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	withoutCount: {
		navigationOptions: navigationOptionsBuilder('Without count'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<SingleDropdownList
				showCount={false}
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	withCustomSort: {
		navigationOptions: navigationOptionsBuilder('With sort Z->A'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<SingleDropdownList
				sortBy="desc"
				showCount={false}
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	withSelectAll: {
		navigationOptions: navigationOptionsBuilder('With SelectAll option'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<SingleDropdownList
				selectAllLabel="All Series"
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	withDefaultSelected: {
		navigationOptions: navigationOptionsBuilder('With defaultSelected'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<SingleDropdownList
				defaultSelected="Discworld"
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	playground: {
		navigationOptions: navigationOptionsBuilder('Playground', 'ios-flask'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<SingleDropdownList
				// title="Series List"
				size={100}
				showCount
				sortBy="asc"
				selectAllLabel="All Series"
				defaultSelected="Discworld"
				placeholder="Select one"
				showFilter={false}
				filterLabel="Series filter"
				innerStyle={{
					title: {
						color: 'purple',
					},
					// label: {
					// 	color: 'purple',
					// },
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
