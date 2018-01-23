import {
	Dimensions,
	StatusBar,
	StyleSheet,
} from 'react-native';

import {
	DEFAULT_COLORS as COLORS,
	commonStyles as common,
} from './../../common/helpers';

const { width: deviceWidth } = Dimensions.get('window');

export default StyleSheet.create({
	topBarSpacer: {
		paddingTop: StatusBar.currentHeight,
		backgroundColor: COLORS.primary,
	},
	fullWidth: {
		width: deviceWidth,
	},
	controls: {
		...common.padding2,
		paddingTop: 0,
		backgroundColor: '#3cb371',
		alignItems: 'stretch',
	},
	results: {
		...common.padding2,
	},
	componentContainer: {
		backgroundColor: '#ECEFF1',
		marginHorizontal: 8,
		marginVertical: 8,
	},
	headerSeperator: {
		backgroundColor: COLORS.primary,
		padding: 8,
	},
	header: {
		backgroundColor: COLORS.primary,
	},
	headerIcon: {
		paddingLeft: 5,
		paddingRight: 10,
		paddingTop: 3,
		color: COLORS.secondary,
	},
	headerTitle: {
		color: COLORS.secondary,
		marginLeft: -83,
	},
	listContainer: {
		width: '100%',
		marginTop: -25,
	},
	booksRow: {
		flex: 1,
		flexDirection: 'row',
		paddingVertical: 15,
		borderBottomColor: COLORS.seperator,
		borderBottomWidth: 0.5,
	},
	booksRowContainer: {
		flex: 1,
		flexGrow: 1,
		paddingLeft: 15,
	},
	booksImage: {
		height: null,
		width: null,
		flex: 1,
	},
	bookInfoSection: {
		flex: 1,
		flexGrow: 2,
		flexWrap: 'wrap',
		padding: 15,
	},
	bookTitle: {
		fontWeight: '800',
		fontSize: 18,
	},
	bookAuthorSection: {
		paddingTop: 2,
	},
	bookAuthor: {
		color: 'grey',
	},
	bookPublication: {
		paddingTop: 7,
	},
	bookStars: {
		flex: 1,
		flexDirection: 'row',
		paddingTop: 5,
	},
	bookRatings: {
		marginTop: -2,
		paddingLeft: 5,
	},
});
