import Expo from 'expo';
import React from 'react';
import { DrawerNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import MultiDropdownRange from './MultiDropdownRangeView';

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
			<MultiDropdownRange
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	// DrawerOption2: {
	// 	navigationOptions: navigationOptionsBuilder('With title'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	// 		<MultiDropdownRange
	// 			title="Ratings list"
	// 			showFilter={false}
	// 			navigation={navigation}
	// 		/>
	// 	),
	// },
	DrawerOption3: {
		navigationOptions: navigationOptionsBuilder('With placeholder'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownRange
				placeholder="Select ratings"
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	// DrawerOption4: {
	// 	navigationOptions: navigationOptionsBuilder('With size'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	// 		<MultiDropdownRange
	// 			size={2}
	// 			showFilter={false}
	// 			navigation={navigation}
	// 		/>
	// 	),
	// },
	// DrawerOption5: {
	// 	navigationOptions: navigationOptionsBuilder('With filter'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	//         <MultiDropdownRange
	//             showFilter={true}
	//             navigation={navigation}
	//         />
	// 	),
	// },
	// DrawerOption6: {
	// 	navigationOptions: navigationOptionsBuilder('With custom sort'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	// 		<MultiDropdownRange
	// 			sortBy="asc"
	// 			showFilter={false}
	// 			navigation={navigation}
	// 		/>
	// 	),
	// },
	// DrawerOption7: {
	// 	navigationOptions: navigationOptionsBuilder('Without count'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	// 		<MultiDropdownRange
	// 			showCount={false}
	// 			showFilter={false}
	// 			navigation={navigation}
	// 		/>
	// 	),
	// },
	// DrawerOption8: {
	// 	navigationOptions: navigationOptionsBuilder('With Select All'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	// 		<MultiDropdownRange
	// 			selectAllLabel="All Ratings"
	// 			showFilter={false}
	// 			navigation={navigation}
	// 		/>
	// 	),
	// },
	DrawerOption9: {
		navigationOptions: navigationOptionsBuilder('With defaultSelected'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownRange
				defaultSelected={['Rating 3 to 4']}
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	DrawerOption10: {
		navigationOptions: navigationOptionsBuilder('Playground', 'ios-flask'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownRange
				// title="Ratings list"
				size={100}
				sortBy="asc"
				selectAllLabel="All Ratings"
				defaultSelected={['Rating 3 to 4']}
				placeholder="Select ratings"
				showFilter={false}
				filterLabel="Ratings filter"
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
