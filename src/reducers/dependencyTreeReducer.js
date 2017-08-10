import { WATCH_COMPONENT } from "../constants";

export default function dependencyTreeReducer(state = {}, action) {
	if (action.type === WATCH_COMPONENT) {
		state[action.component] = action.react;
	}
	return state;
}
