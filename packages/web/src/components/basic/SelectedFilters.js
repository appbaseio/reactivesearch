import React, { Component } from "react";
import { connect } from "react-redux";

import { setValue, clearValues } from "@appbaseio/reactivecore/lib/actions";
import types from "@appbaseio/reactivecore/lib/utils/types";
import Button, { filters } from "../../styles/Button";

class SelectedFilters extends Component {
	remove = (component) => {
		this.props.setValue(component, null);
	};

	renderValue = (value, isArray) => {
		if (isArray && value.length) {
			const arrayToRender = value.map(item => this.renderValue(item));
			return arrayToRender.join(", ");
		} else if (value && typeof value === "object") {
			// TODO: support for NestedList
			if (value.label || value.key) {
				return value.label || value.key;
			}
			return null;
		}
		return value;
	}

	render() {
		const { selectedValues } = this.props;
		let hasValues = false;

		return (<div className={filters}>
			{
				Object.keys(selectedValues)
					.filter(id => this.props.components.includes(id) && selectedValues[id].showFilter)
					.map((component, index) => {
						const { label, value } = selectedValues[component];
						const isArray = Array.isArray(value);

						if (label && (isArray && value.length) || (!isArray && value)) {
							hasValues = true;
							return (<Button key={`${component}-${index}`} onClick={() => this.remove(component)}>
								<span>{selectedValues[component].label}: {this.renderValue(value, isArray)}</span>
								<span>&#x2715;</span>
							</Button>);
						}
						return null;
					})
			}
			{
				hasValues
					? <Button onClick={this.props.clearValues}>Clear all filters</Button>
					: null
			}
		</div>)
	}
}

SelectedFilters.propTypes = {
	selectedValues: types.selectedValues,
	setValue: types.setValue,
	clearValues: types.clearValues,
	components: types.components
};

const mapStateToProps = state => ({
	selectedValues: state.selectedValues,
	components: state.components
});

const mapDispatchtoProps = dispatch => ({
	setValue: (component, value) => dispatch(setValue(component, value)),
	clearValues: () => (dispatch(clearValues()))
});

export default connect(mapStateToProps, mapDispatchtoProps)(SelectedFilters);
