import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'emotion-theming';
import { Router, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';	// eslint-disable-line

import HomePage from './pages/HomePage';
import HomePageNative from './pages/HomePageNative';

const history = createHistory({
	basename: process.env.NODE_ENV === 'production' ? '/reactivesearch' : '/',
});

ReactDOM.render(
	<ThemeProvider theme={{ fontFamily: 'Rubik', primaryColor: '#FF307A', textLight: '#fefefe' }}>
		<Router history={history}>
			<Switch>
				<Route exact path="/" component={HomePage} />
				<Route path="/native" component={HomePageNative} />
				<Route path="*" component={HomePage} />
			</Switch>
		</Router>
	</ThemeProvider>,
	document.getElementById('root'),
);
