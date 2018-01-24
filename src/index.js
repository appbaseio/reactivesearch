import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'emotion-theming';
import { Router, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import createHistory from 'history/createBrowserHistory';	// eslint-disable-line

const history = createHistory({
	basename: process.env.NODE_ENV === 'production' ? '/reactivesearch' : '/',
});

const Loading = () => (
	<div />
);

const HomePage = Loadable({
	loader: () => import('./pages/HomePage'),
	loading: Loading,
});

const HomePageNative = Loadable({
	loader: () => import('./pages/HomePageNative'),
	loading: Loading,
});

ReactDOM.render(
	<ThemeProvider theme={{ fontFamily: 'Rubik', primaryColor: '#FF307A', textLight: '#fefefe' }}>
		<Router history={history}>
			<Fragment>
				<Route exact path="/" component={HomePage} />
				<Route path="/native" component={HomePageNative} />
			</Fragment>
		</Router>
	</ThemeProvider>,
	document.getElementById('root'),
);
