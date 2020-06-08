const path = require('path');
// eslint-disable-next-line
const npsUtils = require('nps-utils');
const packageJSON = require('./packages/web/package.json');
const reactivecoreVersion = require('./packages/reactivecore/package.json');
const vueRSVersion = require('./packages/vue/package.json');
const mapRSVersion = require('./packages/maps/package.json');

const { series } = npsUtils;

module.exports = {
	scripts: {
		upgrade: {
			description: 'Updates the ReactiveSearch version in all over the mono-repo.',
			'version-update': `${path.resolve(
				`${__dirname}/scripts/version-update.sh`,
			)} "@appbaseio/reactivesearch" ${packageJSON.version} ${__dirname}`,
			'build-demos': `${path.resolve(`${__dirname}/scripts/build-demos.sh`)} ${__dirname}`,
			'deploy-storybook': `${path.resolve(
				`${__dirname}/scripts/deploy-storybook.sh`,
			)} ${__dirname}`,
			'build-umd': packageJSON.scripts['build:umd'],
			// Updates version + deploy storybook + build demos
			default: series.nps(
				'upgrade.version-update',
				'upgrade.build-umd',
				'upgrade.deploy-storybook',
				'upgrade.build-demos',
			),
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
		'upgrade-maps': {
			description: 'Updates the ReactiveMaps version in all over the mono-repo.',
			// To update reactivemaps version
			'version-update': `${path.resolve(
				`${__dirname}/scripts/version-update.sh`,
			)} "@appbaseio/reactivemaps" ${mapRSVersion.version} ${__dirname}`,
			'build-demos': `${path.resolve(`${__dirname}/scripts/build-demos.sh`)} ${__dirname}`,
			'deploy-storybook': `${path.resolve(
				`${__dirname}/scripts/deploy-storybook.sh`,
			)} ${__dirname}`,
			default: series.nps(
				'upgrade-maps.version-update',
				'upgrade-maps.build-demos',
				'upgrade-maps.deploy-storybook',
			),
		},
	},
};
