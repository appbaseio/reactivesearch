import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'native-base';

import { setValue, clearValues } from '@appbaseio/reactivecore/lib/actions';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { connect } from '../../utils';

class SelectedFilters extends Component {
	remove = (component) => {
		this.props.setValue(component, null);
	};

	renderValue = (value, isArray) => {
		if (isArray && value.length) {
			const arrayToRender = value.map(item => this.renderValue(item));
			return arrayToRender.join(', ');
		} else if (value && typeof value === 'object') {
			// TODO: support for NestedList
			if (value.label || value.key) {
				return value.label || value.key;
			}
			return null;
		}
		return value;
	};

	render() {
		const { selectedValues } = this.props;
		let hasValues = false;

		return (
			<View style={this.props.style}>
				{Object.keys(selectedValues)
					.filter(
						id => this.props.components.includes(id) && selectedValues[id].showFilter,
					)
					.map((component, index) => {
						const { label, value } = selectedValues[component];
						const isArray = Array.isArray(value);

						if (label && ((isArray && value.length) || (!isArray && value))) {
							hasValues = true;
							return (
								<Button
									light
									style={{
										height: 28,
										paddingVertical: 4,
										marginVertical: 2,
									}}
									key={`${component}-${index}`} // eslint-disable-line
									onPress={() => this.remove(component)}
								>
									<Text
										style={{
											paddingLeft: 8,
											paddingRight: 4,
											fontSize: 14,
										}}
									>
										{selectedValues[component].label}:{' '}
										{this.renderValue(value, isArray)}
									</Text>
									<Text
										style={{
											paddingLeft: 4,
											paddingRight: 8,
											fontSize: 14,
										}}
									>
										&#x2715;
									</Text>
								</Button>
							);
						}
						return null;
					})}
				{this.props.showClearAll && hasValues ? (
					<Button
						light
						style={{
							height: 28,
							paddingVertical: 4,
							marginVertical: 2,
						}}
						onPress={this.props.clearValues}
					>
						<Text
							style={{
								paddingLeft: 8,
								paddingRight: 8,
								fontSize: 14,
							}}
						>
							{this.props.clearAllLabel}
						</Text>
					</Button>
				) : null}
			</View>
		);
	}
}

SelectedFilters.propTypes = {
	selectedValues: types.selectedValues,
	setValue: types.func,
	clearValues: types.func,
	components: types.components,
	style: types.style,
	showClearAll: types.bool,
	clearAllLabel: types.title,
};

SelectedFilters.defaultProps = {
	style: {},
	showClearAll: true,
	clearAllLabel: 'Clear All',
};

const mapStateToProps = state => ({
	selectedValues: state.selectedValues,
	components: state.components,
});

const mapDispatchtoProps = dispatch => ({
	setValue: (component, value) => dispatch(setValue(component, value)),
	clearValues: () => dispatch(clearValues()),
});

export default connect(
	mapStateToProps,
	mapDispatchtoProps,
)(SelectedFilters);
