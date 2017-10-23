import { LOG_QUERY, REMOVE_COMPONENT } from "../constants";

export default function logsReducer(state = {}, action) {
	if (action.type === LOG_QUERY) {
		return { ...state, [action.component]: action.query };
	} else if (action.type == REMOVE_COMPONENT) {
		const { [action.component]: del, ...obj } = state;
		return obj;
	}
	return state;
}
