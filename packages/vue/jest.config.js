module.exports = {
	preset: '@vue/cli-plugin-unit-jest',
	transform: {
		'^.+\\.(js|jsx)$': 'babel-jest',
	},
	//snapshotSerializers: ['./serialize.js'],
	snapshotSerializers: ['dfs'],
	testMatch: ['**/*.test.[jt]s?(x)'],
};
