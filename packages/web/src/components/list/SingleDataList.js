import React, { Component } from 'react';

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryListener,
	setQueryOptions,
} from '@appbaseio/reactivecore/lib/actions';
import {
	checkValueChange,
	checkPropChange,
	getClassName,
	pushToAndClause,
	getQueryOptions,
} from '@appbaseio/reactivecore/lib/utils/helper';

import types from '@appbaseio/reactivecore/lib/utils/types';

import Title from '../../styles/Title';
import Input from '../../styles/Input';
import Container from '../../styles/Container';
import { UL, Radio } from '../../styles/FormControlList';
import { connect } from '../../utils';
import { getAggsQuery } from './utils';

class SingleDataList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: null,
			searchTerm: '',
			options: this.props.data || [],
		};

		this.internalComponent = `${props.componentId}__internal`;
		this.locked = false;
		props.setQueryListener(props.componentId, props.onQueryChange, null);
	}

	componentWillMount() {
		this.props.addComponent(this.internalComponent);
		this.props.addComponent(this.props.componentId);

		if (this.props.showCount) {
			this.updateQueryOptions(this.props);
		}

		this.setReact(this.props);

		if (this.props.selectedValue) {
			this.setValue(this.props.selectedValue);
		} else if (this.props.defaultSelected) {
			this.setValue(this.props.defaultSelected);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(this.props.react, nextProps.react, () => this.setReact(nextProps));
		checkPropChange(this.props.dataField, nextProps.dataField, () => {
			this.updateQuery(this.state.currentValue, nextProps);

			if (nextProps.showCount) {
				this.updateQueryOptions(nextProps);
			}
		});

		checkPropChange(this.props.data, nextProps.data, () => {
			if (nextProps.showCount) {
				this.updateQueryOptions(nextProps);
			}
		});

		checkPropChange(this.props.options, nextProps.options, () => {
			this.updateStateOptions(nextProps.options[nextProps.dataField].buckets);
		});

		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.setValue(nextProps.defaultSelected);
		} else if (this.state.currentValue !== nextProps.selectedValue) {
			this.setValue(nextProps.selectedValue || '');
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
		this.props.removeComponent(this.internalComponent);
	}

	setReact(props) {
		const { react } = props;
		if (react) {
			const newReact = pushToAndClause(react, this.internalComponent);
			props.watchComponent(props.componentId, newReact);
		} else {
			props.watchComponent(props.componentId, {
				and: this.internalComponent,
			});
		}
	}

	static defaultQuery = (value, props) => {
		if (props.selectAllLabel && props.selectAllLabel === value) {
			return {
				exists: {
					field: props.dataField,
				},
			};
		} else if (value) {
			return {
				term: {
					[props.dataField]: value,
				},
			};
		}
		return null;
	};

	setValue = (nextValue, props = this.props) => {
		// ignore state updates when component is locked
		if (props.beforeValueChange && this.locked) {
			return;
		}

		this.locked = true;
		let value = nextValue;
		if (nextValue === this.state.currentValue) {
			value = null;
		}

		const performUpdate = () => {
			this.setState(
				{
					currentValue: value,
				},
				() => {
					this.updateQuery(value, props);
					this.locked = false;
					if (props.onValueChange) props.onValueChange(value);
				},
			);
		};

		checkValueChange(props.componentId, value, props.beforeValueChange, performUpdate);
	};

	updateQuery = (value, props) => {
		const query = props.customQuery || SingleDataList.defaultQuery;

		let currentValue = value;
		if (value !== props.selectAllLabel) {
			currentValue = props.data.find(item => item.label === value);
			currentValue = currentValue ? currentValue.value : null;
		}

		props.updateQuery({
			componentId: props.componentId,
			query: query(currentValue, props),
			value: currentValue ? value : null,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: 'SINGLEDATALIST',
		});
	};

	static generateQueryOptions(props, state) {
		const queryOptions = getQueryOptions(props);
		const includes = state.options.map(item => item.value);
		return getAggsQuery(queryOptions, props, includes);
	}

	updateQueryOptions = (props) => {
		const queryOptions = SingleDataList.generateQueryOptions(props, this.state);
		props.setQueryOptions(this.internalComponent, queryOptions);
	};

	updateStateOptions = (bucket) => {
		if (bucket) {
			const bucketDictionary = bucket.reduce(
				(obj, item) => ({
					...obj,
					[item.key]: item.doc_count,
				}),
				{},
			);

			const { options } = this.state;
			const newOptions = options.map((item) => {
				if (bucketDictionary[item.value]) {
					return {
						...item,
						count: bucketDictionary[item.value],
					};
				}

				return item;
			});

			this.setState({
				options: newOptions,
			});
		}
	};

	handleInputChange = (e) => {
		const { value } = e.target;
		this.setState({
			searchTerm: value,
		});
	};

	renderSearch = () => {
		if (this.props.showSearch) {
			return (
				<Input
					className={getClassName(this.props.innerClass, 'input') || null}
					onChange={this.handleInputChange}
					value={this.state.searchTerm}
					placeholder={this.props.placeholder}
					style={{
						margin: '0 0 8px',
					}}
					themePreset={this.props.themePreset}
				/>
			);
		}
		return null;
	};

	handleClick = (e) => {
		this.setValue(e.target.value);
	};

	render() {
		const { selectAllLabel, showCount, renderListItem } = this.props;
		const { options } = this.state;

		if (options.length === 0) {
			return null;
		}

		return (
			<Container style={this.props.style} className={this.props.className}>
				{this.props.title && (
					<Title className={getClassName(this.props.innerClass, 'title') || null}>
						{this.props.title}
					</Title>
				)}
				{this.renderSearch()}
				<UL className={getClassName(this.props.innerClass, 'list') || null}>
					{selectAllLabel && (
						<li
							key={selectAllLabel}
							className={`${
								this.state.currentValue === selectAllLabel ? 'active' : ''
							}`}
						>
							<Radio
								className={getClassName(this.props.innerClass, 'radio')}
								id={`${this.props.componentId}-${selectAllLabel}`}
								name={this.props.componentId}
								value={selectAllLabel}
								onChange={this.handleClick}
								checked={this.state.currentValue === selectAllLabel}
								show={this.props.showRadio}
							/>
							<label
								className={getClassName(this.props.innerClass, 'label') || null}
								htmlFor={`${this.props.componentId}-${selectAllLabel}`}
							>
								{selectAllLabel}
							</label>
						</li>
					)}
					{options
						.filter((item) => {
							if (this.props.showSearch && this.state.searchTerm) {
								return item.label
									.toLowerCase()
									.includes(this.state.searchTerm.toLowerCase());
							}
							return true;
						})
						.map(item => (
							<li
								key={item.label}
								className={`${
									this.state.currentValue === item.label ? 'active' : ''
								}`}
							>
								<Radio
									className={getClassName(this.props.innerClass, 'radio')}
									id={`${this.props.componentId}-${item.label}`}
									name={this.props.componentId}
									value={item.label}
									onClick={this.handleClick}
									readOnly
									checked={this.state.currentValue === item.label}
									show={this.props.showRadio}
								/>
								<label
									className={getClassName(this.props.innerClass, 'label') || null}
									htmlFor={`${this.props.componentId}-${item.label}`}
								>
									{renderListItem ? (
										renderListItem(item.label, item.count)
									) : (
										<span>
											{item.label}
											{showCount && item.count && (
												<span
													className={
														getClassName(
															this.props.innerClass,
															'count',
														) || null
													}
												>
													&nbsp;({item.count})
												</span>
											)}
										</span>
									)}
								</label>
							</li>
						))}
				</UL>
			</Container>
		);
	}
}

SingleDataList.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	selectedValue: types.selectedValue,
	options: types.options,
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
	placeholder: types.string,
	react: types.react,
	selectAllLabel: types.string,
	showFilter: types.bool,
	showRadio: types.boolRequired,
	showSearch: types.bool,
	style: types.style,
	themePreset: types.themePreset,
	title: types.title,
	URLParams: types.bool,
	showCount: types.bool,
	renderListItem: types.func,
};

SingleDataList.defaultProps = {
	className: null,
	placeholder: 'Search',
	showFilter: true,
	showRadio: true,
	showSearch: true,
	style: {},
	URLParams: false,
	showCount: false,
};

const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	themePreset: state.config.themePreset,
	options: state.aggregations[props.componentId],
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
});

export default connect(
	mapStateToProps,
	mapDispatchtoProps,
)(SingleDataList);
