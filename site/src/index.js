import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import ToolsPageNative from './pages/native/Tools';
import LearnPageNative from './pages/native/QuickStart';
import ToolsPageVue from './pages/vue/Tools';
import LearnPageVue from './pages/vue/QuickStart';
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
	loader: () => import('./pages/web/QuickStart'),
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
const HomePageVue = Loadable({
	loader: () => import('./pages/vue/Home'),
	loading: Loading,
});
// const DemoPageNative = Loadable({
// 	loader: () => import('./pages/native/Demo'),
// 	loading: Loading,
// });

const history = createHistory({
	basename: '/reactivesearch',
});

ReactDOM.render(
	<Router history={history}>
		<Switch>
			<Route exact path="/" component={HomePage} />
			<Route exact path="/tools" component={ToolsPage} />
			<Route exact path="/reactivesearch/tools" component={ToolsPage} />
			<Route exact path="/quickstart" component={LearnPage} />
			<Route exact path="/reactivesearch/quickstart" component={LearnPage} />
			<Route exact path="/demo" component={DemoPage} />
			<Route exact path="/reactivesearch/demo" component={DemoPage} />
			<Route exact path="/native/tools" component={ToolsPageNative} />
			<Route exact path="/reactivesearch/native/tools" component={ToolsPageNative} />
			<Route exact path="/native/quickstart" component={LearnPageNative} />
			<Route exact path="/reactivesearch/native/quickstart" component={LearnPageNative} />
			<Route path="/native" component={HomePageNative} />
			<Route path="/reactivesearch/native" component={HomePageNative} />
			<Route exact path="/vue/tools" component={ToolsPageVue} />
			<Route exact path="/reactivesearch/vue/tools" component={ToolsPageVue} />
			<Route exact path="/vue/quickstart" component={LearnPageVue} />
			<Route exact path="/reactivesearch/vue/quickstart" component={LearnPageVue} />
			<Route path="/vue" component={HomePageVue} />
			<Route path="/reactivesearch/vue" component={HomePageVue} />
			<Route path="*" component={HomePage} />
		</Switch>
	</Router>,
	document.getElementById('root'),
);
