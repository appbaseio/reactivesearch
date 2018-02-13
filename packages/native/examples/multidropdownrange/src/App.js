import React, { Component } from 'react';
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
				navigation={navigation}
			/>
		),
	},
	withoutPlaceholder: {
		navigationOptions: navigationOptionsBuilder('Without placeholder'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownRange
				placeholder=""
				navigation={navigation}
			/>
		),
	},
	withDefaultSelected: {
		navigationOptions: navigationOptionsBuilder('With defaultSelected'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownRange
				defaultSelected={['Rating 3 to 4']}
				navigation={navigation}
			/>
		),
	},
	withCustomStyles: {
		navigationOptions: navigationOptionsBuilder('With custom styles'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownRange
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
	playground: {
		navigationOptions: navigationOptionsBuilder('Playground', 'ios-flask'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<MultiDropdownRange
				defaultSelected={['Rating 3 to 4']}
				placeholder="Select ratings"
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

class App extends Component {
	state: {};
	render() {
		return <RootDrawer />;
	}
}

export default App;
