import reactivebase from "@appbaseio/reactivebase";
import NestedList from "./sensors/NestedList";
import ToggleList from "./sensors/ToggleList";
import DynamicRangeSlider from "./sensors/DynamicRangeSlider";
import TagCloud from "./sensors/TagCloud";
import RatingsFilter from "./sensors/RatingsFilter";
import CategorySearch from "./sensors/CategorySearch";
import MultiLevelMenu from "./sensors/MultiLevelMenu";

import ResultCard from "./actuators/ResultCard";
import ResultList from "./actuators/ResultList";

const combineObj = {
	NestedList,
	ToggleList,
	DynamicRangeSlider,
	TagCloud,
	RatingsFilter,
	CategorySearch,
	MultiLevelMenu,
	ResultCard,
	ResultList
};

Object.keys(reactivebase).forEach((component) => {
	combineObj[component] = reactivebase[component];
});

module.exports = combineObj;
