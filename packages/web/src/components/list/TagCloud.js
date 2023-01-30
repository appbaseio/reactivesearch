import React, { Component } from 'react';

import { updateQuery, setQueryOptions, setCustomQuery } from '@appbaseio/reactivecore/lib/actions';
import {
	isEqual,
	getQueryOptions,
	checkValueChange,
	checkPropChange,
	checkSomePropChange,
	getClassName,
	handleA11yAction,
	getOptionsFromQuery,
	getAggsQuery,
	updateCustomQuery,
	isFunction,
} from '@appbaseio/reactivecore/lib/utils/helper';
import { getInternalComponentID } from '@appbaseio/reactivecore/lib/utils/transform';
import hoistNonReactStatics from 'hoist-non-react-statics';

import types from '@appbaseio/reactivecore/lib/utils/types';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';

import Title from '../../styles/Title';
import TagList from '../../styles/TagList';
import Container from '../../styles/Container';
import { connect } from '../../utils';
import PreferencesConsumer from '../basic/PreferencesConsumer';
import ComponentWrapper from '../basic/ComponentWrapper';

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
				? props.options[props.dataField].buckets
				: [];

		this.state = {
			currentValue,
			options,
		};
		this.type = 'term';
		this.internalComponent = getInternalComponentID(props.componentId);
		// Set custom and default queries in store
		updateCustomQuery(props.componentId, props, currentValue);
		this.updateQueryOptions(props);

		const hasMounted = false;

		if (currentValueArray.length) {
			this.setValue(currentValueArray, true, props, hasMounted);
		}
	}

	componentDidUpdate(prevProps) {
		checkPropChange(this.props.options, prevProps.options, () => {
			const { buckets } = this.props.options[this.props.dataField];
			this.setState({
				options: buckets,
			});
		});
		checkSomePropChange(this.props, prevProps, ['size', 'sortBy'], () =>
			this.updateQueryOptions(this.props),
		);

		checkSomePropChange(this.props, prevProps, ['dataField', 'nestedField', 'aggregationSize'], () => {
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

	static defaultQuery = (value, props) => ({
		query: {
			queryFormat: props.queryFormat,
			dataField: props.dataField,
			value,
			nestedField: props.nestedField,
			selectAllLabel: props.selectAllLabel,
			showMissing: props.showMissing,
			multiSelect: props.multiSelect,
		},
	});

	setValue = (value, isDefaultValue = false, props = this.props, hasMounted = true) => {
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
			updateCustomQuery(props.componentId, props, value);
		}
		props.setQueryOptions(props.componentId, customQueryOptions, false);

		props.updateQuery({
			componentId: props.componentId,
			query,
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: componentTypes.tagCloud,
		});
	};

	static generateQueryOptions(props) {
		const queryOptions = getQueryOptions(props);
		queryOptions.size = 0;
		return getAggsQuery('', queryOptions, props);
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
				<TagList
					role="menu"
					className={getClassName(this.props.innerClass, 'list') || null}
				>
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
										? `${
												getClassName(this.props.innerClass, 'input') || ''
										  } active`
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
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	options: types.options,
	selectedValue: types.selectedValue,
	setCustomQuery: types.funcRequired,
	error: types.title,
	isLoading: types.bool,
	// component props
	beforeValueChange: types.func,
	className: types.string,
	componentId: types.stringRequired,
	customQuery: types.func,
	dataField: types.stringRequired,
	defaultValue: types.stringOrArray,
	value: types.stringOrArray,
	filterLabel: types.string,
	innerClass: types.style,
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
	index: types.string,
	endpoint: types.endpoint,
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

// Add componentType for SSR
TagCloud.componentType = componentTypes.tagCloud;

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
	setCustomQuery: (component, query) => dispatch(setCustomQuery(component, query)),
	setQueryOptions: (...args) => dispatch(setQueryOptions(...args)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => <TagCloud ref={props.myForwardedRef} {...props} />);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<PreferencesConsumer userProps={props}>
		{preferenceProps => (
			<ComponentWrapper
				{...preferenceProps}
				internalComponent
				componentType={componentTypes.tagCloud}
			>
				{
					componentProps =>
						(<ConnectedComponent
							{...preferenceProps}
							{...componentProps}
							myForwardedRef={ref}
						/>)
				}
			</ComponentWrapper>
		)}
	</PreferencesConsumer>
));

hoistNonReactStatics(ForwardRefComponent, TagCloud);

ForwardRefComponent.displayName = 'TagCloud';
export default ForwardRefComponent;
