const packageJSON = require('./packages/web/package.json');
const reactivecoreVersion = require('./packages/reactivecore/package.json');
const vueRSVersion = require('./packages/vue/package.json');
const path = require('path');

module.exports = {
	scripts: {
		upgrade: {
			description: 'Updates the ReactiveSearch version in all over the mono-repo.',
			// To update reactivesearch version
			default: `${path.resolve(
				`${__dirname}/scripts/version-update.sh`,
			)} "@appbaseio/reactivesearch" ${packageJSON.version} ${__dirname}`,
		},
		'upgrade-core': {
			description: 'Updates the Reactivecore version in all over the mono-repo.',
			// To update reactivecore version
			default: `${path.resolve(
				`${__dirname}/scripts/version-update.sh`,
			)} "@appbaseio/reactivecore" ${reactivecoreVersion.version} ${__dirname}`,
		},
		'upgrade-vue': {
			description: 'Updates the ReactiveSearch Vue version in all over the mono-repo.',
			// To update reactivesearch vue version
			default: `${path.resolve(
				`${__dirname}/scripts/version-update.sh`,
			)} "@appbaseio/reactivesearch-vue" ${vueRSVersion.version} ${__dirname}`,
		},
	},
};
