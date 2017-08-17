import { SET_QUERY_OPTIONS, REMOVE_COMPONENT } from "../constants";

export default function queryOptionsReducer(state = {}, action) {
	if (action.type === SET_QUERY_OPTIONS) {
		return { ...state, [action.component]: action.options }
	} else if (action.type == REMOVE_COMPONENT) {
		const { [action.component]: del, ...obj } = state;
		return obj;
	}
	return state;
}
