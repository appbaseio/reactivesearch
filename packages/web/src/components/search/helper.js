import { parseHits } from '@appbaseio/reactivecore/lib/utils/helper';
import getSuggestions from '@appbaseio/reactivecore/lib/utils/suggestions';

function handleOnSuggestions(results) {
	const { parseSuggestion, promotedResults } = this.props;

	const fields = Array.isArray(this.props.dataField)
		? this.props.dataField
		: [this.props.dataField];

	let newResults = parseHits(results);

	if (promotedResults.length) {
		const ids = promotedResults.map(item => item._id).filter(Boolean);
		if (ids) {
			newResults = newResults.filter(item => !ids.includes(item._id));
		}
		newResults = [...promotedResults, ...newResults];
	}

	const parsedSuggestions = getSuggestions(
		fields,
		newResults,
		this.state.currentValue.toLowerCase(),
	);

	if (parseSuggestion) {
		return parsedSuggestions.map(suggestion => parseSuggestion(suggestion));
	}

	return parsedSuggestions;
}

export default handleOnSuggestions;
