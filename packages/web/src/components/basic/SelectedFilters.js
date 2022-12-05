/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/core';


import React, { Component } from 'react';
import { object } from 'prop-types';
import { withTheme } from 'emotion-theming';
import { setValue, clearValues, resetValuesToDefault } from '@appbaseio/reactivecore/lib/actions';
import { componentTypes, CLEAR_ALL } from '@appbaseio/reactivecore/lib/utils/constants';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { getClassName, handleA11yAction } from '@appbaseio/reactivecore/lib/utils/helper';
import Button, { filters } from '../../styles/Button';
import Container from '../../styles/Container';
import Title from '../../styles/Title';
import { connect, decodeHtml } from '../../utils';

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

	clearValue = (componentId) => {
		const { resetToDefault, resetToValues = {}, onClear } = this.props;
		if (resetToDefault) {
			this.props.resetValuesToDefault(
				this.components.filter(component => component !== componentId),
			);
		} else {
			this.props.setValue(componentId, resetToValues[componentId] || null);
		}
		if (onClear) {
			onClear(resetToValues[componentId]);
		}
	};
	clearValues = () => {
		const {
			onClear, resetToDefault, resetToValues, clearAllBlacklistComponents,
		} = this.props;
		if (resetToDefault) {
			this.props.resetValuesToDefault(clearAllBlacklistComponents);
		} else {
			this.props.clearValues(resetToValues, clearAllBlacklistComponents);
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
			// Detect if value is from a chart with chartType as custom
			if (value && typeof value === 'object') {
				if (value.mainLabel || value.secondaryLabel) {
					let data = '';
					try {
						if (value.data) {
							data = JSON.stringify(value.data);
						}
					} catch (e) {
						data = String(value.data);
					}
					if (value.mainLabel && value.secondaryLabel) {
						label = `${value.mainLabel}-${value.secondaryLabel}`;
					} else if (value.mainLabel) {
						label = `${value.mainLabel}`;
					} else {
						label = `${value.secondaryLabel}`;
					}
					if (data) {
						label += `-${data}`;
					}
				}
			}
			return label;
		}
		return value;
	};

	renderFilterButton = (component, keyProp, handleRemove, label) => (
		<Button
			className={getClassName(this.props.innerClass, 'button') || null}
			key={keyProp}
			onKeyPress={event => handleA11yAction(event, handleRemove)}
			onClick={handleRemove}
			tabIndex="0"
		>
			<span>{label}</span>
			<span>&#x2715;</span>
		</Button>
	);

	renderFilters = () => {
		const { selectedValues } = this.props;
		const filterComponents = Object.keys(selectedValues).filter(
			id => this.props.components.includes(id) && selectedValues[id].showFilter,
		);
		return filterComponents
			.map((component, index) => {
				const { label, value, category } = selectedValues[component];
				const isArray = Array.isArray(value);

				if (label && ((isArray && value.length) || (!isArray && value))) {
					const valueToRender = category
						? this.renderValue(`${value} in ${category} category`, isArray)
						: this.renderValue(value, isArray);
					return this.renderFilterButton(
						component,
						`${component}-${index + 1}`,
						() => this.remove(component, value),
						`${selectedValues[component].label}: ${decodeHtml(valueToRender)}`,
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
			return this.props.render({ clearValue: this.clearValue, ...this.props });
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
				{this.props.showClearAll && hasFilters && filtersToRender.length > 1 ? (
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
	resetToValues: object, // eslint-disable-line
	resetValuesToDefault: types.func,
	clearAllBlacklistComponents: types.stringArray,
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
	clearValues: (resetToValues, clearAllBlacklistComponents) =>
		dispatch(clearValues(resetToValues, clearAllBlacklistComponents)),
	setValue: (component, value) => dispatch(setValue(component, value)),
	resetValuesToDefault: clearAllBlacklistComponents =>
		dispatch(resetValuesToDefault(clearAllBlacklistComponents)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(withTheme(props => <SelectedFilters ref={props.myForwardedRef} {...props} />));

// eslint-disable-next-line
export default React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
