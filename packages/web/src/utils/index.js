/* eslint-disable */
// flattens a nested array
const flatten = arr => (
	arr.reduce((flat, toFlatten) =>
		flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten), [])
);

const extractSuggestion = (val) => {
	switch (typeof val) {
		case 'string':
			return val.toLowerCase();
		case 'object':
			if (Array.isArray(val)) {
				return flatten(val);
			}
			return null;

		default:
			return val;
	}
};

export const getSuggestions = (fields, suggestions, currentValue) => {
	let suggestionsList = [];
	let labelsList = [];

	const populateSuggestionsList = (val) => {
		// check if the suggestion includes the current value
		// and not already included in other suggestions
		const isWordMatch = currentValue.trim().split(' ').some(term => val.includes(term));
		if (isWordMatch && !labelsList.includes(val)) {
			const option = {
				label: val,
				value: val,
			};
			labelsList = [...labelsList, val];
			suggestionsList = [...suggestionsList, option];
		}
	};

	suggestions.forEach((item) => {
		fields.forEach((field) => {
			const label = item._source[field];
			if (label) {
				const val = extractSuggestion(label);
				if (val) {
					if (Array.isArray(val)) {
						val.forEach(suggestion => populateSuggestionsList(suggestion));
					} else {
						populateSuggestionsList(val);
					}
				}
			}
		});
	});

	return suggestionsList;
};

export function shade(color, percent) {
	const f = parseInt(color.slice(1), 16);
	const t = percent < 0 ? 0 : 255;
	const p = percent < 0 ? percent * -1 : percent;
	const R = f >> 16;
	const G = (f >> 8) & 0x00ff;
	const B = f & 0x0000ff;

	return (
		'#' +
		(
			0x1000000 +
			(Math.round((t - R) * p) + R) * 0x10000 +
			(Math.round((t - G) * p) + G) * 0x100 +
			(Math.round((t - B) * p) + B)
		)
			.toString(16)
			.slice(1)
	);
}
