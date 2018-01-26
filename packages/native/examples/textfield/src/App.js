import Expo from 'expo';
import React from 'react';
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
	DrawerOption1: {
		navigationOptions: navigationOptionsBuilder('Basic'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<TextField
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	DrawerOption2: {
		navigationOptions: navigationOptionsBuilder('With title'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<TextField
				title="Search books"
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	DrawerOption3: {
		navigationOptions: navigationOptionsBuilder('With defaultSelected'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<TextField
				defaultSelected="The Murder of Roger Ackroyd"
				title="Search books"
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	// DrawerOption4: {
	// 	navigationOptions: navigationOptionsBuilder('With filter'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	//         <TextField
	//             title="Search books"
	//             showFilter={true}
	//             navigation={navigation}
	//         />
	// 	),
	// },
	DrawerOption5: {
		navigationOptions: navigationOptionsBuilder('With debounce'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<TextField
				title="Search books"
				debounce={300}
				showFilter={false}
				navigation={navigation}
			/>
		),
	},
	DrawerOption6: {
		navigationOptions: navigationOptionsBuilder('Playground'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<TextField
				title="Books Search"
				placeholder="Search for books"
				defaultSelected="The Hitchhiker's Guide to the Galaxy"
				showFilter={false}
				filterLabel="Books filter"
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
