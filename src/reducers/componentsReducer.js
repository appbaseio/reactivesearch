import { ADD_COMPONENT, REMOVE_COMPONENT } from "../constants";

export default function componentsReducer(state = [], action) {
	if (action.type === ADD_COMPONENT) {
		return [...state, action.component];
	} else if (action.type === REMOVE_COMPONENT) {
		return state.filter(element => element !== action.component);
	}
	return state;
}
