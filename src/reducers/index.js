import { combineReducers } from "redux";

import componentsReducer from "./componentsReducer";
import watchManReducer from "./watchManReducer";
import dependencyTreeReducer from "./dependencyTreeReducer";
import queryReducer from "./queryReducer";

export default combineReducers({
	components: componentsReducer,
	watchMan: watchManReducer,
	queryList: queryReducer,
	dependencyTree: dependencyTreeReducer
});
