import Expo from 'expo';
import React from 'react';
import { DrawerNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import DatePicker from './DatePickerView';

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
			<DatePicker
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	// withTitle: {
	// 	navigationOptions: navigationOptionsBuilder('With title'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	// 		<DatePicker
	// 			title="Choose a date"
	// 			showFilter={false}
	// 			navigation={navigation}
	// 		/>
	// 	),
	// },
	withPlaceholder: {
		navigationOptions: navigationOptionsBuilder('With placeholder'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<DatePicker
				placeholder="Pick a date"
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	// withFilter: {
	// 	navigationOptions: navigationOptionsBuilder('With filter'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	//         <DatePicker
	//             showFilter={true}
	//             navigation={navigation}
	//         />
	// 	),
	// },
	// withFocus: {
	// 	navigationOptions: navigationOptionsBuilder('With focus'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	//         <DatePicker
	//             focused={true}
	//             showFilter={false}
	//             navigation={navigation}
	//         />
	// 	),
	// },
	// withShowMoreThanMonth: {
	// 	navigationOptions: navigationOptionsBuilder('Show more than 1 month'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	//         <DatePicker
	//             numberOfMonths={2}
	//             showFilter={false}
	//             navigation={navigation}
	//         />
	// 	),
	// },
	withInitialMonth: {
		navigationOptions: navigationOptionsBuilder('With initialMonth'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<DatePicker
				initialMonth="05-05-2017"
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	// withoutClearButton: {
	// 	navigationOptions: navigationOptionsBuilder('Without clear button'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	//         <DatePicker
	//             showClear={false}
	//             showFilter={false}
	//             navigation={navigation}
	//         />
	// 	),
	// },
	// withoutClickUnselectsDay: {
	// 	navigationOptions: navigationOptionsBuilder('Without clickUnselectsDay'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	//         <DatePicker
	//             clickUnselectsDay={fasle}
	//             showFilter={false}
	//             navigation={navigation}
	//         />
	// 	),
	// },
	// withQueryFormat: {
	// 	navigationOptions: navigationOptionsBuilder('With queryFormat'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	// 		<DatePicker
	// 			queryFormat="date_time_no_millis"
	// 			showFilter={false}
	// 			navigation={navigation}
	// 		/>
	// 	),
	// },
	playground: {
		navigationOptions: navigationOptionsBuilder('Playground', 'ios-flask'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<DatePicker
				// title="Date Picker"
				placeholder="Choose a date"
				queryFormat="date_time_no_millis"
				showFilter={false}
				filterLabel="Date"
				innerStyle={{
					theme: {
						backgroundColor: '#f2f2f2',
						calendarBackground: '#f2f2f2',
						textSectionTitleColor: '#ffb3ff',
						selectedDayBackgroundColor: 'purple',
						selectedDayTextColor: '#f2f2f2',
						todayTextColor: 'purple',
						dayTextColor: '#cc00cc',
						textDisabledColor: '#ffb3ff',
						dotColor: 'purple',
						selectedDotColor: '#f2f2f2',
						arrowColor: 'purple',
						monthTextColor: 'purple',
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
