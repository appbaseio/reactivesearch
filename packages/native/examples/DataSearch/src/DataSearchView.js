import Expo from 'expo';
import React, { Component } from 'react';
import {
	FlatList,
	Image,
	Platform,
	ScrollView,
	StatusBar,
	TouchableOpacity,
	View,
	Linking,
} from 'react-native';
import {
	Body,
	Button,
	Header,
	Left,
	Right,
	Spinner,
	Text,
	Title,
} from 'native-base';
import { FontAwesome as Icon, Ionicons } from '@expo/vector-icons';
import { web } from 'react-native-communications';

import {
	DataSearch,
	ReactiveBase,
	ReactiveList,
} from '@appbaseio/reactivebase-native';

import { GOOD_BOOKS as APPBASE_CONFIG } from './../../common/credentials';

import {
	DEFAULT_COLORS as COLORS,
	commonStyles as common,
} from './../../common/helpers';

import styles from './Styles';

const COMPONENT_DEMO = 'DataSearch';

export default class Main extends Component {
	render() {
		const { isReady } = this.state;
		const { navigation } = this.props; // eslint-disable-line

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
						style={{ color: headerColor, fontSize: 18, marginLeft: 15 }}
					>
						{ COMPONENT_DEMO }
					</Title>
				</Body>
				{isIOS && (
					<Right>
						<Button
							transparent
							onPress={() => Linking.openURL('exp://')}
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
				<DataSearch
					componentId="SearchText"
					dataField={[
						'original_title',
						'original_title.search',
						'authors',
						'authors.search',
					]}
					{...this.props} // injecting props from navigator drawer
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
								// onData={this.renderBookCard}
								pagination
								paginationAt="bottom"
								react={{
									and: ['showAll', 'SearchText'],
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

	renderBookCard = bookData => (
		<TouchableOpacity
			onPress={
				() => web(`https://google.com/search?q=${bookData.original_title}`)
			}
		>
			<View style={[styles.fullWidth, styles.booksRow]}>
				<View style={styles.booksRowContainer}>
					<Image
						source={{
							uri: bookData.image_medium,
						}}
						style={styles.booksImage}
					/>
				</View>
				<View style={styles.bookInfoSection}>
					<Text style={styles.bookTitle}>
						{ bookData.title }
					</Text>
					<Text style={styles.bookAuthorSection}>
						<Text style={styles.bookAuthor}>
							{ bookData.authors }
						</Text>
					</Text>
					<Text style={styles.bookPublication}>
									Pub {bookData.original_publication_year}
					</Text>
					<View style={styles.bookStars}>
						{
							[...Array(bookData.average_rating_rounded)]
								.map((e, i) => (
									<Icon
										key={i} // eslint-disable-line react/no-array-index-key
										name="star"
										size={20}
										color="gold"
									/>
								))
						}
						<Text style={styles.bookRatings}>
										({bookData.average_rating})
						</Text>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	)

	onAllData = items => (
		<FlatList
			style={styles.listContainer}
			data={items || []}
			keyExtractor={item => item.id}
			renderItem={
				({ item }) => this.renderBookCard(item)
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

