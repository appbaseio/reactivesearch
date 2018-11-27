import React, { Component } from 'react';
import { View, Modal, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Text, Body, Item, Header, Left, Button, Icon, Title, Right } from 'native-base';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions,
	setQueryListener,
} from '@appbaseio/reactivecore/lib/actions';
import {
	isEqual,
	getQueryOptions,
	pushToAndClause,
	checkValueChange,
	getAggsOrder,
	checkPropChange,
	checkSomePropChange,
	getInnerKey,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';

import CheckboxItem from '../shared/CheckboxItem';
import withTheme from '../../theme/withTheme';
import { connect } from '../../utils';

class MultiDropdownList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: {},
			options: [],
			showModal: false,
		};

		this.locked = false;
		this.internalComponent = `${this.props.componentId}__internal`;
		props.setQueryListener(props.componentId, props.onQueryChange, null);
	}

	componentDidMount() {
		this.props.addComponent(this.internalComponent);
		this.props.addComponent(this.props.componentId);
		this.updateQueryOptions(this.props);

		this.setReact(this.props);

		if (this.props.selectedValue) {
			this.setValue(this.props.selectedValue, true);
		} else if (this.props.defaultSelected) {
			this.setValue(this.props.defaultSelected, true);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(this.props.react, nextProps.react, () => this.setReact(nextProps));
		checkPropChange(this.props.options, nextProps.options, () => {
			this.setState({
				options: nextProps.options[nextProps.dataField]
					? nextProps.options[nextProps.dataField].buckets
					: [],
			});
		});
		checkSomePropChange(this.props, nextProps, ['size', 'sortBy'], () =>
			this.updateQueryOptions(nextProps),
		);

		checkPropChange(this.props.dataField, nextProps.dataField, () => {
			this.updateQueryOptions(nextProps);
			this.updateQuery(Object.keys(this.state.currentValue), nextProps);
		});

		let selectedValue = Object.keys(this.state.currentValue);

		if (this.props.selectAllLabel) {
			selectedValue = selectedValue.filter(val => val !== this.props.selectAllLabel);

			if (this.state.currentValue[this.props.selectAllLabel]) {
				selectedValue = [this.props.selectAllLabel];
			}
		}

		if (!isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			this.setValue(nextProps.defaultSelected, true);
		} else if (!isEqual(selectedValue, nextProps.selectedValue)) {
			this.setValue(nextProps.selectedValue || [], true);
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
		this.props.removeComponent(this.internalComponent);
	}

	setReact = (props) => {
		const { react } = props;
		if (react) {
			const newReact = pushToAndClause(react, this.internalComponent);
			props.watchComponent(props.componentId, newReact);
		} else {
			props.watchComponent(props.componentId, { and: this.internalComponent });
		}
	};

	defaultQuery = (value, props) => {
		let query = null;
		const type = props.queryFormat === 'or' ? 'terms' : 'term';
		if (this.props.selectAllLabel && value.includes(this.props.selectAllLabel)) {
			query = {
				exists: {
					field: props.dataField,
				},
			};
		} else if (value) {
			let listQuery;
			if (props.queryFormat === 'or') {
				listQuery = {
					[type]: {
						[props.dataField]: value,
					},
				};
			} else {
				// adds a sub-query with must as an array of objects for each term/value
				const queryArray = value.map(item => ({
					[type]: {
						[props.dataField]: item,
					},
				}));
				listQuery = {
					bool: {
						must: queryArray,
					},
				};
			}

			query = value.length ? listQuery : null;
		}
		return query;
	};

	setValue = (value, isDefaultValue = false, props = this.props) => {
		// ignore state updates when component is locked
		if (props.beforeValueChange && this.locked) {
			return;
		}

		this.locked = true;
		const { selectAllLabel } = this.props;
		let { currentValue } = this.state;
		let finalValues = null;

		if (selectAllLabel && value.includes(selectAllLabel)) {
			if (currentValue[selectAllLabel]) {
				currentValue = {};
				finalValues = [];
			} else {
				this.state.options.forEach((item) => {
					currentValue[item.key] = true;
				});
				currentValue[selectAllLabel] = true;
				finalValues = [selectAllLabel];
			}
		} else if (isDefaultValue) {
			finalValues = value;
			currentValue = {};
			if (value) {
				value.forEach((item) => {
					currentValue[item] = true;
				});
			}

			if (selectAllLabel && selectAllLabel in currentValue) {
				const { [selectAllLabel]: del, ...obj } = currentValue;
				currentValue = { ...obj };
			}
		} else {
			if (currentValue[value]) {
				const { [value]: del, ...rest } = currentValue;
				currentValue = { ...rest };
			} else {
				currentValue[value] = true;
			}

			if (selectAllLabel && selectAllLabel in currentValue) {
				const { [selectAllLabel]: del, ...obj } = currentValue;
				currentValue = { ...obj };
			}
			finalValues = Object.keys(currentValue);
		}

		const performUpdate = () => {
			this.setState(
				{
					currentValue,
				},
				() => {
					this.updateQuery(finalValues, props);
					this.locked = false;
					if (props.onValueChange) props.onValueChange(finalValues);
				},
			);
		};

		checkValueChange(props.componentId, finalValues, props.beforeValueChange, performUpdate);
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

	toggleModal = () => {
		this.setState({
			showModal: !this.state.showModal,
		});
	};

	updateQueryOptions = (props) => {
		const queryOptions = getQueryOptions(props);
		queryOptions.size = 0;
		queryOptions.aggs = {
			[props.dataField]: {
				terms: {
					field: props.dataField,
					size: props.size,
					order: getAggsOrder(props.sortBy || 'count'),
				},
			},
		};
		props.setQueryOptions(this.internalComponent, queryOptions);
	};

	render() {
		let selectAll = [];

		if (this.state.options.length === 0) {
			return null;
		}

		if (this.props.selectAllLabel) {
			selectAll = [
				{
					key: this.props.selectAllLabel,
				},
			];
		}

		return (
			<View style={this.props.style}>
				{this.state.showModal ? (
					<Modal
						supportedOrientations={this.props.supportedOrientations || null}
						transparent={false}
						visible={this.state.showModal}
						onRequestClose={this.toggleModal}
						{...getInnerKey(this.props.innerProps, 'modal')}
					>
						<Header {...getInnerKey(this.props.innerProps, 'header')}>
							<Left style={getInnerKey(this.props.innerStyle, 'left')}>
								<Button
									transparent
									onPress={this.toggleModal}
									style={getInnerKey(this.props.innerStyle, 'button')}
									{...getInnerKey(this.props.innerProps, 'button')}
								>
									<Icon
										name="arrow-back"
										color={this.props.theming.primaryColor}
										style={getInnerKey(this.props.innerStyle, 'icon')}
										{...getInnerKey(this.props.innerProps, 'icon')}
									/>
								</Button>
							</Left>
							<Body style={getInnerKey(this.props.innerStyle, 'body')}>
								<Title
									style={getInnerKey(this.props.innerStyle, 'title')}
									{...getInnerKey(this.props.innerProps, 'title')}
								>
									{this.props.placeholder}
								</Title>
							</Body>
							<Right style={getInnerKey(this.props.innerStyle, 'right')} />
						</Header>
						<FlatList
							data={[
								...selectAll,
								...this.state.options
									.filter(item => String(item.key).trim().length)
									.map(item => ({ ...item, key: String(item.key) })),
							]}
							renderItem={({ item }) => {
								const label
									= this.props.showCount && item.doc_count
										? `${item.key} (${item.doc_count})`
										: item.key;

								return (
									<CheckboxItem
										label={label}
										value={item.key}
										onPress={this.setValue}
										checked={Object.keys(this.state.currentValue).includes(
											item.key,
										)}
										innerStyle={this.props.innerStyle}
										theming={this.props.theming}
										innerProps={this.props.innerProps}
									/>
								);
							}}
							{...getInnerKey(this.props.innerProps, 'flatList')}
						/>
					</Modal>
				) : (
					<Item
						regular
						style={{ marginLeft: 0 }}
						{...getInnerKey(this.props.innerProps, 'item')}
					>
						<TouchableWithoutFeedback onPress={this.toggleModal}>
							<Text
								numberOfLines={1}
								ellipsizeMode="tail"
								style={{
									flex: 1,
									alignItems: 'center',
									color: this.state.currentDate
										? this.props.theming.textColor
										: '#555',
									fontSize: 17,
									height: 50,
									lineHeight: 24,
									paddingLeft: 8,
									paddingRight: 5,
									paddingTop: 12,
									...getInnerKey(this.props.innerStyle, 'label'),
								}}
								{...getInnerKey(this.props.innerProps, 'text')}
							>
								{Object.keys(this.state.currentValue).length
									? Object.keys(this.state.currentValue).join(', ')
									: this.props.placeholder}
							</Text>
						</TouchableWithoutFeedback>
					</Item>
				)}
			</View>
		);
	}
}

MultiDropdownList.propTypes = {
	componentId: types.stringRequired,
	addComponent: types.funcRequired,
	dataField: types.stringRequired,
	sortBy: types.sortByWithCount,
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	defaultSelected: types.stringArray,
	react: types.react,
	options: types.options,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	beforeValueChange: types.func,
	onValueChange: types.func,
	customQuery: types.func,
	onQueryChange: types.func,
	placeholder: types.string,
	title: types.title,
	filterLabel: types.string,
	selectedValue: types.selectedValue,
	queryFormat: types.queryFormatSearch,
	showCount: types.bool,
	size: types.number,
	showFilter: types.bool,
	selectAllLabel: types.string,
	style: types.style,
	supportedOrientations: types.supportedOrientations,
	theming: types.style,
	innerStyle: types.style,
	innerProps: types.props,
};

MultiDropdownList.defaultProps = {
	size: 100,
	sortBy: 'count',
	queryFormat: 'or',
	showCount: true,
	placeholder: 'Select values',
	style: {},
};

const mapStateToProps = (state, props) => ({
	options: state.aggregations[props.componentId],
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
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
});

export default connect(
	mapStateToProps,
	mapDispatchtoProps,
)(withTheme(MultiDropdownList));
