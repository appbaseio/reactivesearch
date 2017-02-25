import reactivebase from "@appbaseio/reactivebase";
import NestedList from "./sensors/NestedList";
import ToggleList from "./sensors/ToggleList";
import DynamicRangeSlider from "./sensors/DynamicRangeSlider";
import TagCloud from "./sensors/TagCloud";

const combineObj = {
	NestedList,
	ToggleList,
	DynamicRangeSlider,
	TagCloud
};

Object.keys(reactivebase).forEach((component) => {
	combineObj[component] = reactivebase[component];
});

module.exports = combineObj;
