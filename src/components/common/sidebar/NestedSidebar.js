import React, { Fragment } from 'react';
import Dropdown from 'react-dropdown';
import PropTypes from 'prop-types';

import SidebarLink from './SidebarLink';
import SidebarList from './SidebarList';

const NestedSidebar = ({ nestedSidebar, location }) => {
	if (!nestedSidebar || !nestedSidebar.groups) {
		return null;
	}

	const switchDocs = value => {
		if (location.pathname.startsWith('/docs/ui/reactivesearch/v3')) {
			if (value.value === 'v0.12 - Native') {
				window.location.href = `${window.location.origin}/docs/ui/reactivesearch/native`;
			} else if (value.value === 'v1 - Vue') {
				window.location.href = `${window.location.origin}/docs/ui/reactivesearch/vue`;
			} else if (value.value === 'v3 - Web') {
				window.location.href = `${
					window.location.origin
				}/docs/ui/reactivesearch/v3/overview/quickstart`;
			} else if (value.value === 'v2 - Web') {
				window.location.href = `${
					window.location.origin
				}/docs/ui/reactivesearch/v2/overview/QuickStart`;
			}
		}
	};

	const getValue = () => {
		if (location.pathname.startsWith('/docs/ui/reactivesearch/v2')) {
			return 'v2 - Web';
		}
		if (location.pathname.startsWith('/docs/ui/reactivesearch/vue')) {
			return 'v1 - Vue';
		}
		if (location.pathname.startsWith('/docs/ui/reactivesearch/native')) {
			return 'v0.12 - Native';
		}

		return 'v3 - Web';
	};

	return (
		<Fragment>
			<Dropdown
				options={['v3 - Web', 'v2 - Web', 'v0.10 - Native', 'v1 - Vue']}
				value={getValue()}
				onChange={switchDocs}
			/>
			<nav className="pl3 relative" data-cy="sidebar">
				{nestedSidebar.groups.map((group, i) => (
					<div key={i} className="mt1">
						{group.items.some(item => item.link === location.pathname) ? (
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
						)}
					</div>
				))}
			</nav>
		</Fragment>
	);
};

NestedSidebar.propTypes = {
	nestedSidebar: PropTypes.string.isRequired,
	location: PropTypes.shape({
		pathname: PropTypes.string.isRequired,
	}).isRequired,
};

export default NestedSidebar;
