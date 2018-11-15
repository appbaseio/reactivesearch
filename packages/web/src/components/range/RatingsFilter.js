import React, { Component } from 'react';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryListener,
} from '@appbaseio/reactivecore/lib/actions';
import {
	checkValueChange,
	checkPropChange,
	getClassName,
	handleA11yAction,
	isEqual,
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

		this.type = 'range';
		this.state = {
			currentValue: null,
		};
		this.locked = false;
		props.setQueryListener(props.componentId, props.onQueryChange, null);
	}

	componentWillMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);

		const { selectedValue, defaultSelected } = this.props;
		if (selectedValue) {
			if (Array.isArray(selectedValue)) {
				this.setValue(selectedValue);
			} else {
				// for SSR
				this.setValue(RatingsFilter.parseValue(selectedValue));
			}
		} else if (defaultSelected) {
			this.setValue(RatingsFilter.parseValue(defaultSelected));
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(this.props.react, nextProps.react, () => {
			this.setReact(nextProps);
		});

		checkPropChange(this.props.dataField, nextProps.dataField, () => {
			this.updateQuery(this.state.currentValue, nextProps);
		});

		if (!isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			this.setValue(
				nextProps.defaultSelected
					? [
						nextProps.defaultSelected.start,
						nextProps.defaultSelected.end,
					]
					: null,
				nextProps,
			);
		} else if (!isEqual(this.state.currentValue, nextProps.selectedValue)) {
			this.setValue(nextProps.selectedValue || null, nextProps);
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
	static parseValue = value => (value
		? [value.start, value.end]
		: null
	)

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
	}

	setValue = (value, props = this.props) => {
		// ignore state updates when component is locked
		if (props.beforeValueChange && this.locked) {
			return;
		}

		this.locked = true;
		const performUpdate = () => {
			this.setState({
				currentValue: value,
			}, () => {
				this.updateQuery(value, props);
				this.locked = false;
				if (props.onValueChange) props.onValueChange(value);
			});
		};
		checkValueChange(
			props.componentId,
			value,
			props.beforeValueChange,
			performUpdate,
		);
	};

	updateQuery = (value, props) => {
		const query = props.customQuery || RatingsFilter.defaultQuery;

		props.updateQuery({
			componentId: props.componentId,
			query: query(value, props),
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: 'RATINGSFILTER',
		});
	};

	render() {
		return (
			<Container style={this.props.style} className={this.props.className}>
				{this.props.title && <Title className={getClassName(this.props.innerClass, 'title') || null}>{this.props.title}</Title>}
				<ul className={ratingsList}>
					{
						this.props.data.map(item => (
							<li
								role="menuitem"
								tabIndex="0"
								className={
									this.state.currentValue
									&& this.state.currentValue[0] === item.start
										? 'active'
										: ''
								}
								onClick={() => this.setValue([item.start, item.end])}
								onKeyPress={e => handleA11yAction(e, () => this.setValue([item.start, item.end]))}
								key={`${this.props.componentId}-${item.start}-${item.end}`}
							>
								<StarRating stars={item.start} />
								{
									item.label
										? (<span>{item.label}</span>)
										: null
								}
							</li>
						))
					}
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
	// component props
	beforeValueChange: types.func,
	className: types.string,
	componentId: types.stringRequired,
	customQuery: types.func,
	data: types.data,
	dataField: types.stringRequired,
	defaultSelected: types.range,
	filterLabel: types.string,
	innerClass: types.style,
	onQueryChange: types.func,
	onValueChange: types.func,
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
	selectedValue: (state.selectedValues[props.componentId]
		&& state.selectedValues[props.componentId].value) || null,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
});

const ConnectedMyComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => <RatingsFilter ref={props.myForwardedRef} {...props} />);

export default React.forwardRef((props, ref) =>
	<ConnectedMyComponent {...props} myForwardedRef={ref} />);
