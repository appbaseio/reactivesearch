import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'emotion-theming';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Loadable from 'react-loadable';

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
		<Router basename={process.env.NODE_ENV === 'production' ? '/reactivesearch' : '/'}>
			<Fragment>
				<Route path="/" component={HomePage} />
				<Route path="/native" component={HomePageNative} />
			</Fragment>
		</Router>
	</ThemeProvider>,
	document.getElementById('root'),
);
