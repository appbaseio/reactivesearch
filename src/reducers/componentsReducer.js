import { ADD_COMPONENT } from "../constants";

export default function componentsReducer(state = [], action) {
	if (action.type === ADD_COMPONENT) {
		return [...state, action.component];
	}
	return state;
}
