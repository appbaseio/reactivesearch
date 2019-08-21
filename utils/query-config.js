const markdownQueryConfig = [
	{
		section: `concepts`,
		indexName: `concept`,
		niceName: `Concepts`,
	},
	{
		section: `setup`,
		indexName: `setup`,
		niceName: `Setup Guide`,
	},
	{
		section: `api`,
		indexName: `api`,
		niceName: `API Reference`,
	},
];

module.exports = {
	defaultMarkdownSection: `setup`,
	markdownQueryConfig,
	searchConfig: markdownQueryConfig.reduce((acc, { indexName, niceName }) => {
		acc[indexName] = niceName;
		return acc;
	}, {}),
};
