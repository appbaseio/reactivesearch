// jest.config.js
module.exports = {
	// ... other config
	snapshotSerializers: [
		'@emotion/jest/serializer' /* if needed other snapshotSerializers should go here */,
	],
};
