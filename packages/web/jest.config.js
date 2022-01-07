// jest.config.js
module.exports = {
	verbose: true,
	testURL: 'http://localhost/',
	// ... other config
	snapshotSerializers: [
		'@emotion/jest/serializer' /* if needed other snapshotSerializers should go here */,
	],
};
