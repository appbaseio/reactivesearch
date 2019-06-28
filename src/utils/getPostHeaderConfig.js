import PropTypes from 'prop-types';

export const getPostHeaderConfig = ({ pathname }) => {
	const postHeaderConfig = {
		bgClass: `bg-api-reference`,
	};

	if (pathname.match(/^\/javascript\//i)) {
		postHeaderConfig.title = `Javascript API Reference`;
		postHeaderConfig.mainLink = `/javascript/quickstart`;
	}

	if (pathname.match(/^\/examples\//i)) {
		postHeaderConfig.title = `Interactive Examples`;
		postHeaderConfig.mainLink = `/examples/js`;
	}

	if (pathname.match(/^\/rest\//i)) {
		postHeaderConfig.title = `REST API Reference`;
		postHeaderConfig.mainLink = `/rest/quickstart`;
	}

	if (pathname.match(/^\/go\//i)) {
		postHeaderConfig.title = `GO API Reference`;
		postHeaderConfig.mainLink = `/go/quickstart`;
	}

	if (pathname.match(/^\/concepts\//i)) {
		postHeaderConfig.title = `Core Concepts`;
		postHeaderConfig.mainLink = `/concepts/introduction/`;
		postHeaderConfig.bgClass = `bg-concepts`;
	}

	if (pathname.match(/^\/reactivesearch\//i)) {
		postHeaderConfig.title = `ReactiveSearch`;
		postHeaderConfig.mainLink = `/reactivesearch/v3/overview/quickstart/`;
		postHeaderConfig.bgClass = `bg-concepts`;
	}

	return postHeaderConfig;
};

getPostHeaderConfig.proptypes = {
	pathname: PropTypes.string.isRequired,
};

export default getPostHeaderConfig;
