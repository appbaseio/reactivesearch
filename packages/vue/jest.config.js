module.exports = {
	// preset: '@vue/cli-plugin-unit-jest',
	// transform: {
	// 	'^.+\\.(js|jsx)$': 'babel-jest',
	// },
	verbose: true,
	collectCoverage: false,
	testURL: 'http://localhost/',
	testEnvironment: 'jest-environment-jsdom-fifteen',
	// snapshotSerializers: ['./serialize.js'],
	// snapshotSerializers: ['dfs'],
	// snapshotSerializers: [
	// 	'@emotion/jest/serializer' /* if needed other snapshotSerializers should go here */,
	// ],
	snapshotSerializers: ['jest-serializer-vue', '@emotion/jest/serializer'],
	testMatch: ['**/*.test.[jt]s?(x)'],
};
