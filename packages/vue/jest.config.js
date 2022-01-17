module.exports = {
	preset: '@vue/cli-plugin-unit-jest',
	transform: {
		'^.+\\.(js|jsx)$': 'babel-jest',
	},
	snapshotSerializers: ['jest-vue-emotion'],
	testMatch: ['**/*.test.[jt]s?(x)'],
};
