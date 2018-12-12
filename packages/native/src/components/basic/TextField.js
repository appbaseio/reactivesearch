import React, { Component } from 'react';
import { Input, Item, Icon, Button } from 'native-base';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryListener,
} from '@appbaseio/reactivecore/lib/actions';
import {
	debounce,
	checkValueChange,
	checkPropChange,
	getInnerKey,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import withTheme from '../../theme/withTheme';
import { connect } from '../../utils';

class TextField extends Component {
	constructor(props) {
		super(props);

		this.type = 'match';
		this.state = {
			currentValue: '',
		};
		props.setQueryListener(props.componentId, props.onQueryChange, null);
	}

	componentWillMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);

		if (this.props.selectedValue) {
			this.setValue(this.props.selectedValue, true);
		} else if (this.props.defaultSelected) {
			this.setValue(this.props.defaultSelected, true);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(this.props.react, nextProps.react, () => this.setReact(nextProps));
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.setValue(nextProps.defaultSelected, true, nextProps);
		} else if (this.state.currentValue !== nextProps.selectedValue) {
			this.setValue(nextProps.selectedValue || '', true, nextProps);
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	}

	setReact(props) {
		if (props.react) {
			props.watchComponent(props.componentId, props.react);
		}
	}

	defaultQuery = (value, props) => {
		if (value && value.trim() !== '') {
			return {
				[this.type]: {
					[props.dataField]: value,
				},
			};
		}
		return null;
	};

	handleTextChange = debounce((value, props) => {
		this.updateQuery(value, this.props);
		if (props.onValueChange) props.onValueChange(value);
	}, this.props.debounce);

	setValue = (value, isDefaultValue = false, props = this.props) => {
		const performUpdate = () => {
			this.setState(
				{
					currentValue: value,
				},
				() => {
					if (isDefaultValue) {
						this.updateQuery(value, props);
						if (props.onValueChange) props.onValueChange(value);
					} else {
						// debounce for handling text while typing
						this.handleTextChange(value, props);
					}
				},
			);
		};
		checkValueChange(props.componentId, value, props.beforeValueChange, performUpdate);
	};

	updateQuery = (value, props) => {
		const query = props.customQuery || this.defaultQuery;

		props.updateQuery({
			componentId: props.componentId,
			query: query(value, props),
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: false,
		});
	};

	clearValue = () => {
		this.setValue('', true);
	};

	render() {
		let style = {};

		if (this.props.showIcon) {
			if (this.props.iconPosition === 'left') {
				style = {
					paddingLeft: 0,
				};
			} else {
				style = {
					paddingRight: 0,
				};
			}
		}

		return (
			<Item
				regular
				style={{ marginLeft: 0, ...this.props.style }}
				{...getInnerKey(this.props.innerProps, 'item')}
			>
				{this.props.showIcon && this.props.iconPosition === 'left' ? (
					<Icon
						name="search"
						style={{
							fontSize: 22,
							top: 2,
							...getInnerKey(this.props.innerStyle, 'icon'),
						}}
						{...getInnerKey(this.props.innerProps, 'icon')}
					/>
				) : null}
				<Input
					style={{
						color: this.props.theming.textColor,
						...style,
						...getInnerKey(this.props.innerStyle, 'input'),
					}}
					placeholder={this.props.placeholder}
					onChangeText={this.setValue}
					value={this.state.currentValue}
					autoFocus={this.props.autoFocus}
					{...getInnerKey(this.props.innerProps, 'input')}
				/>
				{this.state.currentValue && this.props.showClear ? (
					<Button
						transparent
						onPress={this.clearValue}
						style={getInnerKey(this.props.innerStyle, 'button')}
						{...getInnerKey(this.props.innerProps, 'button')}
					>
						<Icon
							name="md-close"
							style={{
								fontSize: 22,
								top: 3,
								color: '#666',
								marginLeft: 10,
								marginRight:
									this.props.showIcon && this.props.iconPosition === 'right'
										? 0
										: 10,
								...getInnerKey(this.props.innerStyle, 'icon'),
							}}
							{...getInnerKey(this.props.innerProps, 'icon')}
						/>
					</Button>
				) : null}
				{this.props.showIcon && this.props.iconPosition === 'right' ? (
					<Icon
						name="search"
						style={{
							fontSize: 22,
							top: 2,
							...getInnerKey(this.props.innerStyle, 'icon'),
						}}
						{...getInnerKey(this.props.innerProps, 'icon')}
					/>
				) : null}
			</Item>
		);
	}
}

TextField.propTypes = {
	addComponent: types.funcRequired,
	componentId: types.stringRequired,
	defaultSelected: types.string,
	react: types.react,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	dataField: types.stringRequired,
	beforeValueChange: types.func,
	onValueChange: types.func,
	customQuery: types.func,
	onQueryChange: types.func,
	updateQuery: types.funcRequired,
	placeholder: types.string,
	selectedValue: types.selectedValue,
	filterLabel: types.string,
	showFilter: types.bool,
	style: types.style,
	debounce: types.number,
	autoFocus: types.bool,
	showIcon: types.bool,
	iconPosition: types.string,
	showClear: types.bool,
	theming: types.style,
	innerStyle: types.style,
	innerProps: types.props,
};

TextField.defaultProps = {
	placeholder: '',
	showIcon: false,
	iconPosition: 'left',
	autoFocus: false,
	showFilter: true,
	style: {},
	debounce: 0,
	showClear: true,
};

const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
});

export default connect(
	mapStateToProps,
	mapDispatchtoProps,
)(withTheme(TextField));
