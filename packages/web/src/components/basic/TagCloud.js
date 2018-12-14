import React, { Component } from 'react';

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
	getClassName,
	handleA11yAction,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';

import Title from '../../styles/Title';
import TagList from '../../styles/TagList';
import Container from '../../styles/Container';
import { connect } from '../../utils';

class TagCloud extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: {},
			options:
				props.options && props.options[props.dataField]
					? props.options[props.dataField].buckets
					: [],
		};
		this.locked = false;
		this.type = 'term';
		this.internalComponent = `${props.componentId}__internal`;
		props.setQueryListener(props.componentId, props.onQueryChange, null);
	}

	componentWillMount() {
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

		if (!nextProps.multiSelect) {
			selectedValue = (selectedValue.length && selectedValue[0]) || '';
		}

		if (!isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			this.setValue(nextProps.defaultSelected, true, nextProps);
		} else if (!isEqual(selectedValue, nextProps.selectedValue)) {
			this.setValue(nextProps.selectedValue, true, nextProps);
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
			props.watchComponent(props.componentId, {
				and: this.internalComponent,
			});
		}
	};

	static defaultQuery = (value, props) => {
		let query = null;
		let type = props.queryFormat === 'or' ? 'terms' : 'term';
		type = props.multiSelect ? type : 'term';
		if (value) {
			let listQuery;
			if (!props.multiSelect || props.queryFormat === 'or') {
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

		if (query && props.nestedField) {
			return {
				query: {
					nested: {
						path: props.nestedField,
						query,
					},
				},
			};
		}
		return query;
	};

	setValue = (value, isDefaultValue = false, props = this.props) => {
		// ignore state updates when component is locked
		if (props.beforeValueChange && this.locked) {
			return;
		}

		this.locked = true;
		let { currentValue } = this.state;
		let finalValues = null;

		if (props.multiSelect) {
			if (isDefaultValue) {
				finalValues = value;
				currentValue = {};
				if (value) {
					value.forEach((item) => {
						currentValue[item] = true;
					});
				}
			} else {
				if (currentValue[value]) {
					const { [value]: del, ...rest } = currentValue;
					currentValue = { ...rest };
				} else {
					currentValue[value] = true;
				}
				finalValues = Object.keys(currentValue);
			}
		} else {
			currentValue = {
				[value]: true,
			};
			finalValues = value;
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
		const query = props.customQuery || TagCloud.defaultQuery;

		props.updateQuery({
			componentId: props.componentId,
			query: query(value, props),
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: 'TAGCLOUD',
		});
	};

	static generateQueryOptions(props) {
		const queryOptions = getQueryOptions(props);
		queryOptions.size = 0;
		const { nestedField } = props;
		if (nestedField) {
			queryOptions.aggs = {
				[nestedField]: {
					nested: {
						path: nestedField,
					},
					aggs: {
						[props.dataField]: {
							terms: {
								field: props.dataField,
								size: props.size,
								order: getAggsOrder(props.sortBy || 'asc'),
							},
						},
					},
				},
			};
		} else {
			queryOptions.aggs = {
				[props.dataField]: {
					terms: {
						field: props.dataField,
						size: props.size,
						order: getAggsOrder(props.sortBy || 'asc'),
					},
				},
			};
		}

		return queryOptions;
	}

	updateQueryOptions = (props) => {
		const queryOptions = TagCloud.generateQueryOptions(props);
		props.setQueryOptions(this.internalComponent, queryOptions);
	};

	render() {
		const min = 0.8;
		const max = 3;

		if (this.props.isLoading && this.props.loader) {
			return this.props.loader;
		}

		if (this.state.options.length === 0) {
			return null;
		}

		let highestCount = 0;
		this.state.options.forEach((item) => {
			highestCount = item.doc_count > highestCount ? item.doc_count : highestCount;
		});

		return (
			<Container style={this.props.style} className={this.props.className}>
				{this.props.title && (
					<Title className={getClassName(this.props.innerClass, 'title') || null}>
						{this.props.title}
					</Title>
				)}
				<TagList className={getClassName(this.props.innerClass, 'list') || null}>
					{this.state.options.map((item) => {
						const size = (item.doc_count / highestCount) * (max - min) + min; // eslint-disable-line

						return (
							<span
								key={item.key}
								onClick={() => this.setValue(item.key)}
								onKeyPress={e => handleA11yAction(e, () => this.setValue(item.key))}
								style={{ fontSize: `${size}em` }}
								className={
									this.state.currentValue[item.key]
										? `${getClassName(this.props.innerClass, 'input')
												|| ''} active`
										: getClassName(this.props.innerClass, 'input')
								}
								role="menuitem"
								tabIndex="0"
							>
								{item.key}
								{this.props.showCount && ` (${item.doc_count})`}
							</span>
						);
					})}
				</TagList>
			</Container>
		);
	}
}

TagCloud.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	options: types.options,
	selectedValue: types.selectedValue,
	// component props
	beforeValueChange: types.func,
	className: types.string,
	componentId: types.stringRequired,
	customQuery: types.func,
	dataField: types.stringRequired,
	defaultSelected: types.stringOrArray,
	filterLabel: types.string,
	innerClass: types.style,
	isLoading: types.bool,
	loader: types.title,
	multiSelect: types.bool,
	nestedField: types.string,
	onQueryChange: types.func,
	onValueChange: types.func,
	queryFormat: types.queryFormatSearch,
	react: types.react,
	showCount: types.bool,
	showFilter: types.bool,
	size: types.number,
	sortBy: types.sortByWithCount,
	style: types.style,
	title: types.title,
	URLParams: types.bool,
};

TagCloud.defaultProps = {
	className: null,
	multiSelect: false,
	queryFormat: 'or',
	showFilter: true,
	size: 100,
	sortBy: 'asc',
	style: {},
	URLParams: false,
};

const mapStateToProps = (state, props) => {
	let options = {};
	if (props.nestedField) {
		options
			= state.aggregations[props.componentId]
			&& state.aggregations[props.componentId][props.nestedField];
	} else {
		options = state.aggregations[props.componentId];
	}
	return {
		options,
		selectedValue:
			(state.selectedValues[props.componentId]
				&& state.selectedValues[props.componentId].value)
			|| null,
		isLoading: state.isLoading[props.componentId],
	};
};

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
});

export default connect(
	mapStateToProps,
	mapDispatchtoProps,
)(TagCloud);
