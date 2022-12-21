import { Layout, Menu } from 'antd';
import { BrowserRouter as Router, Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Explore from './pages/Explore';
import Search from './pages/Search';
import reactivesearchLogo from '../src/reactivesearch-icon.png'

const { Header, Content, Footer } = Layout;

const MenuBar = ({history}) => {
  return <Menu
			onClick={({key}) => history.push(key)}
			mode="horizontal"
			items={[
				{ key: '/', label: 'Explore' },
				{ key: '/search', label: 'Search' },
			]}
			style={{flex: 1}}
		/>
}
const MenuBarWithRouter = withRouter(MenuBar)

function App({history}) {

	return (
		<Router>
			<Layout>
				<Header style={{ padding: 0, display: 'flex', height: "max-content" }}>
					<div style={{ paddingLeft: 10, boxSizing: 'border-box', background: '#fff' }}>
						<img style={{ width: 30 }} src={reactivesearchLogo} alt="logo" />
					</div>
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
