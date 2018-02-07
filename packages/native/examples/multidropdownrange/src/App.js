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
	basic: {
		navigationOptions: navigationOptionsBuilder('Basic', 'ios-home'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownRange
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	withoutPlaceholder: {
		navigationOptions: navigationOptionsBuilder('Without placeholder'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownRange
				placeholder=""
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	withDefaultSelected: {
		navigationOptions: navigationOptionsBuilder('With defaultSelected'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownRange
				defaultSelected={['Rating 3 to 4']}
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	playground: {
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
