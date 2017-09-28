import { ADD_APPBASE_REF } from "../constants";

export default function appbaseRefReducer(state = {}, action) {
	if (action.type === ADD_APPBASE_REF) {
		return action.appbaseRef;
	}
	return state;
}
