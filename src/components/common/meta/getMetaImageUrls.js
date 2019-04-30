import PropTypes from 'prop-types';
import url from 'url';

// TODO: this should be available as global var without the need to query
// the siteMetadata.
const SITEURL = process.env.SITE_URL || `https://docs.ghost.org`;

const imageUrls = {
	faq: url.resolve(SITEURL, `/images/meta/Ghost-FAQ.jpg`),
	integrations: url.resolve(SITEURL, `/images/meta/Ghost-Integrations.jpg`),
	tutorials: url.resolve(SITEURL, `/images/meta/Ghost-Tutorials.jpg`),
	default: url.resolve(SITEURL, `/images/meta/Ghost-Docs.jpg`),
};

export const getMetaImageUrls = section => {
	// Set the default image if no section is passed
	section = section || `default`;

	return imageUrls[section];
};

getMetaImageUrls.proptypes = {
	section: PropTypes.string.isRequired,
};

export default getMetaImageUrls;
