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
	checkPropChange,
	checkSomePropChange,
	getClassName,
	handleA11yAction,
	getOptionsFromQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';
import hoistNonReactStatics from 'hoist-non-react-statics';

import types from '@appbaseio/reactivecore/lib/utils/types';

import Title from '../../styles/Title';
import TagList from '../../styles/TagList';
import Container from '../../styles/Container';
import { connect, isFunction } from '../../utils';
import { getAggsQuery } from './utils';

class TagCloud extends Component {
	constructor(props) {
		super(props);

		const defaultValue = props.defaultValue || props.value;
		const currentValueArray = props.selectedValue || defaultValue || [];
		const currentValue = {};

		currentValueArray.forEach((item) => {
			currentValue[item] = true;
		});

		const options
			= props.options && props.options[props.dataField]
				? this.getOptions(props.options[props.dataField].buckets, props)
				: [];

		this.state = {
			currentValue,
			options,
		};
		this.locked = false;
		this.type = 'term';
		this.internalComponent = `${props.componentId}__internal`;

		props.addComponent(props.componentId);
		props.addComponent(this.internalComponent);
		props.setQueryListener(props.componentId, props.onQueryChange, props.onError);
		this.updateQueryOptions(props);

		this.setReact(props);
		const hasMounted = false;

		if (currentValueArray.length) {
			this.setValue(currentValueArray, true, props, hasMounted);
		}
	}

	componentDidUpdate(prevProps) {
		checkPropChange(this.props.react, prevProps.react, () => this.setReact(this.props));
		checkPropChange(this.props.options, prevProps.options, () => {
			this.setState({
				options: this.props.options[this.props.dataField]
					? this.props.options[this.props.dataField].buckets
					: [],
			});
		});
		checkSomePropChange(this.props, prevProps, ['size', 'sortBy'], () =>
			this.updateQueryOptions(this.props),
		);

		checkSomePropChange(this.props, prevProps, ['dataField', 'nestedField'], () => {
			this.updateQueryOptions(this.props);
			this.updateQuery(Object.keys(this.state.currentValue), this.props);
		});

		let selectedValue = Object.keys(this.state.currentValue);

		if (!this.props.multiSelect) {
			selectedValue = (selectedValue.length && selectedValue[0]) || '';
		}

		if (this.props.value !== prevProps.value) {
			this.setValue(this.props.value, true, this.props);
		} else if (
			!isEqual(selectedValue, this.props.selectedValue)
			&& !isEqual(this.props.selectedValue, prevProps.selectedValue)
		) {
			const { value, onChange } = this.props;
			if (value === undefined) {
				this.setValue(this.props.selectedValue || [], true, this.props);
			} else if (onChange) {
				// value prop exists
				onChange(this.props.selectedValue || '');
			} else {
				// value prop exists and onChange is not defined:
				// we need to put the current value back into the store
				// if the clear action was triggered by interacting with
				// selected-filters component
				const selectedTags = Object.keys(this.state.currentValue);
				this.setValue(selectedTags, true, this.props, false);
			}
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

	setValue = (value, isDefaultValue = false, props = this.props, hasMounted = true) => {
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
			const handleUpdates = () => {
				this.updateQuery(finalValues, props);
				this.locked = false;
				if (props.onValueChange) props.onValueChange(finalValues);
			};

			if (hasMounted) {
				this.setState(
					{
						currentValue,
					},
					handleUpdates,
				);
			} else {
				handleUpdates();
			}
		};

		checkValueChange(props.componentId, finalValues, props.beforeValueChange, performUpdate);
	};

	updateQuery = (value, props) => {
		const { customQuery } = props;
		let query = TagCloud.defaultQuery(value, props);
		let customQueryOptions;
		if (customQuery) {
			({ query } = customQuery(value, props) || {});
			customQueryOptions = getOptionsFromQuery(customQuery(value, props));
		}
		props.setQueryOptions(props.componentId, customQueryOptions);

		props.updateQuery({
			componentId: props.componentId,
			query,
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
		return getAggsQuery(queryOptions, props);
	}

	updateQueryOptions = (props) => {
		const queryOptions = TagCloud.generateQueryOptions(props);
		props.setQueryOptions(this.internalComponent, queryOptions);
	};

	handleClick = (item) => {
		const { value, onChange } = this.props;

		if (value === undefined) {
			this.setValue(item);
		} else if (onChange) {
			onChange(item);
		}
	};

	render() {
		const min = 0.8;
		const max = 3;
		if (this.props.isLoading && this.props.loader) {
			return this.props.loader;
		}

		const { renderError, error } = this.props;
		if (renderError && error) {
			return isFunction(renderError) ? renderError(error) : renderError;
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
						// eslint-disable-next-line
						const size = (item.doc_count / highestCount) * (max - min) + min;

						return (
							<span
								key={item.key}
								onClick={() => this.handleClick(item.key)}
								onKeyPress={e =>
									handleA11yAction(e, () => this.handleClick(item.key))
								}
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
	defaultValue: types.stringOrArray,
	error: types.title,
	value: types.stringOrArray,
	filterLabel: types.string,
	innerClass: types.style,
	isLoading: types.bool,
	loader: types.title,
	multiSelect: types.bool,
	onError: types.func,
	onQueryChange: types.func,
	onValueChange: types.func,
	onChange: types.func,
	nestedField: types.string,
	queryFormat: types.queryFormatSearch,
	renderError: types.title,
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
			&& state.aggregations[props.componentId].reactivesearch_nested;
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
		error: state.error[props.componentId],
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

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => <TagCloud ref={props.myForwardedRef} {...props} />);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));

hoistNonReactStatics(ForwardRefComponent, TagCloud);

ForwardRefComponent.name = 'TagCloud';
export default ForwardRefComponent;
