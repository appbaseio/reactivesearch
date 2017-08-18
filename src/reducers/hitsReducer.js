import { UPDATE_HITS, REMOVE_COMPONENT } from "../constants";

export default function hitsReducer(state = {}, action) {
	if (action.type === UPDATE_HITS) {
		if (action.append) {
			return { ...state, [action.component]: [...state[action.component], ...action.hits]}
		}
		return { ...state, [action.component]: action.hits };
	} else if (action.type == REMOVE_COMPONENT) {
		const { [action.component]: del, ...obj } = state;
		return obj;
	}
	return state;
}
