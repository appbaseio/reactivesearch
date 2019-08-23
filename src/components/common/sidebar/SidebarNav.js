import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import SidebarLink from './SidebarLink';
import SidebarList from './SidebarList';
import getSidebarFile from './getSidebarFile';
import NestedSidebar from './NestedSidebar';

const getLink = url => {
	if (url.startsWith('/docs/reactivesearch/v2')) {
		return '/docs/reactivesearch/v2/overview/quickstart/';
	}
	if (url.startsWith('/docs/reactivesearch/vue')) {
		return '/docs/reactivesearch/vue/overview/quickstart/';
	}
	if (url.startsWith('/docs/reactivesearch/native')) {
		return '/docs/reactivesearch/native/overview/quickstart/';
	}

	return '/docs/reactivesearch/v3/overview/quickstart/';
};

const SidebarNav = ({ sidebar, nestedSidebar, location }) => {
	const sidebarfile = getSidebarFile(sidebar);
	const nestedSidebarFile = nestedSidebar ? getSidebarFile(nestedSidebar) : null;

	if (!sidebar || !sidebarfile || !sidebarfile.groups) {
		return null;
	}

	return (
		<nav className="mt5 mb5 mt10-ns mb0-ns relative" data-cy="sidebar">
			{sidebarfile.groups.map((group, i) => (
				<div key={i} className="mt1">
					{group.items ? (
						group.items.some(item => item.link === location.pathname) ? (
							// Render a sidebar list with children, if any of the nested elements
							// matches our current location, so the group needs to
							<>
								<h4 className="f5 fw5 link pa0 ma0">
									{group.items[0].link ? (
										<Fragment>
											<SidebarLink
												link={group.items[0].link}
												title={group.group}
												linkClasses="link sidebarlink-active blue fw6"
											/>
										</Fragment>
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
						)
					) : (
						<Fragment>
							<SidebarLink
								link={getLink(location.pathname)}
								title={group.group}
								linkClasses={` link ${
									location.pathname.startsWith('/docs/reactivesearch')
										? 'sidebarlink-active blue fw6'
										: 'midgrey hover-blue-l2'
								}`}
							/>
							<NestedSidebar nestedSidebar={nestedSidebarFile} location={location} />
						</Fragment>
					)}
				</div>
			))}
			<div className="sticky-nav">
				<a
					target="_blank"
					rel="noopener noreferrer"
					className="midgrey hover-blue-l2 link"
					href="https://appbase.io"
				>
					Appbase.io
				</a>
				<a
					target="_blank"
					rel="noopener noreferrer"
					className="midgrey hover-blue-l2 link"
					href="https://dashboard.appbase.io"
				>
					Dashboard
				</a>
			</div>
		</nav>
	);
};

SidebarNav.defaultProps = {
	location: { pathname: `/` },
	nestedSidebar: null,
};

SidebarNav.propTypes = {
	sidebar: PropTypes.string.isRequired,
	nestedSidebar: PropTypes.string,
	location: PropTypes.shape({
		pathname: PropTypes.string.isRequired,
	}).isRequired,
};

export default SidebarNav;
