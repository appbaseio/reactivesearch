import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

import { Spirit } from '../../styles/spirit-styles';
import Logo from './Logo';
import { SearchModal } from './search';

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
					<Logo theme={`${themeClasses[theme].logoTheme}`} />
				</Link>
			</div>
			{/* navbar-container wrapper element and bottom padding is needed to hide the horizontal scrollbar on smaller screensizes */}
			<div className="navbar-container">
				<div className="dn flex-ns flex-auto items-center overflow-x-auto mr12 mr0-l ml5 ml0-l pb20">
					<Link
						to="/concepts/introduction/"
						className={`${themeClasses[theme].menuItem} nowrap f8 pa3 mr1 mr3-l nl3`}
					>
						Concepts
					</Link>
					<Link
						to="/javascript/quickstart"
						className={`${themeClasses[theme].menuItem} nowrap f8 pa3 mr1 mr3-l`}
					>
						Javascript
					</Link>
					<Link
						to="/rest/quickstart"
						className={`${themeClasses[theme].menuItem} nowrap f8 pa3 mr1 mr3-l`}
					>
						REST
					</Link>
					<Link
						to="/examples/js"
						className={`${themeClasses[theme].menuItem} nowrap f8 pa3 mr1 mr3-l`}
					>
						Examples
					</Link>
					{/* <Link
						to="/api/"
						className={`${themeClasses[theme].menuItem} nowrap f8 pa3 mr1 mr3-l`}
					>
						API Reference
					</Link> */}
					{/* <Link
						to="/faq/"
						className={`${themeClasses[theme].menuItem} nowrap f8 pa3 mr1 mr3-l`}
					>
						FAQ
					</Link> */}
				</div>
			</div>
			<div className="relative pl3">
				<SearchModal theme={themeClasses[theme]} />
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
