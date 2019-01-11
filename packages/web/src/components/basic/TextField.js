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
	debounce,
	checkValueChange,
	checkPropChange,
	checkSomePropChange,
	getClassName,
	getOptionsFromQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';

import Input, { suggestionsContainer } from '../../styles/Input';
import InputIcon from '../../styles/InputIcon';
import CancelSvg from '../shared/CancelSvg';
import Title from '../../styles/Title';
import Container from '../../styles/Container';
import { connect } from '../../utils';

class TextField extends Component {
	constructor(props) {
		super(props);

		const currentValue = props.selectedValue || props.value || props.defaultValue || '';
		this.state = {
			currentValue,
		};
		this.locked = false;

		props.addComponent(props.componentId);
		props.setQueryListener(props.componentId, props.onQueryChange, null);

		this.setReact(props);
		const hasMounted = false;

		if (currentValue) {
			this.setValue(currentValue, true, props, hasMounted);
		}
	}

	componentDidUpdate(prevProps) {
		checkPropChange(this.props.react, prevProps.react, () => {
			this.setReact(this.props);
		});

		checkSomePropChange(this.props, prevProps, ['dataField', 'nestedField'], () => {
			this.updateQuery(this.state.currentValue, this.props);
		});

		if (this.props.value !== prevProps.value) {
			this.setValue(this.props.value, true, this.props);
		} else if (
			// since, selectedValue will be updated when currentValue changes,
			// we must only check for the changes introduced by
			// clear action from SelectedFilters component in which case,
			// the currentValue will never match the updated selectedValue
			this.props.selectedValue !== prevProps.selectedValue
			&& this.state.currentValue !== this.props.selectedValue
		) {
			this.setValue(this.props.selectedValue || '', true, this.props);
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

	static defaultQuery = (value, props) => {
		let query = null;
		if (value && value.trim() !== '') {
			query = {
				match: {
					[props.dataField]: value,
				},
			};
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

	handleTextChange = debounce((value) => {
		this.updateQuery(value, this.props);
	}, this.props.debounce);

	setValue = (value, isDefaultValue = false, props = this.props, hasMounted = true) => {
		// ignore state updates when component is locked
		if (props.beforeValueChange && this.locked) {
			return;
		}

		this.locked = true;
		const performUpdate = () => {
			if (hasMounted) {
				this.setState(
					{
						currentValue: value,
					},
					() => {
						if (isDefaultValue) {
							this.updateQuery(value, props);
						} else {
							// debounce for handling text while typing
							this.handleTextChange(value);
						}
						this.locked = false;
						if (props.onValueChange) props.onValueChange(value);
					},
				);
			} else {
				this.updateQuery(value, props);
				this.locked = false;
				if (props.onValueChange) props.onValueChange(value);
			}
		};
		checkValueChange(props.componentId, value, props.beforeValueChange, performUpdate);
	};

	updateQuery = (value, props) => {
		const { customQuery } = props;
		let query = TextField.defaultQuery(value, props);
		let customQueryOptions;
		if (customQuery) {
			({ query } = customQuery(value, props));
			customQueryOptions = getOptionsFromQuery(customQuery(value, props));
		}
		this.queryOptions = {
			...this.queryOptions,
			...customQueryOptions,
		};
		props.setQueryOptions(props.componentId, this.queryOptions);

		props.updateQuery({
			componentId: props.componentId,
			query,
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
		});
	};

	handleChange = (e) => {
		const { value, onChange } = this.props;
		const { value: textValue } = e.target;

		if (value === undefined) {
			this.setValue(textValue);
		} else if (onChange) {
			onChange(textValue);
		}
	};

	clearValue = () => {
		const { value, onChange } = this.props;
		if (value) {
			if (onChange) onChange('');
		} else {
			this.setValue('', true);
		}
	};

	renderCancelIcon = () => {
		if (this.props.showClear) {
			return this.props.clearIcon || <CancelSvg />;
		}
		return null;
	};

	renderIcons = () => (
		<div>
			{this.state.currentValue && this.props.showClear && (
				<InputIcon onClick={this.clearValue} iconPosition="right">
					{this.renderCancelIcon()}
				</InputIcon>
			)}
		</div>
	);

	render() {
		return (
			<Container style={this.props.style} className={this.props.className}>
				{this.props.title && (
					<Title className={getClassName(this.props.innerClass, 'title') || null}>
						{this.props.title}
					</Title>
				)}
				<div className={suggestionsContainer}>
					<Input
						type="text"
						className={getClassName(this.props.innerClass, 'input') || null}
						placeholder={this.props.placeholder}
						onChange={this.handleChange}
						value={this.state.currentValue}
						onBlur={this.props.onBlur}
						onFocus={this.props.onFocus}
						onKeyPress={this.props.onKeyPress}
						onKeyDown={this.props.onKeyDown}
						onKeyUp={this.props.onKeyUp}
						autoFocus={this.props.autoFocus}
						innerRef={(c) => {
							this._inputRef = c;
						}}
						themePreset={this.props.themePreset}
						showClear={this.props.showClear}
					/>
					{this.renderIcons()}
				</div>
			</Container>
		);
	}
}

TextField.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	selectedValue: types.selectedValue,
	setQueryOptions: types.funcRequired,
	// component props
	autoFocus: types.bool,
	beforeValueChange: types.func,
	className: types.string,
	clearIcon: types.children,
	componentId: types.stringRequired,
	customQuery: types.func,
	dataField: types.stringRequired,
	debounce: types.number,
	defaultValue: types.string,
	value: types.string,
	filterLabel: types.string,
	innerClass: types.style,
	onBlur: types.func,
	onFocus: types.func,
	onKeyDown: types.func,
	onKeyPress: types.func,
	onKeyUp: types.func,
	onQueryChange: types.func,
	onValueChange: types.func,
	onChange: types.func,
	placeholder: types.string,
	nestedField: types.string,
	react: types.react,
	ref: types.func,
	showClear: types.bool,
	showFilter: types.bool,
	style: types.style,
	themePreset: types.themePreset,
	title: types.title,
	URLParams: types.bool,
};

TextField.defaultProps = {
	className: null,
	debounce: 0,
	placeholder: 'Search',
	showClear: false,
	showFilter: true,
	style: {},
	URLParams: false,
};

const mapStateToProps = (state, props) => ({
	selectedValue:
		(state.selectedValues[props.componentId]
			&& state.selectedValues[props.componentId].value)
		|| null,
	themePreset: state.config.themePreset,
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

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(props => <TextField ref={props.myForwardedRef} {...props} />);

// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, TextField);

ForwardRefComponent.name = 'TextField';
export default ForwardRefComponent;
