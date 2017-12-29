import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text } from 'native-base';

class Container extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isReady: false,
		};
	}

	async componentWillMount() {
		await Expo.Font.loadAsync({
			Roboto: require('native-base/Fonts/Roboto.ttf'),
			Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
			Ionicons: require('native-base/Fonts/Ionicons.ttf'),
		});
		this.setState({ isReady: true });
	}

	render() {
		if (!this.state.isReady) {
			return <Text>Loading...</Text>;
		}

		return (
			<View
				style={{
					flex: 1,
					paddingLeft: 10,
					paddingRight: 10,
				}}
			>
				{this.props.story()}
			</View>
		);
	}
}

Container.propTypes = {
	story: PropTypes.func.isRequired,
};

export { Container as default };
