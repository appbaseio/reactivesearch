const packageJSON = require('./packages/web/package.json');

module.exports = {
	scripts: {
		web: {
			version: `scripts/version-update.sh "@appbaseio/reactivesearch" ${packageJSON.version}`,
		},
	},
};
