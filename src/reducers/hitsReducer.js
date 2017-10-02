import { UPDATE_HITS, REMOVE_COMPONENT } from "../constants";

export default function hitsReducer(state = {}, action) {
	if (action.type === UPDATE_HITS) {
		if (action.append) {
			return {
				...state,
				[action.component]: {
					hits: [...state[action.component].hits, ...action.hits],
					total: action.total
				}
			}
		}
		return {
			...state,
			[action.component]: { hits: action.hits, total: action.total }
		};
	} else if (action.type == REMOVE_COMPONENT) {
		const { [action.component]: del, ...obj } = state;
		return obj;
	}
	return state;
}
