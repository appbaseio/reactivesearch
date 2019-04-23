const packageJSON = require('./packages/web/package.json');

module.exports = {
	scripts: {
		web: {
			example: `scripts/build-web-example.sh ${packageJSON.version}`,
			workspace: `scripts/update-web-workspace.sh ${packageJSON.version}`,
		},
	},
};
