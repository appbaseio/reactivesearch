import React from 'react';
import { Link } from 'gatsby';
import Search from './search/HomeSearch';
import Icon from './Icon';

const themeClasses = {
	dark: {
		menuItem: `middarkgrey-l1 link hover-blue nowrap`,
		logoTheme: `light`,
		docsTitleClass: `blue`,
		searchBox: `bg-darkgrey-searchbar middarkgrey dark-placeholder`,
		icon: `fill-midlightgrey`,
	},
	light: {
		logoTheme: `dark`,
		docsTitleClass: `white`,
		searchBox: `bg-white-10 white white-placeholder`,
		icon: `fill-white`,
	},
};

class MobileNav extends React.Component {
	state = {
		open: false,
	};

	handleSidebar = () => {
		this.setState(prevState => ({
			open: !prevState.open,
		}));
	};

	render() {
		const { open } = this.state;
		return (
			<div className="mobile-nav">
				<div onClick={this.handleSidebar}>
					<Icon name="hamburger" className="hamburger" />
				</div>
				<div className={`mobile-sidebar pa5 ${open ? 'open' : ''}`}>
					<div className="mobile-nav-container">
						<div className="relative home-search-container mb5">
							<Search />
						</div>
						<h2 className="f4 mb2 lh-h5 lh-h4-l fw6 ma0 pa0  mt0 mt2-ns darkgrey">
							Guides
						</h2>
						<p className="f5 lh-h5 lh-h4-l fw4 ma0 pa0 mt0 mt2-ns middarkgrey mb2">
							Discover how to integrate and adapt Appbaseio's technology into popular
							frameworks and platforms.
						</p>
						<div className="mt5 mb3">
							<div className="mobile-links-container">
								<Link
									to="/docs/gettingstarted/QuickStart/"
									className={`${
										themeClasses.dark.menuItem
									} nowrap f5 pa3 mr3 mr3-l nl3 dropdown-link`}
								>
									<Icon
										name="gettingStarted"
										className="dropdown-content-icon mr2"
									/>
									Getting Started
								</Link>
								<Link
									to="/docs/data/model"
									className={`${
										themeClasses.dark.menuItem
									} nowrap f5 pa3 mr3 mr3-l nl3 dropdown-link`}
								>
									<Icon name="import" className="dropdown-content-icon mr2" />
									Importing and Managing Data
								</Link>
								<Link
									to="/docs/search/Preview/"
									className={`${
										themeClasses.dark.menuItem
									} nowrap f5 pa3 mr3 mr3-l nl3 dropdown-link`}
								>
									<Icon name="search" className="dropdown-content-icon mr2" />
									Search Relevancy
								</Link>
								<Link
									to="/docs/reactivesearch/v3/overview/quickstart/"
									className={`${
										themeClasses.dark.menuItem
									} nowrap f5 pa3 mr3 mr3-l nl3 dropdown-link`}
								>
									<Icon name="buildingUI" className="dropdown-content-icon mr2" />
									Building UI
								</Link>
								<Link
									to="/docs/analytics/Overview"
									className={`${
										themeClasses.dark.menuItem
									} nowrap f5 pa3 mr3 mr3-l nl3 dropdown-link`}
								>
									<Icon name="analytics" className="dropdown-content-icon mr2" />
									Actionable Analytics
								</Link>
								<Link
									to="/docs/security/Credentials"
									className={`${
										themeClasses.dark.menuItem
									} nowrap f5 pa3 mr3 mr3-l nl3 dropdown-link`}
								>
									<Icon name="security" className="dropdown-content-icon mr2" />
									Security
								</Link>
							</div>
						</div>
						<h2 className="f4 mb2 lh-h5 lh-h4-l fw6 ma0 pa0  mt0 mt2-ns darkgrey">
							API Reference
						</h2>
						<p className="f5 lh-h5 lh-h4-l fw4 ma0 pa0 mt0 mt2-ns middarkgrey mb2">
							Discover how to integrate and adapt Appbaseio's technology into popular
							frameworks and platforms.
						</p>
						<div className="mt5">
							<h2 className="f5 lh-h5 lh-h4-l fw6 ma0 pa0 mt3 grey">
								ReactiveSearch
							</h2>
							<div className="mobile-links-container">
								<Link
									to="/docs/reactivesearch/v3/overview/quickstart/"
									className={`${
										themeClasses.dark.menuItem
									} nowrap f5 pa3 mr3 mr3-l nl3 dropdown-link`}
								>
									<img
										className="dropdown-content-icon mr2"
										src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K"
										alt="React"
										style={{
											background: 'transparent',
											filter: 'grayscale(1) saturate(1) hue-rotate(180deg)',
										}}
									/>
									React
								</Link>
								<Link
									to="/docs/reactivesearch/vue/overview/QuickStart/"
									className={`${
										themeClasses.dark.menuItem
									} nowrap f5 pa3 mr3 mr3-l nl3 dropdown-link`}
								>
									<Icon name="vue-bw" className="dropdown-content-icon mr2" />
									Vue
								</Link>
								<Link
									to="/docs/reactivesearch/native/overview/QuickStart/"
									className={`${
										themeClasses.dark.menuItem
									} nowrap f5 pa3 mr3 mr3-l nl3 dropdown-link`}
								>
									<img
										className="dropdown-content-icon mr2"
										src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K"
										alt="React"
										style={{
											background: 'transparent',
											filter: 'grayscale(1) saturate(1) hue-rotate(180deg)',
										}}
									/>
									Native
								</Link>
							</div>
						</div>
						<div className="mt5">
							<h2 className="f5 lh-h5 lh-h4-l fw6 ma0 pa0 mt3 grey">Clients</h2>
							<div className="mobile-links-container">
								<Link
									to="/api/javascript/quickstart/"
									className={`${
										themeClasses.dark.menuItem
									} nowrap f5 pa3 mr3 mr3-l nl3 dropdown-link`}
								>
									<Icon name="js-bw" className="dropdown-content-icon mr2" />
									Javascript
								</Link>
								<Link
									to="/api/go/quickstart/"
									className={`${
										themeClasses.dark.menuItem
									} nowrap f5 pa3 mr3 mr3-l nl3 dropdown-link`}
								>
									<Icon name="go-bw" className="dropdown-content-icon mr2" />
									Golang
								</Link>
								<Link
									to="/api/rest/quickstart/"
									className={`${
										themeClasses.dark.menuItem
									} nowrap f5 pa3 mr3 mr3-l nl3 dropdown-link`}
								>
									<Icon name="rest" className="dropdown-content-icon mr2" />
									REST
								</Link>
							</div>
						</div>
						<div className="mt5">
							<h2 className="f5 lh-h5 lh-h4-l fw6 ma0 pa0 mt3 grey">Examples</h2>
							<div className="mobile-links-container">
								<Link
									to="/api/examples/python/"
									className={`${
										themeClasses.dark.menuItem
									} nowrap f5 pa3 mr3 mr3-l nl3 dropdown-link`}
								>
									<Icon name="python-bw" className="dropdown-content-icon mr2" />
									Python
								</Link>
								<Link
									to="/api/examples/js/"
									className={`${
										themeClasses.dark.menuItem
									} nowrap f5 pa3 mr3 mr3-l nl3 dropdown-link`}
								>
									<Icon name="js-bw" className="dropdown-content-icon mr2" />
									Javascript
								</Link>
								<Link
									to="/api/examples/go/"
									className={`${
										themeClasses.dark.menuItem
									} nowrap f5 pa3 mr3 mr3-l nl3 dropdown-link`}
								>
									<Icon name="go-bw" className="dropdown-content-icon mr2" />
									Go
								</Link>
								<Link
									to="/api/examples/php/"
									className={`${
										themeClasses.dark.menuItem
									} nowrap f5 pa3 mr3 mr3-l nl3 dropdown-link`}
								>
									<Icon name="php-bw" className="dropdown-content-icon mr2" />
									PHP
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default MobileNav;
