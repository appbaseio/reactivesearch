import React, { Component } from "react";
import PropTypes from 'prop-types';

export default class StaticSearch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchValue: ""
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		const value = event.target.value;

		this.setState({
			searchValue: value
		}, () => {
			this.props.changeCallback(this.state.searchValue);
		});
	}

	render() {
		return (
			<div className="rbc-search-container col s12 col-xs-12">
				<input
					type="text"
					className="rbc-input col s12 col-xs-12 form-control"
					value={this.state.searchValue}
					placeholder={this.props.placeholder}
					onChange={this.handleChange}
				/>
			</div>
		);
	}
}

StaticSearch.propTypes = {
	changeCallback: PropTypes.func.isRequired,
	placeholder: PropTypes.string
};
