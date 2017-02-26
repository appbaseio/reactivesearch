import reactivebase from "@appbaseio/reactivebase";
import NestedList from "./sensors/NestedList";
import ToggleList from "./sensors/ToggleList";
import DynamicRangeSlider from "./sensors/DynamicRangeSlider";
import TagCloud from "./sensors/TagCloud";
import RatingsFilter from "./sensors/RatingsFilter";

const combineObj = {
	NestedList,
	ToggleList,
	DynamicRangeSlider,
	TagCloud,
	RatingsFilter
};

Object.keys(reactivebase).forEach((component) => {
	combineObj[component] = reactivebase[component];
});

module.exports = combineObj;
