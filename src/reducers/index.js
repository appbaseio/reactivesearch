import { combineReducers } from "redux";

import componentsReducer from "./componentsReducer";
import watchManReducer from "./watchManReducer";
import dependencyTreeReducer from "./dependencyTreeReducer";
import queryReducer from "./queryReducer";
import configReducer from "./configReducer";
import hitsReducer from "./hitsReducer";

export default combineReducers({
	components: componentsReducer,
	watchMan: watchManReducer,
	queryList: queryReducer,
	dependencyTree: dependencyTreeReducer,
	config: configReducer,
	hits: hitsReducer
});
