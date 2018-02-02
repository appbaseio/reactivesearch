import React, { Component } from 'react';

import types from '@appbaseio/reactivecore/lib/utils/types';

class ThemeProvider extends Component {
	getChildContext() {
		// the term 'theming' is used here to avoid clashing with 'theme'
		// prop in native-base theming solution
		const { theming } = this.props;
		return { theming };
	}

	render() {
		return React.Children.only(this.props.children);
	}
}

ThemeProvider.propTypes = {
	children: types.children,
	theming: types.style,
};

ThemeProvider.childContextTypes = {
	theming: types.style,
};

export default ThemeProvider;
