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

// eslint-disable-next-line
export const getSuggestions = (fields, suggestions, currentValue) => {
	let suggestionsList = [];
	let labelsList = [];

	const populateSuggestionsList = (val) => {
		// check if the suggestion includes the current value
		// and not already included in other suggestions
		const isWordMatch = currentValue.split(' ').some(term => val.includes(term));
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
