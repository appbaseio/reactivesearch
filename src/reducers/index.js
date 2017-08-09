import { combineReducers } from "redux";

import componentsReducer from "./componentsReducer";

export default combineReducers({
	components: componentsReducer
});
