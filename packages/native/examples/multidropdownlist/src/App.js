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
	DrawerOption1: {
		navigationOptions: navigationOptionsBuilder('Basic', 'ios-home'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownList
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	// DrawerOption2: {
	// 	navigationOptions: navigationOptionsBuilder('With title'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	// 		<MultiDropdownList
	// 			title="Series list"
	// 			showFilter={false}
	// 			navigation={navigation}
	// 		/>
	// 	),
	// },
	DrawerOption3: {
		navigationOptions: navigationOptionsBuilder('With placeholder'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownList
				placeholder="Select multiple series"
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	DrawerOption4: {
		navigationOptions: navigationOptionsBuilder('With size'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownList
				size={10}
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	// DrawerOption5: {
	// 	navigationOptions: navigationOptionsBuilder('With filter'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	//         <MultiDropdownList
	//             showFilter={true}
	//             navigation={navigation}
	//         />
	// 	),
	// },
	DrawerOption6: {
		navigationOptions: navigationOptionsBuilder('With custom sort'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownList
				sortBy="asc"
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	DrawerOption7: {
		navigationOptions: navigationOptionsBuilder('Without count'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownList
				showCount={false}
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	DrawerOption8: {
		navigationOptions: navigationOptionsBuilder('With Select All'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownList
				selectAllLabel="All Series"
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	DrawerOption9: {
		navigationOptions: navigationOptionsBuilder('With defaultSelected'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownList
				defaultSelected={['Anita Blake', 'Discworld']}
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	DrawerOption10: {
		navigationOptions: navigationOptionsBuilder('Playground', 'ios-flask'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownList
				// title="Series List"
				size={30}
				sortBy="asc"
				defaultSelected={['Anita Blake', 'Discworld']}
				placeholder="Select multi series"
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
