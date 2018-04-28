import React from 'react';
import PropTypes from 'prop-types';

import {
	StyleSheet,
	View,
	Text,
} from 'react-native';

const propTypes = {
	label: PropTypes.any.isRequired, // eslint-disable-line
	fontSize: PropTypes.number,
};

const defaultProps = {
	fontSize: 13,
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		alignSelf: 'flex-start',
	},
	bubble: {
		flex: 0,
		flexDirection: 'row',
		alignSelf: 'flex-start',
		backgroundColor: '#F6F6F6',
		paddingVertical: 2,
		paddingHorizontal: 3,
	},
	label: {
		color: '#000000',
		fontSize: 13,
	},
	arrow: {
		backgroundColor: 'transparent',
		borderWidth: 4,
		borderColor: 'transparent',
		borderTopColor: '#F6F6F6',
		alignSelf: 'center',
		marginTop: -9,
	},
	arrowBorder: {
		backgroundColor: 'transparent',
		borderWidth: 4,
		borderColor: 'transparent',
		borderTopColor: '#F0F0F0',
		alignSelf: 'center',
		marginTop: -0.5,
	},
});

const MarkerWithLabel = ({ label, fontSize }) => (
	<View style={styles.container}>
		<View style={styles.bubble}>
			<Text style={[styles.label, { fontSize }]}>{label}</Text>
		</View>
		<View style={styles.arrowBorder} />
		<View style={styles.arrow} />
	</View>
);

MarkerWithLabel.propTypes = propTypes;
MarkerWithLabel.defaultProps = defaultProps;

export default MarkerWithLabel;
