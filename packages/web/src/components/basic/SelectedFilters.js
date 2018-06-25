import React, { Component } from 'react';
import { withTheme } from 'emotion-theming';

import { setValue, clearValues } from '@appbaseio/reactivecore/lib/actions';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { getClassName } from '@appbaseio/reactivecore/lib/utils/helper';
import Button, { filters } from '../../styles/Button';
import Container from '../../styles/Container';
import { connect } from '../../utils';

class SelectedFilters extends Component {
	remove = (component, value = null) => {
		this.props.setValue(component, null);
		this.props.onClear && this.props.onClear(component, value);
	};

	clearValues = () => {
		this.props.clearValues();
		this.props.onClear && this.props.onClear(null);
	}

	renderValue = (value, isArray) => {
		if (isArray && value.length) {
			const arrayToRender = value.map(item => this.renderValue(item));
			return arrayToRender.join(', ');
		} else if (value && typeof value === 'object') {
			// TODO: support for NestedList
			let label = (typeof value.label === 'string' ? value.label : value.value) || value.key || value.distance || null;
			if (value.location) {
				label = `${value.location} - ${label}`;
			}
			return label;
		}
		return value;
	}

	render() {
		const { selectedValues, theme } = this.props;
		let hasValues = false;

		return (
			<Container style={this.props.style} className={`${filters(theme)} ${this.props.className || ''}`}>
				{
					Object.keys(selectedValues)
						.filter(id => this.props.components.includes(id) && selectedValues[id].showFilter)
						.map((component, index) => {
							const { label, value } = selectedValues[component];
							const isArray = Array.isArray(value);

							if (label && ((isArray && value.length) || (!isArray && value))) {
								hasValues = true;
								const valueToRender = this.renderValue(value, isArray);
								return (
									<Button
										className={getClassName(this.props.innerClass, 'button') || null}
										key={`${component}-${index}`} // eslint-disable-line
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
				}
				{
					this.props.showClearAll && hasValues
						? (
							<Button
								className={getClassName(this.props.innerClass, 'button') || null}
								onClick={this.clearValues}
							>
								{this.props.clearAllLabel}
							</Button>
						)
						: null
				}
			</Container>
		);
	}
}

SelectedFilters.propTypes = {
	clearValues: types.func,
	setValue: types.func,
	components: types.components,
	selectedValues: types.selectedValues,
	className: types.string,
	clearAllLabel: types.title,
	innerClass: types.style,
	showClearAll: types.bool,
	style: types.style,
	theme: types.style,
	onClear: types.func
};

SelectedFilters.defaultProps = {
	className: null,
	clearAllLabel: 'Clear All',
	showClearAll: true,
	style: {},
};

const mapStateToProps = state => ({
	components: state.components,
	selectedValues: state.selectedValues,
});

const mapDispatchtoProps = dispatch => ({
	clearValues: () => (dispatch(clearValues())),
	setValue: (component, value) => dispatch(setValue(component, value)),
});

export default connect(
	mapStateToProps,
	mapDispatchtoProps,
)(withTheme(SelectedFilters));
