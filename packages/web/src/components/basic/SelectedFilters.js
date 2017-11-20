import React, { Component } from "react";
import { connect } from "react-redux";

import { setValue, clearValues } from "@appbaseio/reactivecore/lib/actions";
import types from "@appbaseio/reactivecore/lib/utils/types";
import Button, { filters } from "../../styles/Button";

class SelectedFilters extends Component {
	remove = (component) => {
		this.props.setValue(component, null);
	};

	render() {
		const { selectedValues } = this.props;

		return (<div className={filters}>
			{
				Object.keys(selectedValues).map((component, index) => {
					if (selectedValues[component].value) {
						return (<Button key={`${component}-${index}`} onClick={() => this.remove(component)}>
							<span>{selectedValues[component].label}: {selectedValues[component].value}</span>
							<span>&#x2715;</span>
						</Button>);
					}
					return null;
				})
			}
			<Button onClick={this.props.clearValues}>Clear all filters</Button>
		</div>)
	}
}

SelectedFilters.propTypes = {
	selectedValues: types.selectedValues,
	setValue: types.setValue,
	clearValues: types.clearValues
};

const mapStateToProps = state => ({
	selectedValues: state.selectedValues
});

const mapDispatchtoProps = dispatch => ({
	setValue: (component, value) => dispatch(setValue(component, value)),
	clearValues: () => (dispatch(clearValues()))
});

export default connect(mapStateToProps, mapDispatchtoProps)(SelectedFilters);
