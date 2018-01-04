import React, { Component } from 'react';

import SearchFilters from './SearchFilters';

import Navbar, { title } from '../styles/Navbar';
import { ToggleButton } from '../styles/Button';

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
		};
	}

	toggleVisibility = () => {
		const visible = !this.state.visible;
		this.setState({
			visible,
		});
	}

	render() {
		return (
			<Navbar full={this.state.visible}>
				<div className={title}>GitXplore</div>
				<ToggleButton onClick={this.toggleVisibility}>Toggle Filters</ToggleButton>
				<SearchFilters {...this.props} visible={this.state.visible} />
			</Navbar>
		);
	}
}

export default Header;
