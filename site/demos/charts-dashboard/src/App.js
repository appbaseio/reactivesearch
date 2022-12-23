import { Layout, Menu, Typography } from 'antd';
import { BrowserRouter as Router, Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Explore from './pages/Explore';
import Search from './pages/Search';
import reactivesearchLogo from '../src/reactivesearch-icon.png';

const { Header, Content } = Layout;

const MenuBar = ({ history, location }) => {
	return (
		<Menu
			onClick={({ key }) => history.push(key)}
			mode="horizontal"
			style={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}
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
	<div onClick={() => history.push('/explore')} style={{ display: 'flex', cursor: 'pointer' }}>
		<div style={{ paddingLeft: 10, boxSizing: 'border-box' }}>
			<img style={{ width: 30 }} src={reactivesearchLogo} alt="logo" />
		</div>
		<Typography.Text style={{ background: '#fff', marginLeft: 10 }}>
			Reactivesearch
		</Typography.Text>
	</div>
);
const LogoWithRouter = withRouter(Logo);

function App() {
	return (
		<Router>
			<Layout>
				<Header
					style={{
						padding: 0,
						display: 'flex',
						height: 'max-content',
						background: '#fff',
					}}
				>
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
