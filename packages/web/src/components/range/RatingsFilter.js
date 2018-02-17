import React, { Component } from 'react';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
} from '@appbaseio/reactivecore/lib/actions';
import {
	checkValueChange,
	checkPropChange,
	getClassName,
	handleA11yAction,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import Title from '../../styles/Title';
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
	}

	componentWillMount() {
		this.props.addComponent(this.props.componentId);
		this.setReact(this.props);

		if (this.props.selectedValue) {
			this.setValue(this.props.selectedValue);
		} else if (this.props.defaultSelected) {
			this.setValue(this.props.defaultSelected);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(this.props.react, nextProps.react, () => {
			this.setReact(nextProps);
		});

		checkPropChange(this.props.dataField, nextProps.dataField, () => {
			this.updateQuery(this.state.currentValue, nextProps);
		});

		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.setValue(nextProps.defaultSelected, nextProps);
		} else if (this.state.currentValue !== nextProps.selectedValue) {
			this.setValue(nextProps.selectedValue || '', nextProps);
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
		if (value) {
			return {
				range: {
					[props.dataField]: {
						gte: value.start,
						lte: value.end,
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
			});
		};
		checkValueChange(
			props.componentId,
			value,
			props.beforeValueChange,
			props.onValueChange,
			performUpdate,
		);
	};

	updateQuery = (value, props) => {
		const query = props.customQuery || this.defaultQuery;

		const { onQueryChange = null } = props;

		props.updateQuery({
			componentId: props.componentId,
			query: query(value, props),
			value,
			label: props.filterLabel,
			showFilter: false,
			onQueryChange,
			URLParams: props.URLParams,
		});
	};

	render() {
		return (
			<div style={this.props.style} className={this.props.className}>
				{this.props.title && <Title className={getClassName(this.props.innerClass, 'title') || null}>{this.props.title}</Title>}
				<ul className={ratingsList}>
					{
						this.props.data.map(item => (
							<li
								role="menuitem"
								tabIndex="0"
								className={
									this.state.currentValue
									&& this.state.currentValue.start === item.start
										? 'active'
										: ''
								}
								onClick={() => this.setValue(item)}
								onKeyPress={e => handleA11yAction(e, () => this.setValue(item))}
								key={item.label}
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
			</div>
		);
	}
}

RatingsFilter.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
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
	defaultSelected: types.string,
	filterLabel: types.string,
	innerClass: types.style,
	onQueryChange: types.func,
	onValueChange: types.func,
	react: types.react,
	style: types.style,
	title: types.title,
	URLParams: types.boolRequired,
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
});

export default connect(mapStateToProps, mapDispatchtoProps)(RatingsFilter);
