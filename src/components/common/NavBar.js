import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

import { Spirit } from '../../styles/spirit-styles';
import Logo from './Logo';
import DropdownLink from './DropdownLink';
import Icon from './Icon';
import Search from './search/HomeSearch';

const NavBar = ({ theme }) => {
	// Theme definitions
	const themeClasses = {
		dark: {
			menuItem: `middarkgrey-l1 link hover-blue nowrap`,
			logoTheme: `light`,
			docsTitleClass: `blue`,
			searchBox: `bg-darkgrey-searchbar middarkgrey dark-placeholder`,
			icon: `fill-midlightgrey`,
		},
		light: {
			menuItem: Spirit.link.white,
			logoTheme: `dark`,
			docsTitleClass: `white`,
			searchBox: `bg-white-10 white white-placeholder`,
			icon: `fill-white`,
		},
	};

	return (
		<nav
			className={`${
				Spirit.page.xl
			} flex flex-auto flex-nowrap items-center justify-between pt2 pb2`}
			data-cy="header-navigation"
		>
			<div className="flex items-center pt3 pb3 nudge-bottom--2 w-sidebar-l pr8">
				<Link to="/" className="nudge-top--3">
					<Logo theme="light" />
				</Link>
			</div>
			{/* navbar-container wrapper element and bottom padding is needed to hide the horizontal scrollbar on smaller screensizes */}
			<div className="navbar-container">
				<div className="dn flex-ns flex-auto items-center overflow-x-auto mr12 mr0-l ml5 ml0-l pb20">
					<DropdownLink>
						<DropdownLink.Item>
							{value => (
								<React.Fragment>
									<span
										className={`${
											themeClasses[theme].menuItem
										} nowrap f8 pa3 mr1 mr3-l nl3 ${
											value.selectedKey === 'guides' ? 'fw6 darkgrey' : 'fw3'
										}`}
										onClick={() => {
											value.selectedKey === 'guides' ||
												value.handleKey('guides');
										}}
									>
										Guides
									</span>

									{value.selectedKey === 'guides' ? (
										<div className="dropdown-content">
											<div
												className={`${
													Spirit.page.xl
												} pt2 pb2 grid-dropdown grid-dropdown-4`}
											>
												<div>
													<h2 className="f2 lh-h5 lh-h4-l fw6 ma0 pa0  mt0 mt2-ns darkgrey">
														Guides
													</h2>
													<p className="f5 lh-h5 lh-h4-l fw4 ma0 pa0 mt0 mt2-ns middarkgrey mb2">
														Discover how to integrate and adapt
														Appbaseio's technology into popular
														frameworks and platforms.
													</p>
												</div>
												<div>
													{/* <h2 className="f3 lh-h5 lh-h4-l fw6 ma0 pa0  mt0 mt2-ns middarkgrey mb2">
														Clients
													</h2> */}
													<Link
														to="/concepts/introduction/"
														className={`${
															themeClasses[theme].menuItem
														} nowrap f5 pa3 mr1 mr3-l nl3 dropdown-link`}
													>
														<Icon
															name="check"
															className="dropdown-content-icon mr2"
														/>
														Getting Started
													</Link>
													<Link
														to="/concepts/introduction/"
														className={`${
															themeClasses[theme].menuItem
														} nowrap f5 pa3 mr1 mr3-l nl3 dropdown-link`}
													>
														<Icon
															name="sync"
															className="dropdown-content-icon mr2"
														/>
														Importing and Managing Data
													</Link>
												</div>
												<div>
													<Link
														to="/concepts/introduction/"
														className={`${
															themeClasses[theme].menuItem
														} nowrap f5 pa3 mr1 mr3-l nl3 dropdown-link`}
													>
														<Icon
															name="search"
															className="dropdown-content-icon mr2"
														/>
														Search Relevancy
													</Link>
													<Link
														to="/concepts/introduction/"
														className={`${
															themeClasses[theme].menuItem
														} nowrap f5 pa3 mr1 mr3-l nl3 dropdown-link`}
													>
														<Icon
															name="lotus"
															className="dropdown-content-icon mr2"
														/>
														Building UI
													</Link>
												</div>
												<div>
													<Link
														to="/concepts/introduction/"
														className={`${
															themeClasses[theme].menuItem
														} nowrap f5 pa3 mr1 mr3-l nl3 dropdown-link`}
													>
														<Icon
															name="terminal"
															className="dropdown-content-icon mr2"
														/>
														Actionable Analytics
													</Link>
													<Link
														to="/concepts/introduction/"
														className={`${
															themeClasses[theme].menuItem
														} nowrap f5 pa3 mr1 mr3-l nl3 dropdown-link`}
													>
														<Icon
															name="shield"
															className="dropdown-content-icon mr2"
														/>
														Security
													</Link>
												</div>
											</div>
										</div>
									) : null}
								</React.Fragment>
							)}
						</DropdownLink.Item>
						<DropdownLink.Item>
							{value => (
								<React.Fragment>
									<span
										className={`${
											themeClasses[theme].menuItem
										} nowrap f8 pa3 mr1 mr3-l nl3 ${
											value.selectedKey === 'api' ? 'fw6 darkgrey' : 'fw3'
										}`}
										onClick={() => {
											value.selectedKey === 'api' || value.handleKey('api');
										}}
									>
										API Reference
									</span>

									{value.selectedKey === 'api' ? (
										<div className="dropdown-content">
											<div
												className={`${
													Spirit.page.xl
												} pt2 pb2 grid-dropdown grid-dropdown-4`}
											>
												<div>
													<h2 className="f2 lh-h5 lh-h4-l fw6 ma0 pa0  mt0 mt2-ns darkgrey">
														API Reference
													</h2>
													<p className="f5 lh-h5 lh-h4-l fw4 ma0 pa0 mt0 mt2-ns middarkgrey mb2">
														Discover how to integrate and adapt
														Appbaseio's technology into popular
														frameworks and platforms.
													</p>
												</div>
												<div>
													<h2 className="f4 lh-h5 lh-h4-l fw6 ma0 pa0  mt0 mt2-ns darkgrey mb2">
														Reactivesearch
													</h2>
													<Link
														to="/concepts/introduction/"
														className={`${
															themeClasses[theme].menuItem
														} nowrap f5 pa3 mr1 mr3-l nl3 dropdown-link`}
													>
														<Icon
															name="repo"
															className="dropdown-content-icon mr2"
														/>
														React
													</Link>
													<Link
														to="/concepts/introduction/"
														className={`${
															themeClasses[theme].menuItem
														} nowrap f5 pa3 mr1 mr3-l nl3 dropdown-link`}
													>
														<Icon
															name="sdks"
															className="dropdown-content-icon mr2"
														/>
														Vue
													</Link>
													<Link
														to="/concepts/introduction/"
														className={`${
															themeClasses[theme].menuItem
														} nowrap f5 pa3 mr1 mr3-l nl3 dropdown-link`}
													>
														<Icon
															name="signal-tower"
															className="dropdown-content-icon mr2"
														/>
														Native
													</Link>
												</div>
												<div>
													<h2 className="f4 lh-h5 lh-h4-l fw6 ma0 pa0  mt0 mt2-ns darkgrey mb2">
														Clients
													</h2>
													<Link
														to="/concepts/introduction/"
														className={`${
															themeClasses[theme].menuItem
														} nowrap f5 pa3 mr1 mr3-l nl3 dropdown-link`}
													>
														<Icon
															name="javascript-logo"
															className="dropdown-content-icon mr2"
														/>
														Javascript
													</Link>
													<Link
														to="/concepts/introduction/"
														className={`${
															themeClasses[theme].menuItem
														} nowrap f5 pa3 mr1 mr3-l nl3 dropdown-link`}
													>
														<Icon
															name="python-logo"
															className="dropdown-content-icon mr2"
														/>
														Python
													</Link>
													<Link
														to="/concepts/introduction/"
														className={`${
															themeClasses[theme].menuItem
														} nowrap f5 pa3 mr1 mr3-l nl3 dropdown-link`}
													>
														<Icon
															name="server"
															className="dropdown-content-icon mr2"
														/>
														Swift
													</Link>
													<Link
														to="/concepts/introduction/"
														className={`${
															themeClasses[theme].menuItem
														} nowrap f5 pa3 mr1 mr3-l nl3 dropdown-link`}
													>
														<Icon
															name="android-logo"
															className="dropdown-content-icon mr2"
														/>
														Android
													</Link>
												</div>
												<div>
													<h2 className="f4 lh-h5 lh-h4-l fw6 ma0 pa0  mt0 mt2-ns darkgrey mb2">
														Examples
													</h2>
													<Link
														to="/concepts/introduction/"
														className={`${
															themeClasses[theme].menuItem
														} nowrap f5 pa3 mr1 mr3-l nl3 dropdown-link`}
													>
														<Icon
															name="terminal"
															className="dropdown-content-icon mr2"
														/>
														Swift
													</Link>
													<Link
														to="/concepts/introduction/"
														className={`${
															themeClasses[theme].menuItem
														} nowrap f5 pa3 mr1 mr3-l nl3 dropdown-link`}
													>
														<Icon
															name="shield"
															className="dropdown-content-icon mr2"
														/>
														Android
													</Link>
												</div>
											</div>
										</div>
									) : null}
								</React.Fragment>
							)}
						</DropdownLink.Item>
					</DropdownLink>
				</div>
			</div>
			<div className="relative home-search-container">
				<Search />
			</div>
		</nav>
	);
};

NavBar.defaultProps = {
	theme: `dark`,
};

NavBar.propTypes = {
	theme: PropTypes.oneOf([`dark`, `light`]),
};

export default NavBar;
