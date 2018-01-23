import Expo from 'expo';
import React from 'react';
import { View } from 'react-native';
import { DrawerNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import DataSearch from './DataSearchView';

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
		screen: DataSearch,
	},
	DrawerOption2: {
		navigationOptions: navigationOptionsBuilder('With title'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<DataSearch
				title="Books Search"

			/>
		),
	},
	DrawerOption3: {
		navigationOptions: navigationOptionsBuilder('Without search icon'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<DataSearch
				placeholder="Search Books..."
				showFilter={false}
				showIcon={false}
				navigation={navigation}
			/>
		),
	},
	DrawerOption4: {
		navigationOptions: navigationOptionsBuilder('With iconPosition'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<DataSearch
				placeholder="Search Books..."
				showFilter={false}
				iconPosition="left"
				navigation={navigation}
			/>
		),
	},
	DrawerOption5: {
		navigationOptions: navigationOptionsBuilder('With custom icon'),
		screen: ({ navigation }) => ( // eslint-disable-line
			<DataSearch
				placeholder="Search Books..."
				showFilter={false}
				icon={<View>📚</View>} // eslint-disable-line
				iconPosition="left"
				navigation={navigation}
			/>
		),
	},
	// DrawerOption6: {
	// 	navigationOptions: navigationOptionsBuilder('With filter'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	// 		<DataSearch
	// 			placeholder="Search Books..."
	// 			showFilter
	// 			filterLabel="Books filter"
	// 			navigation={navigation}
	// 		/>
	// 	),
	// },
	// DrawerOption7: {
	// 	navigationOptions: navigationOptionsBuilder('With debounce'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	// 		<DataSearch
	// 			placeholder="Search Books..."
	// 			showFilter={false}
	// 			debounce={300}
	// 			navigation={navigation}
	// 		/>
	// 	),
	// },
	// DrawerOption8: {
	// 	navigationOptions: navigationOptionsBuilder('Without autosuggest'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	// 		<DataSearch
	// 			placeholder="Search Books..."
	// 			autosuggest={false}
	// 			showFilter={false}
	// 			navigation={navigation}
	// 		/>
	// 	),
	// },
	// DrawerOption9: {
	// 	navigationOptions: navigationOptionsBuilder('With defaultSelected'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	// 		<DataSearch
	// 			placeholder="Search Books..."
	// 			showFilter={false}
	// 			defaultSelected="Harry Potter"
	// 			navigation={navigation}
	// 		/>
	// 	),
	// },
	// DrawerOption10: {
	// 	navigationOptions: navigationOptionsBuilder('With defaultSuggestions'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	// 		<DataSearch
	// 			placeholder="Search Books..."
	// 			showFilter={false}
	// 			defaultSuggestions={[
	// 				{ label: 'Sherlock Holmes', value: 'Sherlock Holmes' },
	// 				{ label: 'The Lord of the Rings', value: 'The Lord of the Rings' },
	// 			]}
	// 			navigation={navigation}
	// 		/>
	// 	),
	// },
	// DrawerOption11: {
	// 	navigationOptions: navigationOptionsBuilder('With fieldWeights'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	// 		<DataSearch
	// 			placeholder="Search Books..."
	// 			fieldWeights={[1, 3]}
	// 			showFilter={false}
	// 			navigation={navigation}
	// 		/>
	// 	),
	// },
	// DrawerOption12: {
	// 	navigationOptions: navigationOptionsBuilder('With fuzziness as a number'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	// 		<DataSearch
	// 			placeholder="Search Books..."
	// 			showFilter={false}
	// 			fuzziness={1}
	// 			navigation={navigation}
	// 		/>
	// 	),
	// },
	// DrawerOption13: {
	// 	navigationOptions: navigationOptionsBuilder('With fuzziness as AUTO'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	// 		<DataSearch
	// 			placeholder="Search Books..."
	// 			showFilter={false}
	// 			fuzziness="AUTO"
	// 			navigation={navigation}
	// 		/>
	// 	),
	// },
	// DrawerOption14: {
	// 	navigationOptions: navigationOptionsBuilder('With highlight'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	// 		<DataSearch
	// 			placeholder="Search Books..."
	// 			showFilter={false}
	// 			highlight
	// 			navigation={navigation}
	// 		/>
	// 	),
	// },
	// DrawerOption15: {
	// 	navigationOptions: navigationOptionsBuilder('With queryFormat'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	// 		<DataSearch
	// 			placeholder="Search Books..."
	// 			showFilter={false}
	// 			queryFormat="and"
	// 			navigation={navigation}
	// 		/>
	// 	),
	// },
	// DrawerOption16: {
	// 	navigationOptions: navigationOptionsBuilder('Playground'),
	// 	screen: ({ navigation }) => ( // eslint-disable-line
	// 		<DataSearch
	// 			title="DataSearch: Books..."
	// 			placeholder="Search Books..."
	// 			autosuggest
	// 			fieldWeights={[1, 3]}
	// 			fuzziness={1}
	// 			queryFormat="or"
	// 			showFilter
	// 			iconPosition="left"
	// 			filterLabel="Books filter"
	// 			highlight={false}
	// 			navigation={navigation}
	// 		/>
	// 	),
	// },
});

const Navigator = () => (
	<RootDrawer />
);

module.exports = Navigator;
Expo.registerRootComponent(Navigator);
