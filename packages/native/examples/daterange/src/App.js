import Expo from 'expo';
import React from 'react';
import { DrawerNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import DateRange from './DateRangeView';

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
			<DateRange
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	// withTitle: {
	// 	navigationOptions: navigationOptionsBuilder('With title'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	// 		<DateRange
	// 			title="Choose a date range"
	// 			showFilter={false}
	// 			navigation={navigation}
	// 		/>
	// 	),
	// },
	withPlaceholder: {
		navigationOptions: navigationOptionsBuilder('With placeholder'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<DateRange
				placeholder="Choose dates"
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	// withoutshowClear: {
	// 	navigationOptions: navigationOptionsBuilder('Without showClear'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	// 		<DateRange
	// 			showClear={false}
	// 			showFilter={false}
	// 			navigation={navigation}
	// 		/>
	// 	),
	// },
	// withFilter: {
	// 	navigationOptions: navigationOptionsBuilder('With filter'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	//         <DateRange
	//             showFilter={true}
	//             navigation={navigation}
	//         />
	// 	),
	// },
	// showMoreThanOneMonth: {
	// 	navigationOptions: navigationOptionsBuilder('Show more than 1 month'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	//         <DateRange
	//             numberOfMonths={2}
	//             showFilter={false}
	//             navigation={navigation}
	//         />
	// 	),
	// },
	withDefaultSelected: {
		navigationOptions: navigationOptionsBuilder('With defaultSelected'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<DateRange
				defaultSelected={{
					start: new Date('2017-04-07'),
					end: new Date('2017-04-14'),
				}}
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	withQueryFormat: {
		navigationOptions: navigationOptionsBuilder('With queryFormat'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<DateRange
				showFilter={false}
				queryFormat="date_time_no_millis"
				navigation={navigation}
			/>
		),
	},
	playground: {
		navigationOptions: navigationOptionsBuilder('Playground', 'ios-flask'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<DateRange
				// title="Date Picker"
				placeholder="Pick dates"
				numberOfMonths={1}
				queryFormat="date_time_no_millis"
				defaultSelected={{
					start: new Date('2017-01-01'),
					end: new Date('2017-01-05'),
				}}
				showFilter={false}
				filterLabel="Date Range"
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
