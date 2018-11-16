import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import ToolsPageNative from './pages/native/Tools';
import LearnPageNative from './pages/native/Learn';
import createHistory from 'history/createBrowserHistory'; // eslint-disable-line

const Loading = () => <div />;

const HomePage = Loadable({
	loader: () => import('./pages/web/Home'),
	loading: Loading,
});
const ToolsPage = Loadable({
	loader: () => import('./pages/web/Tools'),
	loading: Loading,
});
const LearnPage = Loadable({
	loader: () => import('./pages/web/Learn'),
	loading: Loading,
});
const DemoPage = Loadable({
	loader: () => import('./pages/web/Demo'),
	loading: Loading,
});

const HomePageNative = Loadable({
	loader: () => import('./pages/native/Home'),
	loading: Loading,
});
// const DemoPageNative = Loadable({
// 	loader: () => import('./pages/native/Demo'),
// 	loading: Loading,
// });

const history = createHistory({
	basename: process.env.NODE_ENV === 'production' ? '/reactivesearch' : '/',
});

ReactDOM.render(
	<Router history={history}>
		<Switch>
			<Route exact path="/" component={HomePage} />
			<Route exact path="/tools" component={ToolsPage} />
			<Route exact path="/learn" component={LearnPage} />
			<Route exact path="/demo" component={DemoPage} />
			<Route exact path="/native/tools" component={ToolsPageNative} />
			<Route exact path="/native/learn" component={LearnPageNative} />
			{/* <Route exact path="/native/demo" component={DemoPageNative} /> */}
			<Route path="/native" component={HomePageNative} />
			<Route path="*" component={HomePage} />
		</Switch>
	</Router>,
	document.getElementById('root'),
);
