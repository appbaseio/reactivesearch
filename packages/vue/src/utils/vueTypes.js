import VueTypes from 'vue-types';
// import dateFormats from './dateFormats';

VueTypes.sensibleDefaults = false;

const reactKeyType = VueTypes.oneOfType([
	VueTypes.string,
	VueTypes.arrayOf(VueTypes.string),
	VueTypes.object,
	VueTypes.arrayOf(VueTypes.object),
]);

function validateLocation(value) {
	if (!value || !value.lat || !value.lng) {
		console.error(new Error('location must be an object with lat and lng keys defined'));
		return false;
	}
	// eslint-disable-next-line
	if (isNaN(value.lat)) {
		console.error(new Error('lat value must be a number'));
		return false;
	}
	// eslint-disable-next-line
	if (isNaN(value.lat)) {
		console.error(new Error('lng value must be a number'));
		return false;
	}
	if (value.lat < -90 || value.lat > 90) {
		console.error(new Error('lat value should be between -90 and 90.'));
		return false;
	}
	if (value.lat < -180 || value.lat > 180) {
		console.error(new Error('lng value should be between -180 and 180.'));
		return false;
	}
	return true;
}

const types = {
	any: VueTypes.any,
	bool: VueTypes.bool,
	boolRequired: {
		type: Boolean,
		required: true
	},
	components: VueTypes.arrayOf(VueTypes.string),
	compoundClause: VueTypes.oneOf(['filter', 'must']),
	children: VueTypes.any,
	data: VueTypes.arrayOf(VueTypes.object),
	dataFieldArray: VueTypes.oneOfType([VueTypes.string, VueTypes.arrayOf(VueTypes.string)])
		.isRequired,
	dataNumberBox: VueTypes.shape({
		label: VueTypes.string,
		start: VueTypes.number.isRequired,
		end: VueTypes.number.isRequired,
	}).isRequired,
	date: VueTypes.oneOfType([VueTypes.string, VueTypes.arrayOf(VueTypes.string)]),
	dateObject: VueTypes.object,
	excludeFields: VueTypes.arrayOf(VueTypes.string),
	fieldWeights: VueTypes.arrayOf(VueTypes.number),
	filterLabel: VueTypes.string,
	func: {
		type: Function,
		required: false
	},
	funcRequired: VueTypes.func.isRequired,
	fuzziness: VueTypes.oneOf([0, 1, 2, 'AUTO']),
	headers: VueTypes.object,
	hits: VueTypes.arrayOf(VueTypes.object),
	iconPosition: VueTypes.oneOf(['left', 'right']),
	includeFields: VueTypes.arrayOf(VueTypes.string),
	labelPosition: VueTypes.oneOf(['left', 'right', 'top', 'bottom']),
	number: VueTypes.number,
	options: VueTypes.oneOfType([VueTypes.arrayOf(VueTypes.object), VueTypes.object]),
	paginationAt: VueTypes.oneOf(['top', 'bottom', 'both']),
	range: VueTypes.shape({
		start: VueTypes.number.isRequired,
		end: VueTypes.number.isRequired,
	}),
	rangeLabels: VueTypes.shape({
		start: VueTypes.string.isRequired,
		end: VueTypes.string.isRequired,
	}),
	react: VueTypes.shape({
		and: reactKeyType,
		or: reactKeyType,
		not: reactKeyType,
	}),
	selectedValues: VueTypes.object,
	selectedValue: VueTypes.oneOfType([
		VueTypes.string,
		VueTypes.arrayOf(VueTypes.string),
		VueTypes.arrayOf(VueTypes.object),
		VueTypes.object,
		Number,
		VueTypes.arrayOf(Number),
	]),
	suggestions: VueTypes.arrayOf(VueTypes.object),
	supportedOrientations: VueTypes.oneOf([
		'portrait',
		'portrait-upside-down',
		'landscape',
		'landscape-left',
		'landscape-right',
	]),
	sortBy: VueTypes.oneOf(['asc', 'desc']),
	sortOptions: VueTypes.arrayOf(
		VueTypes.shape({
			label: VueTypes.string,
			dataField: VueTypes.string,
			sortBy: VueTypes.string,
		}),
	),
	sortByWithCount: VueTypes.oneOf(['asc', 'desc', 'count']),
	stats: VueTypes.arrayOf(VueTypes.object),
	string: {
		type: String,
		required: false
	},
	stringArray: {
		type: [String],
		required: false
	},
	stringOrArray: VueTypes.oneOfType([VueTypes.string, VueTypes.arrayOf(VueTypes.string)]),
	stringRequired: VueTypes.string.isRequired,
	style: VueTypes.object,
	themePreset: VueTypes.oneOf(['light', 'dark']),
	// queryFormatDate: VueTypes.oneOf(VueTypes.object.keys(dateFormats)),
	queryFormatSearch: VueTypes.oneOf(['and', 'or']),
	queryFormatNumberBox: VueTypes.oneOf(['exact', 'lte', 'gte']),
	params: VueTypes.object.isRequired,
	props: VueTypes.object,
	rangeLabelsAlign: VueTypes.oneOf(['left', 'right']),
	title: VueTypes.oneOfType([VueTypes.string, VueTypes.nullable]),
	tooltipTrigger: VueTypes.oneOf(['always', 'none', 'hover']),
	location: VueTypes.custom(validateLocation),
	unit: VueTypes.oneOf([
		'mi',
		'miles',
		'yd',
		'yards',
		'ft',
		'feet',
		'in',
		'inch',
		'km',
		'kilometers',
		'm',
		'meters',
		'cm',
		'centimeters',
		'mm',
		'millimeters',
		'NM',
		'nmi',
		'nauticalmiles',
	]),
	value: VueTypes.string.def(undefined),
	reactivesearchAPIConfig: VueTypes.shape({
		recordAnalytics: VueTypes.bool,
		emptyQuery: VueTypes.bool,
		suggestionAnalytics: VueTypes.bool,
		enableQueryRules: VueTypes.bool,
		enableSearchRelevancy: VueTypes.bool,
		userId: VueTypes.string,
		useCache: VueTypes.bool,
		customEvents: VueTypes.object,
		enableTelemetry: VueTypes.bool.def(true),
	}).def({}),
	mongodb: VueTypes.shape({
		db: VueTypes.string,
		collection: VueTypes.string,
	}),
	endpointConfig: VueTypes.shape({
		url: VueTypes.string.isRequired,
		method: VueTypes.string,
		headers: VueTypes.object,
		body: VueTypes.object,
	}),
	AIConfig: VueTypes.shape({
		systemPrompt: VueTypes.string,
		topDocsForContext: VueTypes.number,
		maxTokens: VueTypes.number,
		docTemplate: VueTypes.string,
		queryTemplate: VueTypes.string,
		temperature: VueTypes.number,
	}),
	AIUIConfig: VueTypes.shape({
		loaderMessage: VueTypes.string, // slot #loaderMessage should also be supported
		showSourceDocuments: VueTypes.bool,
		renderSourceDocument: VueTypes.func,
		onSourceClick: VueTypes.func,
		// renderAskButton: VueTypes.func,has to be a slot
		askButton: VueTypes.bool,
		showFeedback: VueTypes.bool,
	}),
};

export default types;
