import React from 'react';
import PropTypes from 'prop-types';

import SidebarLink from './SidebarLink';

const SidebarList = ({ items, location, compact }) => {
	const linkClasses = `midgrey fw4 hover-blue-l2`;
	const activeLinkClasses = item => item.link === location.pathname ? `sidebarlink-active blue fw6` : `blue fw6`;

	return (
		<ul className={`relative sidebar-list ma0 pa0 list pl6 mt1 ${compact ? 'mb1' : 'mb5'}`}>
			{items.map((item, j) => (
				<React.Fragment>
					<li key={j}>
						<SidebarLink
							link={item.link}
							title={item.title}
							linkClasses={
								item.link === location.pathname ||
								location.pathname.startsWith(item.link)
									? activeLinkClasses(item)
									: linkClasses
							}
						/>
					</li>
					{item.items ? (
						<React.Fragment>
							{item.link === location.pathname ||
							location.pathname.startsWith(item.link) ? (
								<SidebarList items={item.items} compact location={location} />
							) : null}
						</React.Fragment>
					) : null}
				</React.Fragment>
			))}
		</ul>
	);
};

SidebarList.defaultProps = {
	compact: false,
};

SidebarList.propTypes = {
	compact: PropTypes.bool,
	items: PropTypes.arrayOf(
		PropTypes.shape({
			title: PropTypes.string.isRequired,
			link: PropTypes.string.isRequired,
		}).isRequired,
	).isRequired,
	location: PropTypes.shape({
		pathname: PropTypes.string.isRequired,
	}).isRequired,
};

export default SidebarList;
