import { SET_QUERY } from "../constants";

export default function queryReducer(state = {}, action) {
	if (action.type === SET_QUERY) {
		state[action.component] = action.query;
	}
	return state;
}
