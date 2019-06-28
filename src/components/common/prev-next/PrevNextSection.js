import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { getSidebarFile } from '../sidebar';
import PrevNext from './PrevNext';

const PrevNextSection = ({ sidebar, location, next }) => {
	// TODO: find a more generic way for the `/concepts/` case
	// Cover two cases:
	// 1. `/concepts/` page that walks through the associated sidebar file
	// 2. other pages, where we set a `next` property in frontmatter
	// The following code serializes the data and pass it to a generic component.

	if (sidebar) {
		const sidebarfile = getSidebarFile(sidebar);
		if (!sidebarfile) {
			return null;
		}

		const { groups } = sidebarfile;
		const flatSidebar = [];

		// Get all nested items and link and make a flat array
		_.forEach(groups, section => {
			_.forEach(section.items, items => {
				// Remember the group our items belong to
				items.group = section.group;
				flatSidebar.push(items);
			});
		});

		const currentIndex = _.findIndex(flatSidebar, item => item.link === location.pathname);
		const prev = flatSidebar[currentIndex - 1];
		let next = flatSidebar[currentIndex + 1];

		// Set the last page in "Concepts" to lead to the setup guide
		if (!next && sidebar === `concepts`) {
			next = { group: `Setup`, link: `/setup/`, title: `Install Ghost` };
		}

		return <PrevNext prev={prev} next={next} />;
	}
	if (next && next.title && next.url) {
		// We *must* have at least URL and title
		const next = {
			title: next.title,
			link: next.url,
			description: next.description || ``,
		};

		return <PrevNext next={next} />;
	}
	return null;
};

PrevNextSection.propTypes = {
	sidebar: PropTypes.string,
	location: PropTypes.shape({
		pathname: PropTypes.string.isRequired,
	}).isRequired,
	next: PropTypes.shape({
		title: PropTypes.string,
		url: PropTypes.string,
	}),
};

export default PrevNextSection;
