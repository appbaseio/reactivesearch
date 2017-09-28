import { combineReducers } from "redux";

import componentsReducer from "./componentsReducer";
import watchManReducer from "./watchManReducer";
import dependencyTreeReducer from "./dependencyTreeReducer";
import queryReducer from "./queryReducer";
import queryOptionsReducer from "./queryOptionsReducer";
import configReducer from "./configReducer";
import appbaseRefReducer from "./appbaseRefReducer";
import hitsReducer from "./hitsReducer";
import aggsReducer from "./aggsReducer";

export default combineReducers({
	components: componentsReducer,
	watchMan: watchManReducer,
	queryList: queryReducer,
	queryOptions: queryOptionsReducer,
	dependencyTree: dependencyTreeReducer,
	appbaseRef: appbaseRefReducer,
	config: configReducer,
	hits: hitsReducer,
	aggregations: aggsReducer
});
