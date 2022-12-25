import { Layout, Menu, Typography } from 'antd';
import { BrowserRouter as Router, Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Explore from './pages/Explore';
import Search from './pages/Search';
import reactivesearchLogo from '../src/reactivesearch-icon.png';

import './App.css';

const { Header, Content } = Layout;

const MenuBar = ({ history, location }) => {
	return (
		<Menu
			onClick={({ key }) => history.push(key)}
			mode="horizontal"
			className="headerMenu"
			items={[
				{ key: '/explore', label: 'Explore' },
				{ key: '/search', label: 'Search' },
			]}
			defaultSelectedKeys={[location.pathname]}
			selectedKeys={[location.pathname]}
		/>
	);
};
const MenuBarWithRouter = withRouter(MenuBar);

const Logo = ({ history }) => (
	<div onClick={() => history.push('/explore')} className="logo">
		<div className="logo__container">
			<img className="logo__img" src={reactivesearchLogo} alt="logo" />
		</div>
		<Typography.Text className="logo__text">Reactivesearch</Typography.Text>
	</div>
);
const LogoWithRouter = withRouter(Logo);

function App() {
	return (
		<Router>
			<Layout>
				<Header className="header">
					<LogoWithRouter />
					<MenuBarWithRouter />
				</Header>
				<Layout>
					<Content>
						<Switch>
							<Route exact path="/explore">
								<Explore />
							</Route>
							<Route path="/search">
								<Search />
							</Route>
							<Route path="/">
								<Redirect to="/explore" />
							</Route>
						</Switch>
					</Content>
				</Layout>
			</Layout>
		</Router>
	);
}

export default App;
