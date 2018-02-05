import Expo from 'expo';
import React from 'react';
import { DrawerNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import SingleDropdownRange from './SingleDropdownRangeView';

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
	DrawerOption1: {
		navigationOptions: navigationOptionsBuilder('Basic', 'ios-home'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<SingleDropdownRange
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	// DrawerOption2: {
	// 	navigationOptions: navigationOptionsBuilder('With title'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	// 		<SingleDropdownRange
	// 			title="Books filter"
	// 			showFilter={false}
	// 			navigation={navigation}
	// 		/>
	// 	),
	// },
	DrawerOption3: {
		navigationOptions: navigationOptionsBuilder('With placeholder'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<SingleDropdownRange
				placeholder="Select a rating"
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	DrawerOption4: {
		navigationOptions: navigationOptionsBuilder('With defaultSelected'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<SingleDropdownRange
				defaultSelected="Rating 3 to 4"
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	// DrawerOption5: {
	// 	navigationOptions: navigationOptionsBuilder('With filter'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	//         <SingleDropdownRange
	//             showFilter={true}
	//             navigation={navigation}
	//         />
	// 	),
	// },
	DrawerOption6: {
		navigationOptions: navigationOptionsBuilder('Playground', 'ios-flask'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<SingleDropdownRange
				// title="Books Filter"
				placeholder="Select a rating"
				defaultSelected="Rating 3 to 4"
				filterLabel="Book filter"
				showFilter={false}
				innerStyle={{
					title: {
						color: 'purple',
					},
					label: {
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
