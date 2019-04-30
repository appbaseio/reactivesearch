import PropTypes from 'prop-types';

const getSidebarFile = sidebar => {
	console.log('Here', sidebar);

	try {
		// declare as var here, so it's accessible outside of the try scope
		var [sidebarfile] = require(`../../../data/sidebars/${sidebar}.yaml`);
	} catch (e) {
		// TODO: make clear error handling here
		console.error(e);
		throw e;
	}

	return sidebarfile;
};

getSidebarFile.propTypes = {
	sidebar: PropTypes.string.isRequired,
};

export default getSidebarFile;
