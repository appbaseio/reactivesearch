/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { Component } from 'react';
import { withTheme } from 'emotion-theming';
import { setValue, clearValues, resetValuesToDefault } from '@appbaseio/reactivecore/lib/actions';
import { componentTypes, CLEAR_ALL } from '@appbaseio/reactivecore/lib/utils/constants';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { getClassName, handleA11yAction } from '@appbaseio/reactivecore/lib/utils/helper';
import Button, { filters } from '../../styles/Button';
import Container from '../../styles/Container';
import Title from '../../styles/Title';
import { connect } from '../../utils';

class SelectedFilters extends Component {
	constructor(props) {
		super(props);
		this.extracted(props);
	}

	extracted(props) {
		if (props.showClearAll === true) {
			this._showClearAll = CLEAR_ALL.ALWAYS;
		} else {
			this._showClearAll
				= props.showClearAll === false ? CLEAR_ALL.NEVER : props.showClearAll;
		}
	}

	componentDidUpdate = () => {
		if (this.props.onChange) {
			this.props.onChange(this.props.selectedValues);
		}
	};

	remove = (component, value = null) => {
		const { onClear } = this.props;
		this.props.setValue(component, null);
		if (onClear) {
			onClear(component, value);
		}
	};

	clearValues = () => {
		const { onClear, resetToDefault } = this.props;
		if (resetToDefault) {
			this.props.resetValuesToDefault();
		} else {
			this.props.clearValues();
		}
		if (onClear) {
			onClear(null);
		}
	};

	renderValue = (value, isArray) => {
		if (isArray && value.length) {
			const arrayToRender = value.map(item => this.renderValue(item));
			return arrayToRender.join(', ');
		} else if (value && typeof value === 'object') {
			// TODO: support for NestedList
			let label
				= (typeof value.label === 'string' ? value.label : value.value)
				|| value.key
				|| value.distance
				|| null;
			if (value.location) {
				label = `${value.location} - ${label}`;
			}
			return label;
		}
		return value;
	};

	renderFilters = () => {
		const { selectedValues } = this.props;
		return Object.keys(selectedValues)
			.filter(id => this.props.components.includes(id) && selectedValues[id].showFilter)
			.map((component, index) => {
				const { label, value, category } = selectedValues[component];
				const isArray = Array.isArray(value);

				if (label && ((isArray && value.length) || (!isArray && value))) {
					const valueToRender = category
						? this.renderValue(`${value} in ${category} category`, isArray)
						: this.renderValue(value, isArray);
					return (
						<Button
							className={getClassName(this.props.innerClass, 'button') || null}
							key={`${component}-${index + 1}`}
							tabIndex="0"
							onKeyPress={event =>
								handleA11yAction(event, () => this.remove(component, value))
							}
							onClick={() => this.remove(component, value)}
						>
							<span>
								{selectedValues[component].label}: {valueToRender}
							</span>
							<span>&#x2715;</span>
						</Button>
					);
				}
				return null;
			})
			.filter(Boolean);
	};

	// determines whether any filter has been applied regardless of `showFilter=false`
	hasFilters = () => {
		const { componentProps, selectedValues, components } = this.props;
		return Object.keys(selectedValues)
			.filter(id => components.includes(id))
			.some((component) => {
				const { value } = selectedValues[component];
				const isResultComponent
					= componentProps[component]
					&& componentProps[component].componentType === componentTypes.reactiveList;
				const isArray = Array.isArray(value);
				return ((isArray && value.length) || (!isArray && value)) && !isResultComponent;
			});
	};
	render() {
		if (this.props.render) {
			return this.props.render(this.props);
		}

		const { theme } = this.props;
		const filtersToRender = this.renderFilters();
		let hasFilters;
		if (this._showClearAll === CLEAR_ALL.ALWAYS) {
			hasFilters = this.hasFilters();
		} else {
			hasFilters
				= this._showClearAll === CLEAR_ALL.DEFAULT ? !!filtersToRender.length : false;
		}

		return (
			<Container
				style={this.props.style}
				css={filters(theme)}
				className={`${this.props.className || ''}`}
			>
				{this.props.title && hasFilters && (
					<Title className={getClassName(this.props.innerClass, 'title') || null}>
						{this.props.title}
					</Title>
				)}
				{filtersToRender}
				{this.props.showClearAll && hasFilters ? (
					<Button
						className={getClassName(this.props.innerClass, 'button') || null}
						onClick={this.clearValues}
						tabIndex="0"
						onKeyPress={event => handleA11yAction(event, this.clearValues)}
					>
						{this.props.clearAllLabel}
					</Button>
				) : null}
			</Container>
		);
	}
}

SelectedFilters.propTypes = {
	clearValues: types.func,
	setValue: types.func,
	components: types.components,
	componentProps: types.props,
	selectedValues: types.selectedValues,
	className: types.string,
	clearAllLabel: types.title,
	innerClass: types.style,
	showClearAll: types.showClearAll,
	style: types.style,
	theme: types.style,
	onClear: types.func,
	render: types.func,
	title: types.title,
	onChange: types.func,
	resetToDefault: types.bool,
	resetValuesToDefault: types.func,
};

SelectedFilters.defaultProps = {
	className: null,
	clearAllLabel: 'Clear All',
	showClearAll: true,
	style: {},
	componentProps: {},
	resetToDefault: false,
};

const mapStateToProps = state => ({
	components: state.components,
	selectedValues: state.selectedValues,
	componentProps: state.props,
});

const mapDispatchtoProps = dispatch => ({
	clearValues: () => dispatch(clearValues()),
	setValue: (component, value) => dispatch(setValue(component, value)),
	resetValuesToDefault: () => dispatch(resetValuesToDefault()),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(withTheme(props => <SelectedFilters ref={props.myForwardedRef} {...props} />));

// eslint-disable-next-line
export default React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
