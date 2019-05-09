const packageJSON = require('./packages/web/package.json');
const path = require('path');

module.exports = {
	scripts: {
		upgrade: {
			description: 'Updates the ReactiveSearch version in all over the mono-repo.',
			default: `${path.resolve(
				`${__dirname}/scripts/version-update.sh`,
			)} "@appbaseio/reactivesearch" ${packageJSON.version}`,
		},
	},
};
