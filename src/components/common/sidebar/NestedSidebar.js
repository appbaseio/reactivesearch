import React, { Fragment } from 'react';
import Dropdown from 'react-dropdown';
import PropTypes from 'prop-types';

import SidebarLink from './SidebarLink';
import SidebarList from './SidebarList';
import Icon from '../Icon';

const NestedSidebar = ({ nestedSidebar, location }) => {
	if (!nestedSidebar || !nestedSidebar.groups) {
		return null;
	}

	const switchDocs = value => {
		if (value.value === 'Native') {
			window.location.href = `${
				window.location.origin
			}/docs/reactivesearch/native/overview/QuickStart`;
		} else if (value.value === 'Vue') {
			window.location.href = `${
				window.location.origin
			}/docs/reactivesearch/vue/overview/QuickStart`;
		} else if (value.value === 'React - v3') {
			window.location.href = `${
				window.location.origin
			}/docs/reactivesearch/v3/overview/quickstart`;
		} else if (value.value === 'React - v2') {
			window.location.href = `${
				window.location.origin
			}/docs/reactivesearch/v2/overview/QuickStart`;
		} else if (value.value === 'SearchBase') {
			window.location.href = `${window.location.origin}/docs/reactivesearch/searchbase/overview/QuickStart`;
		}
	};

	const getValue = () => {
		if (location.pathname.startsWith('/docs/reactivesearch/v2')) {
			return 'React - v2';
		}
		if (location.pathname.startsWith('/docs/reactivesearch/vue')) {
			return 'Vue';
		}
		if (location.pathname.startsWith('/docs/reactivesearch/native')) {
			return 'Native';
		}
		if (location.pathname.startsWith('/docs/reactivesearch/searchbase')) {
			return 'SearchBase';
		}

		return 'React - v3';
	};

	return (
		<Fragment>
			<Dropdown
				options={['React - v3', 'React - v2', 'Native', 'Vue', 'SearchBase']}
				value={getValue()}
				className="version-switcher shadow-3 br2"
				menuClassName="br2 shadow-3"
				arrowOpen={<Icon className="inline middarkgrey w2" name="arrow-up-small" />}
				arrowClosed={<Icon className="inline middarkgrey w2" name="arrow-down-small" />}
				onChange={switchDocs}
			/>
			<nav className="pl5 relative" data-cy="sidebar">
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
	nestedSidebar: PropTypes.object.isRequired,
	location: PropTypes.shape({
		pathname: PropTypes.string.isRequired,
	}).isRequired,
};

export default NestedSidebar;
