import React, { Component } from 'react';
import { TouchableNativeFeedback, TouchableOpacity, Platform, View } from 'react-native';

import types from '@appbaseio/reactivecore/lib/utils/types';

const LOLLIPOP = 21;

class TouchableItem extends Component {
	handlePress = () => {
		global.requestAnimationFrame(this.props.onPress);
	};

	render() {
		const {
			style, pressOpacity, pressColor, ...rest
		} = this.props;

		if (Platform.OS === 'android' && Platform.Version >= LOLLIPOP) {
			return (
				<TouchableNativeFeedback
					onPress={this.handlePress}
					background={TouchableNativeFeedback.Ripple(pressColor, false)}
				>
					<View style={style}>{React.Children.only(this.props.children)}</View>
				</TouchableNativeFeedback>
			);
		}
		return (
			<TouchableOpacity
				{...rest}
				onPress={this.handlePress}
				style={style}
				activeOpacity={pressOpacity}
			>
				{this.props.children}
			</TouchableOpacity>
		);
	}
}

TouchableItem.propTypes = {
	onPress: types.func,
	style: types.style,
	pressOpacity: types.number,
	pressColor: types.string,
	children: types.children,
};

TouchableItem.defaultProps = {
	pressColor: 'rgba(0, 0, 0, .2)',
};

export default TouchableItem;
