import reactivebase from "@appbaseio/reactivebase";
import NestedList from "./sensors/NestedList";
import ToggleList from "./sensors/ToggleList";

const combineObj = {
	NestedList,
	ToggleList
};

Object.keys(reactivebase).forEach((component) => {
	combineObj[component] = reactivebase[component];
});

module.exports = combineObj;
