import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'emotion-theming';
import { Router, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import createHistory from 'history/createBrowserHistory'; // eslint-disable-line

const Loading = () => <div />;

const HomePage = Loadable({
	loader: () =>
		import('./pages/HomePage'),
	loading: Loading,
});

const HomePageNative = Loadable({
	loader: () =>
		import('./pages/HomePageNative'),
	loading: Loading,
});

const history = createHistory({
	basename:
		process
			.env
			.NODE_ENV
		=== 'production'
			? '/reactivesearch'
			: '/',
});

ReactDOM.render(
	<ThemeProvider
		theme={{
			fontFamily:
				'Rubik',
			primaryColor:
				'#7107D8',
			secondaryColor:
				'#FF2A6F',
			textLight:
				'#fefefe',
		}}
	>
		<Router
			history={
				history
			}
		>
			<Switch >
				<Route
					exact
					path="/"
					component={
						HomePage
					}
				/>
				<Route
					path="/native"
					component={
						HomePageNative
					}
				/>
				<Route
					path="*"
					component={
						HomePage
					}
				/>
			</Switch>
		</Router>
	</ThemeProvider>,
	document.getElementById('root'),
);
