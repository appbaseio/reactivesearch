import { WATCH_COMPONENT, REMOVE_COMPONENT } from "../constants";

export default function dependencyTreeReducer(state = {}, action) {
	if (action.type === WATCH_COMPONENT) {
		return { ...state, [action.component]: action.react };
	} else if (action.type == REMOVE_COMPONENT) {
		const { [action.component]: del, ...obj } = state;
		return obj;
	}
	return state;
}
