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
				navigation={navigation}
			/>
		),
	},
	withPlaceholder: {
		navigationOptions: navigationOptionsBuilder('Without placeholder'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownList
				placeholder=""
				navigation={navigation}
			/>
		),
	},
	withSize: {
		navigationOptions: navigationOptionsBuilder('With max size as 5'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownList
				size={6}
				navigation={navigation}
			/>
		),
	},
	withCustomStyles: {
		navigationOptions: navigationOptionsBuilder('With custom styles'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownList
				// title="Series List"
				innerStyle={{
					title: {
						color: 'purple',
					},
					label: {
						color: 'purple',
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
				navigation={navigation}
			/>
		),
	},
	withCustomSort: {
		navigationOptions: navigationOptionsBuilder('With sort Z->A'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownList
				sortBy="desc"
				navigation={navigation}
			/>
		),
	},
	withSelectAll: {
		navigationOptions: navigationOptionsBuilder('With Select All'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownList
				selectAllLabel="All Series"
				navigation={navigation}
			/>
		),
	},
	withDefaultSelected: {
		navigationOptions: navigationOptionsBuilder('With defaultSelected'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownList
				defaultSelected={['Anita Blake', 'Discworld']}
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
				sortBy="count"
				defaultSelected={['Anita Blake', 'Discworld']}
				placeholder="Select multiple series"
				showFilter={false}
				filterLabel="Series filter"
				innerStyle={{
					title: {
						color: 'purple',
					},
					label: {
						color: 'purple',
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
