import Expo from 'expo';
import React, { Component } from 'react';
import {
	FlatList,
	Linking,
	Platform,
	ScrollView,
	StatusBar,
	TouchableOpacity,
	View,
} from 'react-native';
import {
	Body,
	Button,
	Card,
	CardItem,
	Header,
	Left,
	Right,
	Spinner,
	Text,
	Thumbnail,
	Title,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { web } from 'react-native-communications';

import {
	DateRange,
	ReactiveBase,
	ReactiveList,
} from '@appbaseio/reactivebase-native';

import { GITXPLORE as APPBASE_CONFIG } from './../../common/credentials';

import {
	DEFAULT_COLORS as COLORS,
	commonStyles as common,
} from './../../common/helpers';

import styles from './Styles';

const COMPONENT_DEMO = 'DateRange';

export default class Main extends Component {
	render() {
		const { isReady } = this.state;
		const { navigation, ...storyProps } = this.props;  // eslint-disable-line

		const isIOS = Platform.OS === 'ios';

		const headerColor = isIOS ? '#1A237E' : 'white';

		if (!isReady) {
			return (
				<View style={common.alignCenter}>
					<StatusBar
						backgroundColor={COLORS.primary}
						barStyle="light-content"
					/>
					{this.renderStatusBar()}
					<Spinner color={COLORS.primary} />
				</View>
			);
		}

		const header = (
			<Header style={styles.header}>
				<Left>
					<Button
						transparent
						onPress={() => navigation.navigate('DrawerToggle')}
					>
						<Ionicons
							name="md-menu"
							size={25}
							color={headerColor}
						/>
					</Button>
				</Left>
				<Body>
					<Title
						style={{ color: headerColor, fontSize: 18 }}
					>
						{ COMPONENT_DEMO }
					</Title>
				</Body>
				{isIOS && (
					<Right>
						<Button
							transparent
							onPress={() => Linking.openURL('exp://+')}
						>
							<Ionicons
								name="ios-arrow-back"
								size={25}
								color={headerColor}
							/>
						</Button>
					</Right>
				)}
			</Header>
		);

		const componentMarkup = (
			<View style={styles.componentContainer}>
				<DateRange
					componentId="DateRangeSensor"
					placeholder="Select dates"
					dataField="pushed"
					queryFormat="date_time_no_millis"
					{...storyProps} // injecting props from navigator drawer story
				/>
			</View>
		);

		return (
			<ReactiveBase
				app={APPBASE_CONFIG.app}
				credentials={APPBASE_CONFIG.credentials}
				type={APPBASE_CONFIG.type}
			>
				{this.renderStatusBar()}
				{header}
				{componentMarkup}
				<ScrollView>
					<View style={[common.container, common.column]}>
						<View
							style={[common.fullWidth, common.alignCenter, styles.results]}
						>
							<ReactiveList
								componentId="ReactiveList"
								dataField="original_title"
								size={5}
								onAllData={this.onAllData}
								// onData={this.itemCardMarkup}
								pagination
								paginationAt="bottom"
								react={{
									and: ['DateRangeSensor'],
								}}
								showResultStats={false}
								defaultQuery={
									() => ({
										query: {
											match_all: {},
										},
									})
								}
							/>
						</View>
					</View>
				</ScrollView>
			</ReactiveBase>
		);
	}

	state = {
		isReady: false,
	}

	async componentWillMount() {
		await Expo.Font.loadAsync({
			Roboto: require('native-base/Fonts/Roboto.ttf'), // eslint-disable-line global-require
			Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'), // eslint-disable-line global-require
			Ionicons: require('native-base/Fonts/Ionicons.ttf'), // eslint-disable-line global-require
		});

		this.setState({
			isReady: true,
		});
	}

	// TODO: Complete markup
	itemCardMarkup = item => (
		<TouchableOpacity onPress={() => web(item.url)} key={item._id}>
			<View style={[styles.fullWidth, { paddingHorizontal: 25, paddingVertical: 10 }]}>
				<Card>
					<CardItem>
						<Body style={{ alignItems: 'center' }}>
							<Thumbnail
								source={{ uri: item.avatar }}
							/>
							<Text
								onPress={() => web(item.url)}
								style={{
									fontWeight: 'bold', color: COLORS.primary, paddingBottom: 5, paddingTop: 5,
								}}
							>
								{item.owner}/{item.name}
							</Text>
							<Text style={{ paddingBottom: 15, textAlign: 'center' }}>{item.description}</Text>
						</Body>
					</CardItem>
				</Card>
			</View>
		</TouchableOpacity>
	)

	onAllData = items => (
		<FlatList
			style={styles.listContainer}
			data={items || []}
			keyExtractor={item => item._id}
			renderItem={
				({ item }) => this.itemCardMarkup(item)
			}
		/>
	)

	renderStatusBar = () => (
		<StatusBar
			backgroundColor={COLORS.primary}
			barStyle="light-content"
		/>
	)
}

