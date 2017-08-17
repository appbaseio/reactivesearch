import { combineReducers } from "redux";

import componentsReducer from "./componentsReducer";
import watchManReducer from "./watchManReducer";
import dependencyTreeReducer from "./dependencyTreeReducer";
import queryReducer from "./queryReducer";
import queryOptionsReducer from "./queryOptionsReducer";
import configReducer from "./configReducer";
import hitsReducer from "./hitsReducer";

export default combineReducers({
	components: componentsReducer,
	watchMan: watchManReducer,
	queryList: queryReducer,
	queryOptions: queryOptionsReducer,
	dependencyTree: dependencyTreeReducer,
	config: configReducer,
	hits: hitsReducer
});
