import React, { Component } from 'react';
import { DrawerNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import TextField from './TextFieldView';

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
			<TextField
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	withoutPlaceholder: {
		navigationOptions: navigationOptionsBuilder('Without placeholder'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<TextField
				placeholder=""
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	withDefaultSelected: {
		navigationOptions: navigationOptionsBuilder('With defaultSelected'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<TextField
				defaultSelected="The Murder of Roger Ackroyd"
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	withCustomStyles: {
		navigationOptions: navigationOptionsBuilder('With custom styles'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<TextField
				// title="Books Search"
				placeholder="Search for a book title"
				defaultSelected="Harry Potter"
				showFilter={false}
				innerStyle={{
					icon: {
						color: 'purple',
					},
					input: {
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
			<TextField
				// title="Books Search"
				placeholder="Search for a book title"
				defaultSelected="Harry Potter"
				showFilter={false}
				filterLabel="Books filter"
				innerStyle={{
					icon: {
						color: 'purple',
					},
					input: {
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
