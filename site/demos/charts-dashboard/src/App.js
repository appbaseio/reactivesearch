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
				{ key: '/', label: 'Explore' },
				{ key: '/search', label: 'Search' },
			]}
			defaultSelectedKeys={[location.pathname]}
			selectedKeys={[location.pathname]}
		/>
	);
};
const MenuBarWithRouter = withRouter(MenuBar);

function App({ history }) {
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
					<div style={{ paddingLeft: 10, boxSizing: 'border-box' }}>
						<img style={{ width: 30 }} src={reactivesearchLogo} alt="logo" />
					</div>
					<Typography.Text style={{ background: '#fff', marginLeft: 10 }}>
						Reactivesearch
					</Typography.Text>
					<MenuBarWithRouter />
				</Header>
				<Layout>
					<Content>
						<Switch>
							<Route exact path="/">
								<Explore />
							</Route>
							<Route path="/search">
								<Search />
							</Route>
							<Route path="/">
								<Redirect to="/" />
							</Route>
						</Switch>
					</Content>
				</Layout>
			</Layout>
		</Router>
	);
}

export default App;
