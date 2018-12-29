import React, { Component } from 'react';
import { View } from 'react-native';
import { CheckBox, Text } from 'native-base';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { getInnerKey } from '@appbaseio/reactivecore/lib/utils/helper';

import TouchableItem from './TouchableItem';

class CheckboxItem extends Component {
	handlePress = () => {
		this.props.onPress(this.props.value);
	};

	render() {
		const { color, ...checkBoxStyles } = getInnerKey(this.props.innerStyle, 'checkbox');
		return (
			<TouchableItem pressOpacity={0.5} delayPressIn={0} onPress={this.handlePress}>
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						padding: 15,
						borderBottomColor: '#c9c9c9',
						borderBottomWidth: 0.5,
					}}
				>
					<CheckBox
						onPress={this.handlePress}
						checked={this.props.checked}
						color={color || this.props.theming.primaryColor}
						style={checkBoxStyles}
						{...getInnerKey(this.props.innerProps, 'checkbox')}
					/>
					<Text
						style={{
							color: this.props.theming.textColor,
							marginLeft: 20,
							...getInnerKey(this.props.innerStyle, 'label'),
						}}
						{...getInnerKey(this.props.innerProps, 'text')}
					>
						{this.props.label}
					</Text>
				</View>
			</TouchableItem>
		);
	}
}

CheckboxItem.propTypes = {
	checked: types.bool,
	onPress: types.func,
	label: types.string,
	value: types.string,
	innerStyle: types.style,
	theming: types.style,
	innerProps: types.props,
};

export default CheckboxItem;
