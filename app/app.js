import reactivemaps from "@appbaseio/reactivemaps";
import NestedList from "./sensors/NestedList";
import ToggleList from "./sensors/ToggleList";
import DynamicRangeSlider from "./sensors/DynamicRangeSlider";
import TagCloud from "./sensors/TagCloud";
import RatingsFilter from "./sensors/RatingsFilter";
import CategorySearch from "./sensors/CategorySearch";
import MultiLevelMenu from "./sensors/MultiLevelMenu";

import ResultCard from "./actuators/ResultCard";
import ResultList from "./actuators/ResultList";
import ViewSwitcher from "./actuators/ViewSwitcher";

const combineObj = {
	NestedList,
	ToggleList,
	DynamicRangeSlider,
	TagCloud,
	RatingsFilter,
	CategorySearch,
	MultiLevelMenu,
	ResultCard,
	ResultList,
	ViewSwitcher
};

Object.keys(reactivemaps).forEach((component) => {
	combineObj[component] = reactivemaps[component];
});

module.exports = combineObj;
