import React, { Component } from 'react';

import { updateQuery, setQueryOptions, setCustomQuery } from '@appbaseio/reactivecore/lib/actions';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import {
	checkValueChange,
	checkSomePropChange,
	getClassName,
	handleA11yAction,
	isEqual,
	updateCustomQuery,
	getOptionsFromQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { element } from 'prop-types';

import Title from '../../styles/Title';
import Container from '../../styles/Container';
import StarRating from './addons/StarRating';
import { ratingsList } from '../../styles/ratingsList';
import ComponentWrapper from '../basic/ComponentWrapper';
import { connect, getRangeQueryWithNullValues } from '../../utils';

class RatingsFilter extends Component {
	constructor(props) {
		super(props);

		const defaultValue = props.defaultValue || props.value;
		const value = props.selectedValue || defaultValue || null;
		const currentValue = RatingsFilter.parseValue(value, props);

		this.state = {
			currentValue,
		};
		this.type = 'range';
		// Set custom query in store
		updateCustomQuery(props.componentId, props, currentValue);

		const hasMounted = false;

		if (currentValue) {
			this.setValue({
				value: currentValue,
				props,
				hasMounted,
				includeUnrated: this.getIncludeUnratedFromData(currentValue),
			});
		}
	}

	componentDidUpdate(prevProps) {
		checkSomePropChange(this.props, prevProps, ['dataField', 'nestedField'], () => {
			this.updateQuery(this.state.currentValue, this.props);
		});

		if (!isEqual(this.props.value, prevProps.value)) {
			this.setValue({ value: this.props.value });
		} else if (
			!isEqual(this.state.currentValue, this.props.selectedValue)
			&& !isEqual(this.props.selectedValue, prevProps.selectedValue)
		) {
			const { value, onChange } = this.props;
			if (value === undefined) {
				this.setValue({
					value: this.props.selectedValue || null,
					includeUnrated: this.getIncludeUnratedFromData(this.props.selectedValue),
				});
			} else if (onChange) {
				onChange(this.props.selectedValue || null);
			} else {
				this.setValue({
					value: this.state.currentValue,
					includeUnrated: this.getIncludeUnratedFromData(this.state.currentValue),
				});
			}
		}
	}

	getIncludeUnratedFromData = (range) => {
		if (!this.props.data || !range) return false;
		const dataObj = this.props.data.find(
			data => data.start === range[0] && data.end === range[1],
		);
		return dataObj && dataObj.includeUnrated;
	};

	// parses range label to get start and end
	static parseValue = (value) => {
		if (Array.isArray(value)) return value;
		return value ? [value.start, value.end] : null;
	};

	static defaultQuery = (value, props, includeUnrated = false) => {
		let query = null;
		if (value) {
			query = getRangeQueryWithNullValues(value, {
				dataField: props.dataField,
				includeNullValues: props.includeNullValues || includeUnrated,
			});
		}

		if (query && props.nestedField) {
			return {
				nested: {
					path: props.nestedField,
					query,
				},
			};
		}

		return query;
	};

	setValue = ({
		value, props = this.props, hasMounted = true, includeUnrated = false,
	}) => {
		const performUpdate = () => {
			const handleUpdates = () => {
				this.updateQuery(value, props, includeUnrated);
				if (props.onValueChange) props.onValueChange(value);
			};

			if (hasMounted) {
				this.setState(
					{
						currentValue: value,
					},
					handleUpdates,
				);
			} else {
				handleUpdates();
			}
		};
		checkValueChange(props.componentId, value, props.beforeValueChange, performUpdate);
	};

	updateQuery = (value, props, includeUnrated) => {
		const { customQuery } = props;
		let query = RatingsFilter.defaultQuery(value, props, includeUnrated);
		let customQueryOptions;
		if (customQuery) {
			({ query } = customQuery(value, props) || {});
			customQueryOptions = getOptionsFromQuery(customQuery(value, props));
			updateCustomQuery(props.componentId, props, value);
		}
		props.setQueryOptions(props.componentId, customQueryOptions);

		props.updateQuery({
			componentId: props.componentId,
			query,
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: componentTypes.ratingsFilter,
		});
	};

	handleClick = (selectedItem, params) => {
		const { value, onChange } = this.props;
		if (value === undefined) {
			this.setValue({ value: selectedItem, includeUnrated: params.includeUnrated });
		} else if (onChange) {
			onChange(selectedItem);
		}
	};

	render() {
		return (
			<Container style={this.props.style} className={this.props.className}>
				{this.props.title && (
					<Title className={getClassName(this.props.innerClass, 'title') || null}>
						{this.props.title}
					</Title>
				)}
				<ul className={ratingsList}>
					{this.props.data.map((item) => {
						const {
							start, end, label, ...rest
						} = item;
						return (
							<li
								role="menuitem"
								tabIndex="0"
								className={
									this.state.currentValue && this.state.currentValue[0] === start
										? 'active'
										: ''
								}
								onClick={() => this.handleClick([start, end], rest)}
								onKeyPress={e =>
									handleA11yAction(e, () => this.handleClick([start, end], rest))
								}
								key={`${this.props.componentId}-${start}-${end}`}
							>
								<StarRating
									icon={this.props.icon}
									dimmedIcon={this.props.dimmedIcon}
									stars={start}
								/>
								{label ? <span>{label}</span> : null}
							</li>
						);
					})}
				</ul>
			</Container>
		);
	}
}

RatingsFilter.propTypes = {
	updateQuery: types.funcRequired,
	selectedValue: types.selectedValue,
	setQueryOptions: types.funcRequired,
	setCustomQuery: types.funcRequired,
	// component props
	beforeValueChange: types.func,
	className: types.string,
	componentId: types.stringRequired,
	customQuery: types.func,
	data: types.data,
	dataField: types.stringRequired,
	defaultValue: types.range,
	dimmedIcon: element,
	value: types.range,
	filterLabel: types.string,
	icon: element,
	innerClass: types.style,
	nestedField: types.string,
	onQueryChange: types.func,
	onValueChange: types.func,
	onChange: types.func,
	react: types.react,
	style: types.style,
	title: types.title,
	URLParams: types.bool,
	includeNullValues: types.bool,
};

RatingsFilter.defaultProps = {
	className: null,
	style: {},
	URLParams: false,
	includeNullValues: false,
};

const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
});

const mapDispatchtoProps = dispatch => ({
	setCustomQuery: (component, query) => dispatch(setCustomQuery(component, query)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => (
	<ComponentWrapper {...props} componentType={componentTypes.ratingsFilter}>
		{() => <RatingsFilter ref={props.myForwardedRef} {...props} />}
	</ComponentWrapper>
));

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, RatingsFilter);

ForwardRefComponent.name = 'RatingsFilter';
export default ForwardRefComponent;
