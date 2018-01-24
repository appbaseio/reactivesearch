import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

const Container = ({ story }) => (
	<View
		style={{
			flex: 1,
			paddingLeft: 20,
			paddingRight: 15,
		}}
	>
		{story()}
	</View>
);

Container.propTypes = {
	story: PropTypes.func.isRequired,
};

export { Container as default };
