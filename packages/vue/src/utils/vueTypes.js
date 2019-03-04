import VueTypes from 'vue-types';
// import dateFormats from './dateFormats';

VueTypes.sensibleDefaults = false;

const reactKeyType = VueTypes.oneOfType([
	VueTypes.string,
	VueTypes.arrayOf(VueTypes.string),
	VueTypes.object,
	VueTypes.arrayOf(VueTypes.object)
]);

function validateLocation(props, propName) {
	// eslint-disable-next-line
	if (isNaN(props[propName])) {
		return new Error(`${propName} value must be a VueTypes.number`);
	}
	if (propName === 'lat' && (props[propName] < -90 || props[propName] > 90)) {
		return new Error(`${propName} value should be between -90 and 90.`);
	}
	if (propName === 'lng' && (props[propName] < -180 || props[propName] > 180)) {
		return new Error(`${propName} value should be between -180 and 180.`);
	}
	return null;
}

const types = {
	any: VueTypes.any,
	bool: VueTypes.bool,
	boolRequired: VueTypes.bool.isRequired,
	components: VueTypes.arrayOf(VueTypes.string),
	children: VueTypes.any,
	data: VueTypes.arrayOf(VueTypes.object),
	dataFieldArray: VueTypes.oneOfType([
		VueTypes.string,
		VueTypes.arrayOf(VueTypes.string)
	]).isRequired,
	dataNumberBox: VueTypes.shape({
		label: VueTypes.string,
		start: VueTypes.number.isRequired,
		end: VueTypes.number.isRequired
	}).isRequired,
	date: VueTypes.oneOfType([
		VueTypes.string,
		VueTypes.arrayOf(VueTypes.string)
	]),
	dateObject: VueTypes.object,
	excludeFields: VueTypes.arrayOf(VueTypes.string),
	fieldWeights: VueTypes.arrayOf(VueTypes.number),
	filterLabel: VueTypes.string,
	func: VueTypes.func,
	funcRequired: VueTypes.func.isRequired,
	fuzziness: VueTypes.oneOf([0, 1, 2, 'AUTO']),
	headers: VueTypes.object,
	hits: VueTypes.arrayOf(VueTypes.object),
	iconPosition: VueTypes.oneOf(['left', 'right']),
	includeFields: VueTypes.arrayOf(VueTypes.string),
	labelPosition: VueTypes.oneOf(['left', 'right', 'top', 'bottom']),
	number: VueTypes.number,
	options: VueTypes.oneOfType([
		VueTypes.arrayOf(VueTypes.object),
		VueTypes.object
	]),
	paginationAt: VueTypes.oneOf(['top', 'bottom', 'both']),
	range: VueTypes.shape({
		start: VueTypes.number.isRequired,
		end: VueTypes.number.isRequired
	}),
	rangeLabels: VueTypes.shape({
		start: VueTypes.string.isRequired,
		end: VueTypes.string.isRequired
	}),
	react: VueTypes.shape({
		and: reactKeyType,
		or: reactKeyType,
		not: reactKeyType
	}),
	selectedValues: VueTypes.object,
	selectedValue: VueTypes.oneOfType([
		VueTypes.string,
		VueTypes.arrayOf(VueTypes.string),
		VueTypes.arrayOf(VueTypes.object),
		VueTypes.object,
		Number,
		VueTypes.arrayOf(Number)
	]),
	suggestions: VueTypes.arrayOf(VueTypes.object),
	supportedOrientations: VueTypes.oneOf([
		'portrait',
		'portrait-upside-down',
		'landscape',
		'landscape-left',
		'landscape-right'
	]),
	sortBy: VueTypes.oneOf(['asc', 'desc']),
	sortOptions: VueTypes.arrayOf(
		VueTypes.shape({
			label: VueTypes.string,
			dataField: VueTypes.string,
			sortBy: VueTypes.string
		})
	),
	sortByWithCount: VueTypes.oneOf(['asc', 'desc', 'count']),
	stats: VueTypes.arrayOf(VueTypes.object),
	string: VueTypes.string,
	stringArray: VueTypes.arrayOf(VueTypes.string),
	stringOrArray: VueTypes.oneOfType([
		VueTypes.string,
		VueTypes.arrayOf(VueTypes.string)
	]),
	stringRequired: VueTypes.string.isRequired,
	style: VueTypes.object,
	themePreset: VueTypes.oneOf(['light', 'dark']),
	// queryFormatDate: VueTypes.oneOf(VueTypes.object.keys(dateFormats)),
	queryFormatSearch: VueTypes.oneOf(['and', 'or']),
	queryFormatNumberBox: VueTypes.oneOf(['exact', 'lte', 'gte']),
	params: VueTypes.object.isRequired,
	props: VueTypes.object,
	rangeLabels: VueTypes.shape({
		start: VueTypes.string,
		end: VueTypes.string,
	}),
	rangeLabelsAlign: VueTypes.oneOf(['left', 'right']),
	title: VueTypes.oneOfType([VueTypes.string, VueTypes.any]),
	tooltipTrigger: VueTypes.oneOf(['always', 'none', 'hover']),
	location: VueTypes.shape({
		lat: validateLocation,
		lng: validateLocation
	}),
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
		'nauticalmiles'
	])
};

export default types;
