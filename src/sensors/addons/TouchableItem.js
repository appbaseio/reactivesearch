import React, { Component } from "react";
import {
	TouchableNativeFeedback,
	TouchableOpacity,
	Platform,
	View
} from "react-native";

const LOLLIPOP = 21;

export default class TouchableItem extends Component {
	handlePress = () => {
		global.requestAnimationFrame(this.props.onPress);
	};

	render() {
		const { style, pressOpacity, pressColor, borderless, ...rest } = this.props;

		if (Platform.OS === "android" && Platform.Version >= LOLLIPOP) {
			return (
				<TouchableNativeFeedback
					onPress={this.handlePress}
					background={TouchableNativeFeedback.Ripple(pressColor, false)}
				>
					<View style={style}>{React.Children.only(this.props.children)}</View>
				</TouchableNativeFeedback>
			);
		} else {
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
}

TouchableItem.defaultProps = {
	pressColor: "rgba(0, 0, 0, .2)",
	borderless: false
};
