import React, { Component } from 'react';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryListener,
	setQueryOptions,
} from '@appbaseio/reactivecore/lib/actions';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {
	checkValueChange,
	checkPropChange,
	getClassName,
	handleA11yAction,
	isEqual,
	getOptionsFromQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import Title from '../../styles/Title';
import Container from '../../styles/Container';
import StarRating from './addons/StarRating';
import { ratingsList } from '../../styles/ratingsList';
import { connect } from '../../utils';

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
		this.locked = false;

		props.addComponent(props.componentId);
		props.setQueryListener(props.componentId, props.onQueryChange, null);

		this.setReact(props);
		const hasMounted = false;

		if (currentValue) {
			this.setValue(currentValue, props, hasMounted);
		}
	}

	componentDidUpdate(prevProps) {
		checkPropChange(this.props.react, prevProps.react, () => this.setReact(this.props));

		checkPropChange(this.props.dataField, prevProps.dataField, () => {
			this.updateQuery(this.state.currentValue, this.props);
		});

		if (!isEqual(this.props.value, prevProps.value)) {
			this.setValue(this.props.value);
		} else if (
			!isEqual(this.state.currentValue, this.props.selectedValue)
			&& !isEqual(this.props.selectedValue, prevProps.selectedValue)
		) {
			this.setValue(this.props.selectedValue || null);
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

	// parses range label to get start and end
	static parseValue = (value) => {
		if (Array.isArray(value)) return value;
		return value ? [value.start, value.end] : null;
	};

	static defaultQuery = (value, props) => {
		if (value) {
			return {
				range: {
					[props.dataField]: {
						gte: value[0],
						lte: value[1],
						boost: 2.0,
					},
				},
			};
		}
		return null;
	};

	setValue = (value, props = this.props, hasMounted = true) => {
		// ignore state updates when component is locked
		if (props.beforeValueChange && this.locked) {
			return;
		}

		this.locked = true;
		const performUpdate = () => {
			const handleUpdates = () => {
				this.updateQuery(value, props);
				this.locked = false;
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

	updateQuery = (value, props) => {
		const { customQuery } = props;
		let query = RatingsFilter.defaultQuery(value, props);
		let customQueryOptions;
		if (customQuery) {
			({ query } = customQuery(value, props));
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
			componentType: 'RATINGSFILTER',
		});
	};

	handleClick = (selectedItem) => {
		const { value, onChange } = this.props;
		if (value) {
			if (onChange) onChange(selectedItem);
		} else {
			this.setValue(selectedItem);
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
					{this.props.data.map(item => (
						<li
							role="menuitem"
							tabIndex="0"
							className={
								this.state.currentValue && this.state.currentValue[0] === item.start
									? 'active'
									: ''
							}
							onClick={() => this.handleClick([item.start, item.end])}
							onKeyPress={e =>
								handleA11yAction(e, () => this.handleClick([item.start, item.end]))
							}
							key={`${this.props.componentId}-${item.start}-${item.end}`}
						>
							<StarRating stars={item.start} />
							{item.label ? <span>{item.label}</span> : null}
						</li>
					))}
				</ul>
			</Container>
		);
	}
}

RatingsFilter.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	selectedValue: types.selectedValue,
	setQueryOptions: types.funcRequired,
	// component props
	beforeValueChange: types.func,
	className: types.string,
	componentId: types.stringRequired,
	customQuery: types.func,
	data: types.data,
	dataField: types.stringRequired,
	defaultValue: types.range,
	value: types.range,
	filterLabel: types.string,
	innerClass: types.style,
	onQueryChange: types.func,
	onValueChange: types.func,
	onChange: types.func,
	react: types.react,
	style: types.style,
	title: types.title,
	URLParams: types.bool,
};

RatingsFilter.defaultProps = {
	className: null,
	style: {},
	URLParams: false,
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
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
	setQueryOptions: (component, props, execute) =>
		dispatch(setQueryOptions(component, props, execute)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => <RatingsFilter ref={props.myForwardedRef} {...props} />);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, RatingsFilter);

ForwardRefComponent.name = 'RatingsFilter';
export default ForwardRefComponent;
