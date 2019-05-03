import React from 'react';
import PropTypes from 'prop-types';

import SidebarLink from './SidebarLink';
import SidebarList from './SidebarList';
import getSidebarFile from './getSidebarFile';

const SidebarNav = ({ sidebar, location }) => {
	const sidebarfile = getSidebarFile(sidebar);

	if (!sidebar || !sidebarfile || !sidebarfile.groups) {
		return null;
	}

	return (
		<nav className="mt5 mb5 mt10-ns mb0-ns relative" data-cy="sidebar">
			{sidebarfile.groups.map((group, i) => (
				<div key={i} className="mt1">
					{group.items.some(item => item.link === location.pathname) ? (
						// Render a sidebar list with children, if any of the nested elements
						// matches our current location, so the group needs to
						<>
							<h4 className="f5 fw5 link pa0 ma0">
								{group.items[0].link ? (
									<SidebarLink
										link={group.items[0].link}
										title={group.group}
										linkClasses="link sidebarlink-active blue fw6"
									/>
								) : (
									group.group
								)}
							</h4>

							{group.items.length > 1 ? (
								<SidebarList key={i} items={group.items} location={location} />
							) : null}
						</>
					) : (
						<h4 className="f5 fw5 link pa0 ma0">
							{group.items[0].link ? (
								<SidebarLink
									link={group.items[0].link}
									title={group.group}
									linkClasses="midgrey hover-blue-l2 link"
								/>
							) : (
								group.group
							)}
						</h4>
					)}
				</div>
			))}
		</nav>
	);
};

SidebarNav.defaultProps = {
	location: { pathname: `/` },
};

SidebarNav.propTypes = {
	sidebar: PropTypes.string.isRequired,
	location: PropTypes.shape({
		pathname: PropTypes.string.isRequired,
	}).isRequired,
};

export default SidebarNav;
