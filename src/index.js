import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'emotion-theming';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import HomePageNative from './pages/HomePageNative';

ReactDOM.render(
	<ThemeProvider theme={{ fontFamily: 'Rubik', primaryColor: '#FF307A', textLight: '#fefefe' }}>
		<Router>
			<Fragment>
				<Route path="/" component={HomePage} />
				<Route path="/native" component={HomePageNative} />
			</Fragment>
		</Router>
	</ThemeProvider>,
	document.getElementById('root'),
);
