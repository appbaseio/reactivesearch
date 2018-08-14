import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'emotion-theming';
import { Router, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import ToolsPageNative from './pages/native/Tools';
import LearnPageNative from './pages/native/Learn';
import createHistory from 'history/createBrowserHistory'; // eslint-disable-line

const Loading = () => <div />;

const HomePage = Loadable({
	loader: () =>
		import('./pages/web/home'),
	loading: Loading,
});
const ToolsPage = Loadable({
	loader: () =>
		import('./pages/web/tools'),
	loading: Loading,
});
const LearnPage = Loadable({
	loader: () =>
		import('./pages/web/learn'),
	loading: Loading,
});

const HomePageNative = Loadable({
	loader: () =>
		import('./pages/native/home'),
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
					exact
					path="/tools"
					component={
						ToolsPage
					}
				/>
				<Route
					exact
					path="/learn"
					component={
						LearnPage
					}
				/>
				<Route
					exact
					path="/native/tools"
					component={
						ToolsPageNative
					}
				/>
				<Route
					exact
					path="/native/learn"
					component={
						LearnPageNative
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
