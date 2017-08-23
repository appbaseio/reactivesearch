import { UPDATE_AGGS, REMOVE_COMPONENT } from "../constants";

export default function aggsReducer(state = {}, action) {
	if (action.type === UPDATE_AGGS) {
		return { ...state, [action.component]: action.aggregations };
	} else if (action.type == REMOVE_COMPONENT) {
		const { [action.component]: del, ...obj } = state;
		return obj;
	}
	return state;
}
