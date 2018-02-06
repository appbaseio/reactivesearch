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
	Container,
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
	DEFAULT_COLORS,
	commonStyles as common,
	kFormatter,
} from './../../common/helpers';

import styles from './Styles';

const COMPONENT_DEMO = 'DateRange';

const COLORS = {
	...DEFAULT_COLORS,
	cardtitle: '#404040',
	carddesc: '#737373',
	bluecard: '#739ffc',
};

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
						{COMPONENT_DEMO}
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
					startDate="03-03-2017" // defaulting initialMonth because of older dataset
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
				<Container>
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
				</Container>
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

	itemCardMarkup = item => (
		<TouchableOpacity onPress={() => web(item.url)} key={item._id}>
			<View style={[styles.fullWidth, {
				paddingHorizontal: 10,
				paddingVertical: 10,
				overflow: 'hidden',
			}]}
			>
				<Card style={{ overflow: 'hidden' }}>
					<CardItem style={{ overflow: 'hidden' }}>
						<Body
							style={{
								alignItems: 'center',
								flex: 1,
								overflow: 'hidden',
							}}
						>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'flex-start',
									flex: 1,
									width: '100%',
									overflow: 'hidden',
								}}
							>
								<Thumbnail source={{ uri: item.avatar }} />
								<View style={{ flexDirection: 'column', flex: 1 }}>
									<Text
										style={{
											fontWeight: 'bold',
											color: COLORS.cardtitle,
											paddingTop: 8,
											justifyContent: 'flex-start',
											paddingLeft: 10,
										}}
									>
										{item.name}
									</Text>
									<Text
										style={{
											fontWeight: 'bold',
											color: COLORS.carddesc,
											justifyContent: 'flex-start',
											paddingLeft: 10,
										}}
									>
										@{item.owner}
									</Text>
								</View>
							</View>
							<Text
								style={{
									paddingBottom: 15,
									textAlign: 'left',
									color: COLORS.carddesc,
									paddingVertical: 25,
								}}
							>
								{item.description}
							</Text>

							<View
								style={{
									flex: 1,
									flexDirection: 'row',
									justifyContent: 'space-between',
									alignItems: 'flex-end',
									width: '100%',
								}}
							>
								<View
									style={{
										flex: 1,
										flexDirection: 'row',
										justifyContent: 'flex-start',
										alignItems: 'center',
										paddingBottom: 5,
									}}
								>
									<Ionicons
										name="md-git-branch"
										style={{ fontSize: 20, paddingRight: 3, color: COLORS.bluecard }}
									/>
									<Text style={{ fontSize: 15, color: COLORS.carddesc }}>
										{kFormatter(item.forks)}
									</Text>
									<Ionicons
										name="md-eye"
										style={{
											fontSize: 20,
											paddingLeft: 15,
											paddingRight: 3,
											color: COLORS.bluecard,
										}}
									/>
									<Text style={{ fontSize: 15, color: COLORS.carddesc }}>
										{kFormatter(item.watchers)}
									</Text>
								</View>
								<View>
									<Button
										style={{
											padding: 5,
											height: 30,
											borderRadius: 15,
											backgroundColor: COLORS.bluecard,
											marginBottom: 5,
										}}
										onPress={() => web(item.url)}
									>
										<Text>View</Text>
									</Button>
								</View>
							</View>
						</Body>
						<View
							style={{
								position: 'absolute',
								top: -30,
								right: -30,
								backgroundColor: '#fee7e9',
								height: 60,
								width: 60,
								borderRadius: 30,
								zIndex: 98,
							}}
						/>
					</CardItem>
					<Ionicons
						name="md-star"
						style={{
							position: 'absolute',
							fontSize: 15,
							backgroundColor: '#fee7e9',
							color: '#fa9ea8',
							top: 5,
							right: 5,
						}}
					/>
					<Text
						style={{
							position: 'absolute',
							top: 5,
							right: 35,
							color: COLORS.carddesc,
						}}
					>
						{kFormatter(item.stars)}
					</Text>
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

