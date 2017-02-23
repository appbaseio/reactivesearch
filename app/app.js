import reactivebase from "@appbaseio/reactivebase";
import { NestedList } from "./sensors/NestedList";

const combineObj = {
	NestedList
};

Object.keys(reactivebase).forEach((component) => {
	combineObj[component] = reactivebase[component];
});

module.exports = combineObj;
